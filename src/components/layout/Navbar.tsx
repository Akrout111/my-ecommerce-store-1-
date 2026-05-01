"use client";

import Link from "next/link";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { NAV_CATEGORIES, COLORS } from "@/lib/constants";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { t, isRTL } = useLanguage();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <nav
      className="hidden lg:block border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-[105px] z-40"
      aria-label="Category navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 h-11">
          {NAV_CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="relative"
              onMouseEnter={() => setHoveredCategory(cat.key)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={`/#${cat.key}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  hoveredCategory === cat.key ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(`nav.${cat.key}`)}
              </Link>
              <AnimatePresence>
                {hoveredCategory === cat.key && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full start-1/2 -translate-x-1/2 z-50 mt-2 w-48 rounded-xl border border-border bg-popover p-2 shadow-xl"
                  >
                    {cat.subcategories.map((sub, idx) => (
                      <Link
                        key={sub}
                        href={`/#${cat.key}-${sub.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {isRTL ? cat.subcategoriesAr[idx] : sub}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link
            href="/#deals"
            className="text-sm font-medium text-[#E8A0BF] hover:text-[#E8A0BF]/80 transition-colors"
          >
            {t("nav.sale")}
          </Link>
          <Link
            href="/#new-arrivals"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            style={{ color: COLORS.gold }}
          >
            {t("nav.newArrivals")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
