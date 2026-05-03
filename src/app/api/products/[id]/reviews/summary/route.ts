import { prisma } from '@/lib/db';
import { success, internalError, notFound } from '@/lib/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return notFound('Product');
    }

    // Get distribution
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) *
              10
          ) / 10
        : 0;

    // Count per star
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    }

    return success({
      averageRating,
      totalReviews,
      distribution: Object.entries(distribution).map(([stars, count]) => ({
        stars: parseInt(stars),
        count,
        percent: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
      })),
    });
  } catch (error) {
    console.error('[Review Summary Error]', error);
    return internalError();
  }
}
