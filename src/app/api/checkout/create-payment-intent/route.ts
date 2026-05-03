import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface CartItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, couponCode, shippingMethod = 'standard', guestEmail } = body as {
      items: CartItemInput[];
      couponCode?: string;
      shippingMethod?: 'standard' | 'express' | 'nextday';
      guestEmail?: string;
    };

    const session = await getServerSession(authOptions);

    // Server-side price verification
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    const COUPONS: Record<string, number> = { PERSONA10: 0.10, SAVE15: 0.15, WELCOME20: 0.20 };
    const SHIPPING_COSTS: Record<string, number> = { standard: 5.99, express: 12.99, nextday: 24.99 };

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const price = product.salePrice ?? product.price;
      subtotal += price * item.quantity;
      return { productId: product.id, name: product.name, brand: product.brand, imageUrl: JSON.parse(product.images)[0] || null, price, quantity: item.quantity, size: item.size, color: item.color };
    });

    const shipping = subtotal > 50 ? 0 : SHIPPING_COSTS[shippingMethod];
    const tax = subtotal * 0.08;
    const discountRate = couponCode ? (COUPONS[couponCode.toUpperCase()] ?? 0) : 0;
    const discount = subtotal * discountRate;
    const total = subtotal + shipping + tax - discount;
    const totalInCents = Math.round(total * 100);

    // Generate order number
    const orderNumber = `PERSONA-${Date.now().toString(36).toUpperCase()}`;

    // Create order in DB (pending)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user ? session.user.id : undefined,
        guestEmail: guestEmail,
        status: 'pending',
        items: { create: orderItems },
        shippingAddressJson: JSON.stringify(body.shippingAddress || {}),
        subtotal,
        shipping,
        tax,
        discount,
        total,
        couponCode: couponCode || null,
      },
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalInCents,
      currency: 'usd',
      metadata: { orderId: order.id, orderNumber },
      automatic_payment_methods: { enabled: true },
    });

    // Save stripePaymentIntentId to order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      orderNumber,
      total,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
