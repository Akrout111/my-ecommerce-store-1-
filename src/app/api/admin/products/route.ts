import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProductCreateInput } from '@/lib/validations/product';
import { safeJsonParse } from '@/lib/utils/json';
import { success, forbidden, validationError, internalError } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    const parsed = products.map((p) => ({
      ...p,
      images: safeJsonParse(p.images, []),
      sizes: safeJsonParse(p.sizes, []),
      colors: safeJsonParse(p.colors, []),
      tags: safeJsonParse(p.tags ?? '[]', []),
    }));
    return success({ products: parsed });
  } catch {
    return internalError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }
    const body = await request.json();

    const result = ProductCreateInput.safeParse(body);
    if (!result.success) {
      return validationError(result.error.issues);
    }

    const data = result.data;

    const prismaData = {
      name: data.name,
      nameAr: data.nameAr ?? null,
      description: data.description,
      descriptionAr: data.descriptionAr ?? null,
      price: data.price,
      salePrice: data.salePrice ?? null,
      brand: data.brand,
      images: JSON.stringify(data.images),
      category: data.category,
      subcategory: data.subcategory ?? null,
      sizes: JSON.stringify(data.sizes),
      colors: JSON.stringify(data.colors),
      tags: data.tags.length > 0 ? JSON.stringify(data.tags) : null,
      rating: data.rating ?? 0,
      reviewCount: data.reviewCount ?? 0,
      inStock: data.inStock ?? data.stock > 0,
      stockCount: data.stockCount ?? data.stock,
      isFeatured: data.featured,
      isNew: data.isNew,
      isBestSeller: data.isBestSeller ?? false,
    };

    const product = await prisma.product.create({ data: prismaData });
    return success({ product }, undefined, 201);
  } catch {
    return internalError();
  }
}
