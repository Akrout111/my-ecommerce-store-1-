"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";
import { cn } from "@/lib/utils";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface SearchBarProps {
  className?: string;
  expanded?: boolean;
  onToggle?: () => void;
}

export function SearchBar({ className, expanded, onToggle }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      // Could trigger search API call here
    }
  }, [debouncedQuery]);

  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
          isRTL ? "right-3" : "left-3"
        )}
      />
      <Input
        type="search"
        placeholder={t("nav.search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "h-9 w-full bg-muted/50 pr-9 pl-9 text-sm transition-all focus:bg-background focus:ring-1 focus:ring-emerald-500",
          isRTL ? "pr-9 pl-4" : "pl-9 pr-4"
        )}
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-1/2 h-6 w-6 -translate-y-1/2",
            isRTL ? "left-2" : "right-2"
          )}
          onClick={() => {
            setQuery("");
            onToggle?.();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
