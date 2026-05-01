export type Locale = "en" | "ar";

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  isRTL: boolean;
}

export interface TranslationValue {
  [key: string]: string | TranslationValue;
}

export type Dictionary = TranslationValue;

export interface I18nConfig {
  defaultLocale: Locale;
  locales: LocaleConfig[];
  localeNames: Record<Locale, string>;
}
