"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/lib/i18n/translations";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      isRTL: false,
      setLanguage: (lang: Language) =>
        set({ language: lang, isRTL: lang === "ar" }),
      toggleLanguage: () =>
        set((state) => ({
          language: state.language === "en" ? "ar" : "en",
          isRTL: state.language === "en",
        })),
    }),
    {
      name: "shopzone-language",
    }
  )
);
