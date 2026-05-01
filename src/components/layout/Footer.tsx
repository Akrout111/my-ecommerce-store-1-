"use client";

import Link from "next/link";
import { Diamond, Instagram, Twitter, Facebook } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS, APP_NAME } from "@/lib/constants";

export function Footer() {
  const { t, isRTL } = useLanguage();

  const shopLinks = [
    { label: t("nav.women"), href: "/#women" },
    { label: t("nav.men"), href: "/#men" },
    { label: t("nav.kids"), href: "/#kids" },
    { label: t("nav.accessories"), href: "/#accessories" },
    { label: t("nav.shoes"), href: "/#shoes" },
    { label: t("nav.beauty"), href: "/#beauty" },
  ];

  const companyLinks = [
    { label: t("footer.aboutUs"), href: "/#" },
    { label: t("footer.careers"), href: "/#" },
    { label: t("footer.press"), href: "/#" },
  ];

  const supportLinks = [
    { label: t("footer.contactUs"), href: "/#" },
    { label: t("footer.faq"), href: "/#" },
    { label: t("footer.shipping"), href: "/#" },
    { label: t("footer.sizeGuide"), href: "/#" },
    { label: t("footer.privacy"), href: "/#" },
    { label: t("footer.terms"), href: "/#" },
  ];

  return (
    <footer className="bg-[#0F0F0F] text-[#FAF8F5] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Diamond className="h-6 w-6" style={{ color: COLORS.gold }} />
              <span className="text-xl font-bold" style={{ color: COLORS.gold }}>
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              Your Style. Your Story. Your Persona. Fashion reimagined for the modern world.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.gold }}>
              {t("footer.shop")}
            </h3>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#C9A96E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.gold }}>
              {t("footer.company")}
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#C9A96E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.gold }}>
              {t("footer.support")}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#C9A96E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2025 {APP_NAME}. {t("footer.rights")}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Apple Pay</span>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
