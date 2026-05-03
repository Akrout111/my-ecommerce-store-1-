import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AccountDashboard } from '@/components/account/AccountDashboard';
import { prisma } from '@/lib/db';

export const metadata = { title: 'My Account | Persona' };

function safeJsonParse(str: string, fallback: any) {
  try { return JSON.parse(str); } catch { return fallback; }
}

export default async function AccountPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/auth/login');

  const userId = (session.user as any).id;

  // Fetch orders
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  }).catch(() => []);

  // Fetch wishlist items with product
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: true },
    take: 50,
  }).catch(() => []);

  // Fetch addresses
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  }).catch(() => []);

  // Parse products
  const parseProduct = (p: any) => ({
    ...p,
    images: safeJsonParse(p.images, []),
    sizes: safeJsonParse(p.sizes, []),
    colors: safeJsonParse(p.colors, []),
    tags: safeJsonParse(p.tags ?? '[]', []),
  });

  const wishlist = wishlistItems.map((w: any) => parseProduct(w.product || {})).filter((p: any) => p.id);

  // Map orders to the format AccountDashboard expects
  const mappedOrders = orders.map((order: any) => ({
    id: order.orderNumber || order.id,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
    status: order.status as any,
    items: order.items.map((item: any) => ({
      name: item.name,
      image: item.imageUrl || undefined,
      size: item.size || undefined,
      color: item.color || undefined,
      qty: item.quantity,
      price: item.price,
    })),
    total: order.total,
    shippingAddress: order.shippingAddressJson || '',
    paymentMethod: order.stripePaymentIntentId ? 'Card' : 'N/A',
    trackingNumber: undefined,
  }));

  // Map addresses
  const mappedAddresses = addresses.map((addr: any) => ({
    id: addr.id,
    label: addr.label || 'Home',
    firstName: addr.firstName || '',
    lastName: addr.lastName || '',
    street: addr.street || '',
    city: addr.city || '',
    state: addr.state || '',
    postalCode: addr.postalCode || '',
    country: addr.country || '',
    phone: addr.phone || '',
    isDefault: addr.isDefault || false,
  }));

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4">
        <AccountDashboard
          user={{
            id: userId,
            name: session.user.name || '',
            email: session.user.email || '',
            image: session.user.image || undefined,
          }}
          orders={mappedOrders as any}
          wishlist={wishlist}
          addresses={mappedAddresses as any}
        />
      </div>
    </main>
  );
}
