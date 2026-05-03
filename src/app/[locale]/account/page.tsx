import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AccountDashboard } from '@/components/account/AccountDashboard';
import { prisma } from '@/lib/db';
import type { Product } from '@/types/product';

export const metadata = { title: 'My Account | Persona' };

function safeJsonParse(str: string, fallback: unknown) {
  try { return JSON.parse(str); } catch { return fallback; }
}

function parseProduct(p: {
  id: string; name: string; nameAr?: string | null;
  description: string; descriptionAr?: string | null;
  price: number; salePrice?: number | null; brand: string;
  images: string; category: string; subcategory?: string | null;
  sizes: string; colors: string;
  rating: number; reviewCount: number;
  inStock: boolean; stockCount: number;
  isFeatured?: boolean; isNew: boolean; isBestSeller: boolean;
  tags?: string | null;
  createdAt: Date; updatedAt: Date;
}): Product {
  return {
    id: p.id,
    name: p.name,
    nameAr: p.nameAr,
    description: p.description,
    descriptionAr: p.descriptionAr,
    price: p.price,
    salePrice: p.salePrice ?? undefined,
    brand: p.brand,
    images: safeJsonParse(p.images, []) as string[],
    category: p.category,
    subcategory: p.subcategory,
    sizes: safeJsonParse(p.sizes, []) as string[],
    colors: safeJsonParse(p.colors, []) as string[],
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    stockCount: p.stockCount,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    tags: safeJsonParse(p.tags ?? '[]', []) as string[],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export default async function AccountPage() {
  // Ensure dynamic rendering (account pages should never be cached)
  await cookies();
  
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');

  const userId = session.user.id;

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

  const wishlist = wishlistItems
    .filter((w) => w.product)
    .map((w) => parseProduct(w.product));

  // Map orders
  const mappedOrders = orders.map((order) => ({
    id: order.orderNumber || order.id,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
    status: order.status as "pending" | "paid" | "shipped" | "delivered" | "cancelled",
    items: order.items.map((item) => ({
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
    trackingNumber: undefined as string | undefined,
  }));

  // Map addresses
  const mappedAddresses = addresses.map((addr) => ({
    id: addr.id,
    label: addr.label || 'Home',
    firstName: addr.firstName,
    lastName: addr.lastName,
    street: addr.street,
    city: addr.city,
    state: addr.state || '',
    postalCode: addr.postalCode,
    country: addr.country,
    phone: addr.phone || '',
    isDefault: addr.isDefault,
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
          orders={mappedOrders}
          wishlist={wishlist}
          addresses={mappedAddresses}
        />
      </div>
    </main>
  );
}
