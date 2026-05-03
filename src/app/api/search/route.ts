import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeJsonParse } from '@/lib/utils/json';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '24', 10);

  if (!q.trim()) return NextResponse.json({ products: [], total: 0 });

  const where = {
    OR: [
      { name: { contains: q } },
      { nameAr: { contains: q } },
      { brand: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, take: limit, orderBy: { reviewCount: 'desc' } }),
    prisma.product.count({ where }),
  ]);

  const parsed = products.map((p) => ({
    ...p,
    images: safeJsonParse(p.images, []) as string[],
    sizes: safeJsonParse(p.sizes, []) as string[],
    colors: safeJsonParse(p.colors, []) as string[],
    tags: safeJsonParse(p.tags ?? '[]', []) as string[],
  }));

  return NextResponse.json({ products: parsed, total });
}
