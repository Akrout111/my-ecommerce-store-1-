"use client";

import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

export default function NotFoundPage() {
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <SearchX className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">{t("notFound.title")}</h2>
        <p className="max-w-md text-muted-foreground">{t("notFound.description")}</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button
          asChild
          className="bg-emerald-600 text-white hover:bg-emerald-700 gap-2"
        >
          <a href={`/${language}`}>
            <Home className="h-4 w-4" />
            {t("notFound.backHome")}
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
