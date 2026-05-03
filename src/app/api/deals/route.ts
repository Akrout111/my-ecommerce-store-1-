import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeJsonParse } from '@/lib/utils/json';

export async function GET() {
  try {
    const now = new Date();
    const deals = await prisma.deal.findMany({
      where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
      include: { product: true },
      orderBy: { endsAt: 'asc' },
    });
    const parsed = deals.map((d) => ({
      ...d,
      product: {
        ...d.product,
        images: safeJsonParse(d.product.images, []) as string[],
        sizes: safeJsonParse(d.product.sizes, []) as string[],
        colors: safeJsonParse(d.product.colors, []) as string[],
        tags: safeJsonParse(d.product.tags ?? '[]', []) as string[],
      },
    }));
    const response = NextResponse.json({ deals: parsed });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
