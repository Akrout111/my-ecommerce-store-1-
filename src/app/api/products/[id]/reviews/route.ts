import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { success, unauthorized, conflict, validationError, internalError, notFound } from '@/lib/api-response';
import { z } from 'zod';

const ReviewCreateInput = z.object({
  rating: z.int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(1).max(1000),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    // Fetch user names for reviews that have userId
    const userIds = reviews.map((r) => r.userId).filter((id): id is string => !!id);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const formatted = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      isVerified: r.isVerified,
      createdAt: r.createdAt.toISOString(),
      userName: (r.userId ? userMap.get(r.userId) : null) || r.guestName || 'Anonymous',
    }));

    return success(
      { reviews: formatted },
      { page, limit, total, totalPages: Math.ceil(total / limit) }
    );
  } catch (error) {
    console.error('[Reviews GET Error]', error);
    return internalError();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorized();
    }

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return notFound('Product');
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = ReviewCreateInput.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.issues);
    }

    const { rating, title, comment } = parsed.data;

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId: session.user.id },
    });
    if (existingReview) {
      return conflict('You have already reviewed this product');
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title: title || null,
        comment,
        isVerified: true, // Verified if they're a logged-in user
      },
    });

    // Fetch user name for the response
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    // Update product rating and reviewCount
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });
    const totalReviews = allReviews.length;
    const avgRating =
      totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: totalReviews,
      },
    });

    return success(
      {
        review: {
          id: review.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          isVerified: review.isVerified,
          createdAt: review.createdAt.toISOString(),
          userName: user?.name || 'Anonymous',
        },
      },
      undefined,
      201
    );
  } catch (error) {
    console.error('[Reviews POST Error]', error);
    return internalError();
  }
}
