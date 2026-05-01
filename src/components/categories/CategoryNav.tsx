"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import { useLanguageStore } from "@/store/language-store";

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (slug: string) => void;
  className?: string;
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: CategoryNavProps) {
  const { language } = useLanguageStore();

  return (
    <ScrollArea className={cn("w-full whitespace-nowrap", className)}>
      <div className="flex items-center gap-2 pb-2">
        {categories.map((category) => {
          const name = language === "ar" ? category.nameAr : category.name;
          const isActive = activeCategory === category.slug;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange?.(category.slug)}
              className={cn(
                "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
              )}
            >
              {name}
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
