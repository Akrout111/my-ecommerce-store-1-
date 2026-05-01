"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProductCard } from "@/components/products/ProductCard";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import type { Product } from "@/types/product";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface FeaturedProductsProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export function FeaturedProducts({ products, onQuickView }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("products.featured")}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => scroll(isRTL ? "right" : "left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => scroll(isRTL ? "left" : "right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                {t("shared.seeAll")}
              </a>
            </div>
          </div>
        </AnimatedSection>

        <ScrollArea className="w-full" ref={scrollRef}>
          <div className="flex gap-4 pb-4">
            {products.map((product) => (
              <div key={product.id} className="w-[220px] shrink-0 sm:w-[250px]">
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
