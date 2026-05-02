"use client";

import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

export function BrandMarquee() {
  const { t } = useLanguage();

  const brandNames = ["Versace", "Gucci", "Armani", "Nike", "Prada", "Burberry", "Zara", "H&M", "L'Oreal", "Adidas", "Dolce & Gabbana", "Chanel"];
  // Double the brands for seamless loop
  const brands = [...brandNames, ...brandNames];

  return (
    <section className="py-12 lg:py-16 border-y border-border/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
            {t("brands.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("brands.subtitle")}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="brand-marquee flex items-center gap-16 whitespace-nowrap">
          {brands.map((brand, idx) => (
            <span
              key={`${brand}-${idx}`}
              className="text-2xl sm:text-3xl font-bold tracking-wider text-muted-foreground/40 hover:text-[#C9A96E] transition-colors cursor-default px-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
