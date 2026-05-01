import type { Locale } from "@/types/i18n";
import type { Dictionary } from "@/types/i18n";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./locales/en/translation.json").then((m) => m.default as Dictionary),
  ar: () => import("./locales/ar/translation.json").then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.en;
  return loader();
}
