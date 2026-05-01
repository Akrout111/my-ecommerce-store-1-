"use client";

import React, { createContext, useContext, useMemo } from "react";
import { translations, type Language, type TranslationKey } from "@/lib/i18n/translations";
import { useLanguageStore } from "@/store/language-store";

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  t: (key: TranslationKey) => string;
  toggleLanguage: () => void;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, isRTL, setLanguage, toggleLanguage } = useLanguageStore();

  const t = useMemo(
    () => (key: TranslationKey) => translations[language][key] ?? key,
    [language]
  );

  const dir = isRTL ? "rtl" : "ltr";

  const value = useMemo(
    () => ({ language, isRTL, t, toggleLanguage, dir, setLanguage }),
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
