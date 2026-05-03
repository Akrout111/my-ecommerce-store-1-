import { prisma } from '@/lib/db';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { DealsSection } from '@/components/home/DealsSection';
import { NewArrivals } from '@/components/home/NewArrivals';
import { PromoBanner } from '@/components/home/PromoBanner';
import { BestSellers } from '@/components/home/BestSellers';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { DepartmentHub } from '@/components/home/DepartmentHub';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { Suspense } from 'react';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';
import type { Product } from '@/types/product';
import { safeJsonParse } from '@/lib/utils/json';

function ProductSectionSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

function parseProduct(p: {
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
}): Product {
  return {
    id: p.id,
    name: p.name,
    nameAr: p.nameAr,
    description: p.description,
    descriptionAr: p.descriptionAr,
    price: p.price,
    salePrice: p.salePrice ?? undefined,
    brand: p.brand,
    images: safeJsonParse(p.images, []) as string[],
    category: p.category,
    subcategory: p.subcategory,
    sizes: safeJsonParse(p.sizes, []) as string[],
    colors: safeJsonParse(p.colors, []) as string[],
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    stockCount: p.stockCount,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    tags: safeJsonParse(p.tags ?? '[]', []) as string[],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export default async function HomePage() {
  // Optimized: Use parallel queries with targeted where clauses
  const [featured, newArrivals, bestSellers, deals] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true }, take: 8 }),
    prisma.product.findMany({ where: { isNew: true }, take: 8 }),
    prisma.product.findMany({ where: { isBestSeller: true }, take: 8 }),
    prisma.deal.findMany({ where: { isActive: true }, include: { product: true }, take: 6 }),
  ]);

  const featuredProducts = featured.map(parseProduct);
  const newArrivalProducts = newArrivals.map(parseProduct);
  const bestSellerProducts = bestSellers.map(parseProduct);
  const parsedDeals = deals.map((d) => ({ ...d, product: parseProduct(d.product) }));

  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <Suspense fallback={<ProductSectionSkeleton />}>
        <FeaturedProducts products={featuredProducts} />
      </Suspense>
      <DealsSection deals={parsedDeals} />
      <BrandMarquee />
      <Suspense fallback={<ProductSectionSkeleton />}>
        <NewArrivals products={newArrivalProducts} />
      </Suspense>
      <PromoBanner />
      <Suspense fallback={<ProductSectionSkeleton />}>
        <BestSellers products={bestSellerProducts} />
      </Suspense>
      <DepartmentHub />
      <NewsletterSection />
    </>
  );
}
