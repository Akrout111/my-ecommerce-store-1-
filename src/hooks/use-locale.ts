"use client";

import { useLanguageStore } from "@/store/language-store";
import type { Locale } from "@/types/i18n";

export function useLocale(): {
  locale: Locale;
  isRTL: boolean;
  dir: "rtl" | "ltr";
} {
  const { language, isRTL } = useLanguageStore();
  return {
    locale: language,
    isRTL,
    dir: isRTL ? "rtl" : "ltr",
  };
}
