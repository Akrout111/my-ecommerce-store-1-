"use client";

import React from "react";
import Link from "next/link";
import { X, Sun, Moon, Heart, Home } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { useWishlistStore } from "@/store/wishlist-store";
import { NAV_CATEGORIES, COLORS } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const wishlistItems = useWishlistStore((s) => s.items);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 z-50 w-80 bg-background shadow-2xl ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold" style={{ color: COLORS.gold }}>
                    Persona
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={onClose}
                >
                  <Home className="h-4 w-4" style={{ color: COLORS.gold }} />
                  {t("nav.home")}
                </Link>

                {NAV_CATEGORIES.map((cat) => (
                  <div key={cat.key}>
                    <button
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === cat.key ? null : cat.key
                        )
                      }
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                    >
                      <span>{t(`nav.${cat.key}`)}</span>
                      <span className="text-xs text-muted-foreground">
                        {expandedCategory === cat.key ? "−" : "+"}
                      </span>
                    </button>
                    <AnimatePresence>
                      {expandedCategory === cat.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ps-6 pb-2 space-y-1">
                            {cat.subcategories.map((sub, idx) => (
                              <Link
                                key={sub}
                                href={`/#${cat.key}-${sub.toLowerCase().replace(/\s+/g, "-")}`}
                                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                onClick={onClose}
                              >
                                {isRTL ? cat.subcategoriesAr[idx] : sub}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <Link
                  href="/#deals"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent/50 transition-colors"
                  style={{ color: COLORS.rose }}
                  onClick={onClose}
                >
                  {t("nav.sale")}
                </Link>

                <Link
                  href="/#new-arrivals"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={onClose}
                >
                  {t("nav.newArrivals")}
                </Link>
              </nav>

              {/* Footer */}
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <LanguageSwitcher />
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" style={{ color: COLORS.rose }} />
                  <span>
                    {wishlistItems.length} {isRTL ? "في المفضلة" : "in wishlist"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
