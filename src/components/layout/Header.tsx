"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Diamond, Heart, ShoppingBag, Search, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { NAV_CATEGORIES, COLORS } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";

const emptySubscribe = () => () => {};

export function Header() {
  const { t, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { itemCount, openCart } = useCartStore();
  const wishlistItems = useWishlistStore((s) => s.items);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
    }
  };

  return (
    <>
      <a href="#main" className="skip-to-content">
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg"
            : "bg-background/95 backdrop-blur-sm"
        }`}
      >
        {/* Top bar */}
        <div className="border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-8 items-center justify-between text-xs text-muted-foreground">
              <span className="hidden sm:block">Your Style. Your Story. Your Persona.</span>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Diamond className="h-7 w-7" style={{ color: COLORS.gold }} />
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: COLORS.gold }}
              >
                Persona
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="relative"
                  onMouseEnter={() => setHoveredCategory(cat.key)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={`/#${cat.key}`}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                      cat.key === "sale" ? "text-[#E8A0BF] hover:text-[#E8A0BF]" : ""
                    }`}
                  >
                    {t(`nav.${cat.key}`)}
                  </Link>
                  <AnimatePresence>
                    {hoveredCategory === cat.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full start-0 z-50 mt-1 w-56 rounded-xl border border-border bg-popover p-2 shadow-xl"
                      >
                        {cat.subcategories.map((sub, idx) => (
                          <Link
                            key={sub}
                            href={`/#${cat.key}-${sub.toLowerCase().replace(/\s+/g, "-")}`}
                            className="block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {isRTL ? cat.subcategoriesAr[idx] : sub}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                href="/#deals"
                className="px-3 py-2 text-sm font-medium rounded-md text-[#E8A0BF] hover:bg-[#E8A0BF]/10 transition-colors"
              >
                {t("nav.sale")}
              </Link>
              <Link
                href="/#new-arrivals"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {t("nav.newArrivals")}
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
                aria-label={t("common.search")}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              )}

              {/* Wishlist */}
              <Link
                href="/"
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" style={{ color: COLORS.rose }} />
                {wishlistItems.length > 0 && (
                  <span
                    className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: COLORS.rose }}
                  >
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="h-5 w-5" style={{ color: COLORS.gold }} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: COLORS.gold }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/50"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("common.search")}
                    className="w-full rounded-full border border-border bg-background py-2 ps-10 pe-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                    autoFocus
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
