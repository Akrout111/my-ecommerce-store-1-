"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

type Language = "en" | "ar";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  t: (key: string) => string;
  toggleLanguage: () => void;
  dir: "rtl" | "ltr";
  locale: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, isRTL, setLanguage, toggleLanguage } = useLanguageStore();

  const translations = language === "ar" ? arTranslations : enTranslations;

  const t = useMemo(
    () => (key: string) => getNestedValue(translations as unknown as Record<string, unknown>, key),
    [translations]
  );

  const dir = isRTL ? "rtl" as const : "ltr" as const;

  const value = useMemo(
    () => ({ language: language as Language, isRTL, t, toggleLanguage, dir, locale: language as Language, setLanguage: setLanguage as (lang: Language) => void }),
    [language, isRTL, t, toggleLanguage, dir, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
