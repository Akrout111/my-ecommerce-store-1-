import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://persona.fashion';
  const categories = ['women', 'men', 'kids', 'shoes', 'accessories', 'beauty'];

  // Guard: skip DB call if DATABASE_URL is not available (e.g. during CI build)
  if (!process.env.DATABASE_URL) {
    return [
      { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${base}/search`, changeFrequency: 'weekly', priority: 0.5 },
      ...categories.map((cat) => ({ url: `${base}/category/${cat}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ];
  }

  const { prisma } = await import('@/lib/db');
  const products = await prisma.product.findMany({ select: { id: true, updatedAt: true }, take: 1000 });

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/search`, changeFrequency: 'weekly', priority: 0.5 },
    ...categories.map((cat) => ({ url: `${base}/category/${cat}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/products/${p.id}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
