"use client";

import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

const categoryItems = [
  { key: "categories.women", slug: "women" },
  { key: "categories.men", slug: "men" },
  { key: "categories.kids", slug: "kids" },
  { key: "categories.electronics", slug: "electronics" },
  { key: "categories.home", slug: "home" },
  { key: "categories.beauty", slug: "beauty" },
  { key: "categories.sports", slug: "sports" },
  { key: "deals.flashSale", slug: "sale", isSale: true },
];

export function Navbar() {
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <nav className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8 py-2">
        {categoryItems.map((item) => (
          <a
            key={item.slug}
            href={`#${item.slug}`}
            className={cn(
              "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              item.isSale
                ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
            )}
          >
            {t(item.key)}
          </a>
        ))}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
