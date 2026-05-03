import { prisma } from '@/lib/db';
import { SearchPageClient } from '@/components/search/SearchPageClient';
import { safeJsonParse } from '@/lib/utils/json';
import { Prisma } from '@prisma/client';

interface Props {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = sp.q || '';
  const category = sp.category;
  const sort = sp.sort || 'newest';
  const page = parseInt(sp.page || '1', 10);
  const limit = 24;

  const where: Prisma.ProductWhereInput = {};
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { brand: { contains: query } },
      { description: { contains: query } },
      { tags: { contains: query } },
    ];
  }
  if (category) where.category = category;

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'price-asc' ? { price: 'asc' }
    : sort === 'price-desc' ? { price: 'desc' }
    : sort === 'rating' ? { rating: 'desc' }
    : { reviewCount: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
  ]);

  const parsed = products.map((p) => ({
    ...p,
    images: safeJsonParse(p.images, []) as string[],
    sizes: safeJsonParse(p.sizes, []) as string[],
    colors: safeJsonParse(p.colors, []) as string[],
    tags: safeJsonParse(p.tags ?? '[]', []) as string[],
  }));

  return (
    <SearchPageClient
      query={query}
      initialProducts={parsed}
      total={total}
      currentPage={page}
      totalPages={Math.ceil(total / limit)}
    />
  );
}
