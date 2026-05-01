"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
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

const departments = [
  {
    nameKey: "categories.fashion",
    subKey: "categories.women",
    gradient: "from-pink-500 to-rose-600",
    emoji: "👗",
  },
  {
    nameKey: "categories.fashion",
    subKey: "categories.men",
    gradient: "from-slate-600 to-slate-800",
    emoji: "👔",
  },
  {
    nameKey: "categories.electronics",
    subKey: "categories.electronics",
    gradient: "from-cyan-500 to-teal-600",
    emoji: "📱",
  },
  {
    nameKey: "categories.home",
    subKey: "categories.home",
    gradient: "from-amber-500 to-orange-600",
    emoji: "🏠",
  },
];

export function DepartmentHub() {
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("department.title")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("department.subtitle")}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {departments.map((dept, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <div
                    className={`relative flex items-center justify-between bg-gradient-to-r ${dept.gradient} p-6 sm:p-8`}
                  >
                    <div className="space-y-2">
                      <span className="text-3xl">{dept.emoji}</span>
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        {t(dept.subKey)}
                      </h3>
                      <a
                        href="#"
                        className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
                      >
                        Shop Now
                        <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                      </a>
                    </div>

                    {/* Decorative circle */}
                    <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
                  </div>
                </Card>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
