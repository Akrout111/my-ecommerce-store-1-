import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProductCreateInput } from '@/lib/validations/product';
import { z } from 'zod';
import { safeJsonParse } from '@/lib/utils/json';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    const parsed = products.map((p) => ({
      ...p,
      images: safeJsonParse(p.images, []),
      sizes: safeJsonParse(p.sizes, []),
      colors: safeJsonParse(p.colors, []),
      tags: safeJsonParse(p.tags ?? '[]', []),
    }));
    return NextResponse.json({ products: parsed });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();

    const result = ProductCreateInput.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 },
      );
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
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
