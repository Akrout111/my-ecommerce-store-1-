import type { I18nConfig, Locale, LocaleConfig } from "@/types/i18n";

export const locales: LocaleConfig[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    isRTL: false,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    isRTL: true,
  },
];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const i18nConfig: I18nConfig = {
  defaultLocale,
  locales,
  localeNames,
};

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return locales.find((l) => l.code === locale) ?? locales[0];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.some((l) => l.code === locale);
}
