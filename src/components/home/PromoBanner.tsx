"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift, Percent, Sparkles, Tag } from "lucide-react";
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

export function PromoBanner() {
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-amber-500">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 h-60 w-60 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-white/10" />
            </div>

            <div className="relative flex flex-col items-center gap-8 p-8 sm:p-12 lg:flex-row lg:justify-between">
              {/* Left: Text */}
              <div className="max-w-lg space-y-4 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {t("promo.title")}
                </h2>
                <p className="text-sm text-white/80 sm:text-base">
                  {t("promo.subtitle")}
                </p>
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-white/90 font-semibold px-8"
                >
                  {t("promo.cta")}
                </Button>
              </div>

              {/* Right: Floating Icons */}
              <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48">
                <motion.div
                  className="absolute top-0 right-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Gift className="h-8 w-8 text-white" />
                </motion.div>
                <motion.div
                  className="absolute bottom-0 left-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Percent className="h-7 w-7 text-white" />
                </motion.div>
                <motion.div
                  className="absolute top-12 left-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute bottom-8 right-8 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Tag className="h-5 w-5 text-white" />
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
