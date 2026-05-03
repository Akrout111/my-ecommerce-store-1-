import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProductUpdateInput } from '@/lib/validations/product';
import { success, forbidden, validationError, notFound, internalError } from '@/lib/api-response';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }
    const { id } = await params;
    const body = await request.json();

    const result = ProductUpdateInput.safeParse(body);
    if (!result.success) {
      return validationError(result.error.issues);
    }

    const data = result.data;

    // Build Prisma data object, converting array fields to JSON strings
    const prismaData: Record<string, string | number | boolean | null> = {};

    if (data.name !== undefined) prismaData.name = data.name;
    if (data.nameAr !== undefined) prismaData.nameAr = data.nameAr;
    if (data.description !== undefined) prismaData.description = data.description;
    if (data.descriptionAr !== undefined) prismaData.descriptionAr = data.descriptionAr;
    if (data.price !== undefined) prismaData.price = data.price;
    if (data.salePrice !== undefined) prismaData.salePrice = data.salePrice;
    if (data.brand !== undefined) prismaData.brand = data.brand;
    if (data.images !== undefined) prismaData.images = JSON.stringify(data.images);
    if (data.category !== undefined) prismaData.category = data.category;
    if (data.subcategory !== undefined) prismaData.subcategory = data.subcategory;
    if (data.sizes !== undefined) prismaData.sizes = JSON.stringify(data.sizes);
    if (data.colors !== undefined) prismaData.colors = JSON.stringify(data.colors);
    if (data.tags !== undefined) prismaData.tags = data.tags.length > 0 ? JSON.stringify(data.tags) : null;
    if (data.rating !== undefined) prismaData.rating = data.rating;
    if (data.reviewCount !== undefined) prismaData.reviewCount = data.reviewCount;
    if (data.inStock !== undefined) prismaData.inStock = data.inStock;
    if (data.stockCount !== undefined) prismaData.stockCount = data.stockCount;
    if (data.stock !== undefined) prismaData.stockCount = data.stock;
    if (data.featured !== undefined) prismaData.isFeatured = data.featured;
    if (data.isNew !== undefined) prismaData.isNew = data.isNew;
    if (data.isBestSeller !== undefined) prismaData.isBestSeller = data.isBestSeller;

    const product = await prisma.product.update({ where: { id }, data: prismaData });
    return success({ product });
  } catch {
    return internalError();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return forbidden();
    }
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return success({ deleted: true });
  } catch {
    return notFound('Product');
  }
}
