"use client";

import {
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Puzzle,
  Apple,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";
import { cn } from "@/lib/utils";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

const categoryData = [
  { key: "categories.electronics", slug: "electronics", icon: Laptop, count: 240, gradient: "from-cyan-500 to-teal-600" },
  { key: "categories.fashion", slug: "fashion", icon: Shirt, count: 380, gradient: "from-pink-500 to-rose-600" },
  { key: "categories.home", slug: "home", icon: Home, count: 190, gradient: "from-amber-500 to-orange-600" },
  { key: "categories.beauty", slug: "beauty", icon: Sparkles, count: 150, gradient: "from-purple-500 to-fuchsia-600" },
  { key: "categories.sports", slug: "sports", icon: Dumbbell, count: 120, gradient: "from-emerald-500 to-green-600" },
  { key: "categories.books", slug: "books", icon: BookOpen, count: 310, gradient: "from-yellow-500 to-amber-600" },
  { key: "categories.toys", slug: "toys", icon: Puzzle, count: 95, gradient: "from-red-500 to-pink-600" },
  { key: "categories.groceries", slug: "groceries", icon: Apple, count: 200, gradient: "from-lime-500 to-green-600" },
];

export function CategoryGrid() {
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <section id="categories" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("categories.title")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("categories.subtitle")}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {categoryData.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <AnimatedSection key={cat.slug} delay={index * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
                    <div className={cn(
                      "flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br text-white",
                      cat.gradient
                    )}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:scale-110">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-semibold sm:text-base">{t(cat.key)}</h3>
                        <p className="mt-0.5 text-xs text-white/70">{cat.count} items</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
