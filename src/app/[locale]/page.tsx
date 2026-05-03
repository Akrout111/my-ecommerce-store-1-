import { prisma } from '@/lib/db';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { DealsSection } from '@/components/home/DealsSection';
import { NewArrivals } from '@/components/home/NewArrivals';
import { PromoBanner } from '@/components/home/PromoBanner';
import { BestSellers } from '@/components/home/BestSellers';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';

// Dynamic imports for below-fold heavy components
const BrandMarquee = dynamic(() => import('@/components/home/BrandMarquee').then(m => ({ default: m.BrandMarquee })), { ssr: false });
const DepartmentHub = dynamic(() => import('@/components/home/DepartmentHub').then(m => ({ default: m.DepartmentHub })), { ssr: true });
const NewsletterSection = dynamic(() => import('@/components/home/NewsletterSection').then(m => ({ default: m.NewsletterSection })), { ssr: true });

function safeJsonParse(str: string, fallback: any) {
  try { return JSON.parse(str); } catch { return fallback; }
}

function ProductSectionSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

// Enable Partial Prerendering via next.config.ts cacheComponents

export default async function HomePage() {
  // Optimized: Use parallel queries with targeted where clauses
  const [featured, newArrivals, bestSellers, deals] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true }, take: 8 }),
    prisma.product.findMany({ where: { isNew: true }, take: 8 }),
    prisma.product.findMany({ where: { isBestSeller: true }, take: 8 }),
    prisma.deal.findMany({ where: { isActive: true }, include: { product: true }, take: 6 }),
  ]);

  const parseProduct = (p: any) => ({
    ...p,
    images: safeJsonParse(p.images, []),
    sizes: safeJsonParse(p.sizes, []),
    colors: safeJsonParse(p.colors, []),
    tags: safeJsonParse(p.tags ?? '[]', []),
  });

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
