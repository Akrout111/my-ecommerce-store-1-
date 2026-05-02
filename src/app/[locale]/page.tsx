import { prisma } from '@/lib/db';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { DealsSection } from '@/components/home/DealsSection';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { NewArrivals } from '@/components/home/NewArrivals';
import { PromoBanner } from '@/components/home/PromoBanner';
import { BestSellers } from '@/components/home/BestSellers';
import { DepartmentHub } from '@/components/home/DepartmentHub';
import { NewsletterSection } from '@/components/home/NewsletterSection';

function safeJsonParse(str: string, fallback: any) {
  try { return JSON.parse(str); } catch { return fallback; }
}

export default async function HomePage() {
  const [allProducts, deals] = await Promise.all([
    prisma.product.findMany({ take: 50, orderBy: { createdAt: 'desc' } }),
    prisma.deal.findMany({ where: { isActive: true }, include: { product: true }, take: 6 }),
  ]);

  const parseProduct = (p: any) => ({
    ...p,
    images: safeJsonParse(p.images, []),
    sizes: safeJsonParse(p.sizes, []),
    colors: safeJsonParse(p.colors, []),
    tags: safeJsonParse(p.tags ?? '[]', []),
  });

  const products = allProducts.map(parseProduct);
  const parsedDeals = deals.map((d) => ({ ...d, product: parseProduct(d.product) }));

  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivalProducts = products.filter((p) => p.isNew);
  const bestSellerProducts = products.filter((p) => p.isBestSeller);

  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <DealsSection deals={parsedDeals} />
      <BrandMarquee />
      <NewArrivals products={newArrivalProducts} />
      <PromoBanner />
      <BestSellers products={bestSellerProducts} />
      <DepartmentHub />
      <NewsletterSection />
    </>
  );
}
