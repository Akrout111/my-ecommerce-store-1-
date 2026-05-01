"use client";

import { ProductGrid } from "@/components/products/ProductGrid";
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

interface NewArrivalsProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export function NewArrivals({ products, onQuickView }: NewArrivalsProps) {
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("products.newArrivals")}
            </h2>
            <a
              href="#"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              {t("shared.seeAll")}
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <ProductGrid products={products} columns={4} onQuickView={onQuickView} />
        </AnimatedSection>
      </div>
    </section>
  );
}
