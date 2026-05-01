"use client";

import { Store, Search, User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "./SearchBar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const navLinks = [
    { label: t("nav.home"), href: "#" },
    { label: t("nav.categories"), href: "#categories" },
    { label: t("nav.deals"), href: "#deals" },
    { label: t("nav.about"), href: "#about" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isRTL ? "left" : "right"} className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <Store className="h-4 w-4 text-white" />
            </div>
            Shop<span className="text-emerald-600">Zone</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          {/* Search */}
          <SearchBar className="mt-2" />

          {/* Nav Links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Separator />

          {/* Account */}
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <User className="h-4 w-4" />
            {t("nav.account")}
          </a>

          <Separator />

          {/* Language & Theme */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {language === "en" ? "Language" : "اللغة"}
            </span>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("shared.darkMode")}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
