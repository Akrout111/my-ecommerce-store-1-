"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-xs font-medium hover:text-primary transition-colors"
      aria-label={`Switch language to ${language === "en" ? "Arabic" : "English"}`}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{language === "en" ? "🇬🇧 EN" : "🇸🇦 عربي"}</span>
    </button>
  );
}
