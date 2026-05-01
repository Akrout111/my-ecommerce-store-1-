"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { useState, useCallback } from "react";

export function SearchBar() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        // Search functionality
      }
    },
    [query]
  );

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("common.search")}
        className="w-full rounded-full border border-border bg-background py-2 ps-10 pe-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E] transition-shadow"
      />
    </form>
  );
}
