"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "ar";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en" as Language,
      isRTL: false,
      setLanguage: (lang: Language) =>
        set({ language: lang, isRTL: lang === "ar" }),
      toggleLanguage: () =>
        set((state) => ({
          language: (state.language === "en" ? "ar" : "en") as Language,
          isRTL: state.language === "en",
        })),
    }),
    {
      name: "persona-language",
    }
  )
);
