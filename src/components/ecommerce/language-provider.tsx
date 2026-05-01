"use client";

import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

type Language = "en" | "ar";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj);

  if (typeof value === "string") return value;
  return path;
}

function formatNumber(num: number, locale: Language): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(num);
}

function formatCurrency(amount: number, locale: Language): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: string | Date, locale: Language): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  toggleLanguage: () => void;
  dir: "rtl" | "ltr";
  locale: Language;
  setLanguage: (lang: Language) => void;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, isRTL, setLanguage, toggleLanguage } = useLanguageStore();

  const translations = language === "ar" ? arTranslations : enTranslations;

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value = getNestedValue(translations as unknown as Record<string, unknown>, key);
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          value = value.replace(`{${paramKey}}`, String(paramValue));
        });
      }
      return value;
    },
    [translations]
  );

  const dir = isRTL ? ("rtl" as const) : ("ltr" as const);

  const value = useMemo(
    () => ({
      language: language as Language,
      isRTL,
      t,
      toggleLanguage,
      dir,
      locale: language as Language,
      setLanguage: setLanguage as (lang: Language) => void,
      formatNumber: (num: number) => formatNumber(num, language as Language),
      formatCurrency: (amount: number) => formatCurrency(amount, language as Language),
      formatDate: (date: string | Date) => formatDate(date, language as Language),
    }),
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
