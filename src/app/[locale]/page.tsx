"use client";

import { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { DealsSection } from "@/components/home/DealsSection";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BestSellers } from "@/components/home/BestSellers";
import { DepartmentHub } from "@/components/home/DepartmentHub";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { sampleProducts, sampleDeals } from "@/lib/sample-data";
import type { Product } from "@/types/product";

export default function HomePage() {
  const featuredProducts = sampleProducts.filter((p) => p.isFeatured);
  const newArrivalProducts = sampleProducts.filter((p) => p.isNew);
  const bestSellerProducts = sampleProducts.filter((p) => p.isBestSeller);

  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <DealsSection deals={sampleDeals} />
      <BrandMarquee />
      <NewArrivals products={newArrivalProducts} />
      <PromoBanner />
      <BestSellers products={bestSellerProducts} />
      <DepartmentHub />
      <NewsletterSection />
    </>
  );
}
