import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') === 'true';
  const isNew = searchParams.get('new') === 'true';
  const bestSeller = searchParams.get('bestSeller') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;

  try {
    const where: Record<string, any> = {};
    if (category) where.category = category;
    if (featured) where.isFeatured = true;
    if (isNew) where.isNew = true;
    if (bestSeller) where.isBestSeller = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nameAr: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }
    const orderBy: Record<string, any> =
      sort === 'price-asc' ? { price: 'asc' }
      : sort === 'price-desc' ? { price: 'desc' }
      : sort === 'best-selling' ? { reviewCount: 'desc' }
      : sort === 'rating' ? { rating: 'desc' }
      : { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      prisma.product.count({ where }),
    ]);

    const parsed = products.map((p) => ({
      ...p,
      images: safeJsonParse(p.images, []),
      sizes: safeJsonParse(p.sizes, []),
      colors: safeJsonParse(p.colors, []),
      tags: safeJsonParse(p.tags ?? '[]', []),
    }));

    const response = NextResponse.json({ products: parsed, total, page, limit, totalPages: Math.ceil(total / limit) });

    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
  } catch (error) {
    console.error('[API/products]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function safeJsonParse(str: string, fallback: any) {
  try { return JSON.parse(str); } catch { return fallback; }
}
