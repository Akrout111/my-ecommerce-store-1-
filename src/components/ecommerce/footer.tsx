"use client";

import React from "react";
import { Store, Facebook, Twitter, Instagram, Youtube, CreditCard, Banknote, Wallet, Landmark } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";

const footerLinks = {
  quickLinks: [
    { key: "footerAboutUs" as const, href: "#" },
    { key: "footerCareers" as const, href: "#" },
    { key: "footerBlog" as const, href: "#" },
    { key: "footerOrderTracking" as const, href: "#" },
  ],
  customerService: [
    { key: "footerContactUs" as const, href: "#" },
    { key: "footerFAQ" as const, href: "#" },
    { key: "footerShipping" as const, href: "#" },
    { key: "footerTerms" as const, href: "#" },
    { key: "footerPrivacy" as const, href: "#" },
  ],
  socials: [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ],
};

export function Footer() {
  const { t, isRTL } = useLanguage();

  return (
    <footer id="about" className="bg-slate-900 text-slate-300" dir={isRTL ? "rtl" : "ltr"}>
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">
                {t("footerCompanyTitle")}
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              {t("footerCompanyDesc")}
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3">
              {footerLinks.socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-emerald-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footerQuickLinks")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footerCustomerService")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footerConnectWithUs")}
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p>
                {isRTL ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
              </p>
              <p>
                {isRTL ? "الإمارات العربية المتحدة" : "Dubai, UAE"}
              </p>
              <p className="text-emerald-400">support@shopzone.com</p>
              <p>+966 50 000 0000</p>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t("footerPaymentMethods")}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-slate-800 text-slate-400">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex h-8 w-12 items-center justify-center rounded bg-slate-800 text-slate-400">
                  <Banknote className="h-4 w-4" />
                </div>
                <div className="flex h-8 w-12 items-center justify-center rounded bg-slate-800 text-slate-400">
                  <Wallet className="h-4 w-4" />
                </div>
                <div className="flex h-8 w-12 items-center justify-center rounded bg-slate-800 text-slate-400">
                  <Landmark className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500">
            {t("footerCopyright")}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#" className="transition-colors hover:text-emerald-400">
              {t("footerTerms")}
            </a>
            <a href="#" className="transition-colors hover:text-emerald-400">
              {t("footerPrivacy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
