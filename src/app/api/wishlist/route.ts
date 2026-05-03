import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { success, unauthorized, validationError, internalError, conflict } from '@/lib/api-response';
import { safeJsonParse } from '@/lib/utils/json';
import { z } from 'zod';

const WishlistAddInput = z.object({
  productId: z.string().min(1),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorized();
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const products = wishlistItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      nameAr: item.product.nameAr,
      price: item.product.price,
      salePrice: item.product.salePrice,
      brand: item.product.brand,
      images: safeJsonParse(item.product.images, []) as string[],
      category: item.product.category,
      rating: item.product.rating,
      reviewCount: item.product.reviewCount,
      inStock: item.product.inStock,
      isFeatured: item.product.isFeatured,
      isNew: item.product.isNew,
      isBestSeller: item.product.isBestSeller,
    }));

    return success({
      products,
      productIds: wishlistItems.map((item) => item.productId),
    });
  } catch (error) {
    console.error('[Wishlist GET Error]', error);
    return internalError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorized();
    }

    const body = await request.json();
    const parsed = WishlistAddInput.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.issues);
    }

    const { productId } = parsed.data;

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return validationError({ productId: 'Product not found' });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return conflict('Product already in wishlist');
    }

    await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return success({ productId }, undefined, 201);
  } catch (error) {
    console.error('[Wishlist POST Error]', error);
    return internalError();
  }
}
