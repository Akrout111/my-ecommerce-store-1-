import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { OrderConfirmationClient } from './OrderConfirmationClient';

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  // Parse shipping address
  let shippingAddress: Record<string, string> = {};
  try {
    shippingAddress = JSON.parse(order.shippingAddressJson);
  } catch {
    // ignore parse errors
  }

  const orderData = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    discount: order.discount,
    total: order.total,
    couponCode: order.couponCode,
    guestEmail: order.guestEmail,
    shippingAddress,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    })),
  };

  return <OrderConfirmationClient order={orderData} />;
}
