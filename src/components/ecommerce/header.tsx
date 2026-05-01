"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/components/ecommerce/language-provider";

const cartItemCount = 3;

export function Header() {
  const { t, isRTL, toggleLanguage, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("home"), href: "#" },
    { label: t("categories"), href: "#categories" },
    { label: t("deals"), href: "#deals" },
    { label: t("about"), href: "#about" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            ShopZone
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden max-w-xs flex-1 px-4 md:block">
          <div className="relative">
            <Search
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <Input
              placeholder={t("search")}
              className={`${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-9 bg-slate-50 border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-semibold"
          >
            {t("language")}
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5 text-slate-600" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 items-center justify-center rounded-full bg-rose-500 p-0 text-[10px] font-bold text-white border-0">
                {cartItemCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "left" : "right"} className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Store className="h-4 w-4" />
                  </div>
                  ShopZone
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 px-4">
                {/* Mobile Search */}
                <div className="relative mb-6">
                  <Search
                    className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ${
                      isRTL ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    placeholder={t("search")}
                    className={`${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-10 bg-slate-50`}
                  />
                </div>
                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="border-t border-slate-100 px-4 py-2 md:hidden">
        <div className="relative">
          <Search
            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ${
              isRTL ? "right-3" : "left-3"
            }`}
          />
          <Input
            placeholder={t("search")}
            className={`${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-9 bg-slate-50 border-slate-200`}
          />
        </div>
      </div>
    </motion.header>
  );
}
