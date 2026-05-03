import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
        images: safeJsonParse(d.product.images, []),
        sizes: safeJsonParse(d.product.sizes, []),
        colors: safeJsonParse(d.product.colors, []),
        tags: safeJsonParse(d.product.tags ?? '[]', []),
      },
    }));
    const response = NextResponse.json({ deals: parsed });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function safeJsonParse(str: string, fallback: any) {
  try { return JSON.parse(str); } catch { return fallback; }
}
