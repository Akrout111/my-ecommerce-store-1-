import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const order = await prisma.order.update({
        where: { stripePaymentIntentId: pi.id },
        data: { status: 'paid', paidAt: new Date() },
        include: { items: true },
      });

      // Increment coupon usage if a coupon was applied
      if (order.couponCode) {
        try {
          const { incrementCouponUsage } = await import('@/lib/coupon-service');
          await incrementCouponUsage(order.couponCode);
        } catch {
          // Non-critical — don't fail the webhook for coupon usage tracking
        }
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;

      // Mark order as failed
      const order = await prisma.order.update({
        where: { stripePaymentIntentId: pi.id },
        data: { status: 'failed' },
        include: { items: true },
      });

      // Reverse stock deduction for each item
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockCount: { increment: item.quantity },
          },
        });
        const updated = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (updated && updated.stockCount > 0) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { inStock: true },
          });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
