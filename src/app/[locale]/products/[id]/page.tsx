import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { safeJsonParse } from '@/lib/utils/json';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string; locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: `${product.name} | Persona`,
      description: product.description.slice(0, 155),
      images: [{ url: safeJsonParse(product.images, [])[0] || '/og-image.jpg' }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const relatedRaw = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 6,
    orderBy: { reviewCount: 'desc' },
  });

  type ProductRow = {
    id: string; name: string; nameAr?: string | null;
    description: string; descriptionAr?: string | null;
    price: number; salePrice?: number | null; brand: string;
    images: string; category: string; subcategory?: string | null;
    sizes: string; colors: string;
    rating: number; reviewCount: number;
    inStock: boolean; stockCount: number;
    isFeatured?: boolean; isNew: boolean; isBestSeller: boolean;
    tags?: string | null;
    createdAt: Date; updatedAt: Date;
  };

  const parseProduct = (p: ProductRow) => ({
    ...p,
    salePrice: p.salePrice ?? undefined,
    nameAr: p.nameAr ?? undefined,
    descriptionAr: p.descriptionAr ?? undefined,
    subcategory: p.subcategory ?? undefined,
    isFeatured: p.isFeatured ?? undefined,
    images: safeJsonParse(p.images, []) as string[],
    sizes: safeJsonParse(p.sizes, []) as string[],
    colors: safeJsonParse(p.colors, []) as string[],
    tags: safeJsonParse(p.tags ?? '[]', []) as string[],
  });

  return (
    <main id="main" className="min-h-screen">
      <ProductJsonLd product={parseProduct(product)} />
      <ProductDetailClient
        product={parseProduct(product)}
        relatedProducts={relatedRaw.map(parseProduct)}
      />
    </main>
  );
}
