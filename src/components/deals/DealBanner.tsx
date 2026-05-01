"use client";

import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./CountdownTimer";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface DealBannerProps {
  title: string;
  subtitle: string;
  endDate: string;
  ctaLabel?: string;
  className?: string;
}

export function DealBanner({ title, subtitle, endDate, ctaLabel, className }: DealBannerProps) {
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 p-6 sm:p-8 ${className ?? ""}`}>
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />

      <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Flame className="h-6 w-6 text-amber-300" />
            <span className="text-sm font-bold uppercase tracking-wider text-amber-200">
              {t("deals.flashSale")}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          <p className="text-sm text-white/80">{subtitle}</p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <CountdownTimer targetDate={endDate} />
          <Button className="bg-white text-rose-600 hover:bg-white/90 font-semibold">
            {ctaLabel ?? t("deals.viewAllDeals")}
          </Button>
        </div>
      </div>
    </div>
  );
}
