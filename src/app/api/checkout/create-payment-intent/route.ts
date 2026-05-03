import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getShippingCost } from '@/lib/shipping';
import { TAX_RATE } from '@/lib/constants';
import { validateCoupon } from '@/lib/coupon-service';
import type { ShippingMethod } from '@/lib/shipping';

interface CartItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, couponCode, shippingMethod = 'standard', guestEmail, shippingAddress } = body as {
      items: CartItemInput[];
      couponCode?: string;
      shippingMethod?: ShippingMethod;
      guestEmail?: string;
      shippingAddress?: Record<string, string>;
    };

    const session = await getServerSession(authOptions);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Phase 1: Database transaction — check stock, deduct stock, create order
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = crypto.randomUUID().slice(0, 6).toUpperCase();
    const orderNumber = `PF-${datePart}-${randomPart}`;
    const productIds = items.map((i) => i.productId);

    const result = await prisma.$transaction(async (tx) => {
      // Fetch products for price verification and stock check
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      // Check stock availability for all items
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (!product.inStock || product.stockCount < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      // Calculate prices using server-verified data
      let subtotal = 0;
      const orderItems = items.map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const product = products.find((p) => p.id === item.productId)!;
        const price = product.salePrice ?? product.price;
        subtotal += price * item.quantity;
        return {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          imageUrl: JSON.parse(product.images)[0] || null,
          price,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
        };
      });

      // Calculate shipping, tax, discount
      const shipping = getShippingCost(subtotal, shippingMethod);
      const tax = subtotal * TAX_RATE;

      // Validate coupon server-side
      let discount = 0;
      let validatedCouponCode: string | null = null;
      if (couponCode) {
        const couponResult = await validateCoupon(couponCode, subtotal);
        if (couponResult.valid) {
          discount = couponResult.discount;
          validatedCouponCode = couponResult.coupon?.code ?? couponCode.toUpperCase();
        }
      }

      const total = subtotal + shipping + tax - discount;

      // Decrement stock for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockCount: { decrement: item.quantity },
          },
        });

        // Re-check and set inStock correctly
        const updated = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (updated && updated.stockCount > 0) {
          await tx.product.update({
            where: { id: item.productId },
            data: { inStock: true },
          });
        } else if (updated) {
          await tx.product.update({
            where: { id: item.productId },
            data: { inStock: false },
          });
        }
      }

      // Create order with status "pending"
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user ? session.user.id : undefined,
          guestEmail: guestEmail || null,
          status: 'pending',
          items: { create: orderItems },
          shippingAddressJson: JSON.stringify(shippingAddress || {}),
          subtotal,
          shipping,
          tax,
          discount,
          total,
          couponCode: validatedCouponCode,
        },
      });

      return { order, total, subtotal, shipping, tax, discount };
    });

    // Phase 2: Call Stripe API outside the transaction
    let paymentIntent;
    try {
      const totalInCents = Math.round(result.total * 100);
      paymentIntent = await stripe.paymentIntents.create({
        amount: totalInCents,
        currency: 'usd',
        metadata: { orderId: result.order.id, orderNumber },
        automatic_payment_methods: { enabled: true },
      });

      // Update order with Stripe PaymentIntent ID
      await prisma.order.update({
        where: { id: result.order.id },
        data: { stripePaymentIntentId: paymentIntent.id },
      });
    } catch (stripeError) {
      // Stripe call failed — mark order as abandoned
      await prisma.order.update({
        where: { id: result.order.id },
        data: { status: 'abandoned' },
      });

      // Reverse stock deduction
      for (const item of items) {
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

      const message =
        stripeError instanceof Error ? stripeError.message : 'Payment processing failed';
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: result.order.id,
      orderNumber,
      total: result.total,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    // If stock error, return 409 Conflict
    if (message.includes('Insufficient stock')) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
