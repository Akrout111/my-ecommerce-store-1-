"use client";

import { useState, useEffect } from "react";
import { Store, ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CartCount } from "@/components/cart/CartCount";
import { MobileMenu } from "./MobileMenu";
import { Navbar } from "./Navbar";
import { useCartStore } from "@/store/cart-store";
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

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("nav.home"), href: "#" },
    { label: t("nav.categories"), href: "#categories" },
    { label: t("nav.deals"), href: "#deals" },
    { label: t("nav.about"), href: "#about" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b"
            : "bg-background border-b"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Shop<span className="text-emerald-600">Zone</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-600"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Search - Desktop */}
          <SearchBar className="hidden md:flex max-w-xs flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9">
              <User className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={openCart}
            >
              <ShoppingCart className="h-4 w-4" />
              <CartCount />
            </Button>

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navbar - Desktop */}
        <div className="hidden lg:block border-t">
          <Navbar />
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </>
  );
}
