import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import type { Metadata } from 'next';

function safeJsonParse(str: string, fallback: any) {
  try { return JSON.parse(str); } catch { return fallback; }
}

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

  const parseProduct = (p: any) => ({
    ...p,
    images: safeJsonParse(p.images, []),
    sizes: safeJsonParse(p.sizes, []),
    colors: safeJsonParse(p.colors, []),
    tags: safeJsonParse(p.tags ?? '[]', []),
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
