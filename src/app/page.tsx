"use client";

import React from "react";
import { LanguageProvider, useLanguage } from "@/components/ecommerce/language-provider";
import { Header } from "@/components/ecommerce/header";
import { HeroBanner } from "@/components/ecommerce/hero-banner";
import { Categories } from "@/components/ecommerce/categories";
import { DealsSection } from "@/components/ecommerce/deals-section";
import { ProductGrid } from "@/components/ecommerce/product-grid";
import { PromoBanner } from "@/components/ecommerce/promo-banner";
import { Newsletter } from "@/components/ecommerce/newsletter";
import { Footer } from "@/components/ecommerce/footer";

function HomePageContent() {
  const { isRTL } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <Categories />
        <DealsSection />
        <ProductGrid />
        <PromoBanner />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
}
