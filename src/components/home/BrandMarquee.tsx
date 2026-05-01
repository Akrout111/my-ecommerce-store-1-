"use client";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

const brands = [
  "Nike",
  "Adidas",
  "Apple",
  "Samsung",
  "Sony",
  "Zara",
  "H&M",
  "L'Oreal",
  "Puma",
  "Unilever",
  "Dyson",
  "Bose",
];

export function BrandMarquee() {
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("brands.title")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("brands.subtitle")}
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

        <div className="flex overflow-hidden">
          <div className="brand-marquee flex items-center gap-12">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand}-${index}`}
                className="flex shrink-0 items-center justify-center rounded-xl border bg-card px-8 py-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-lg font-bold text-muted-foreground whitespace-nowrap">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
