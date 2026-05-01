"use client";

import { Store, Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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

const quickLinks = [
  { key: "footer.aboutUs", href: "#" },
  { key: "footer.careers", href: "#" },
  { key: "footer.blog", href: "#" },
  { key: "footer.orderTracking", href: "#" },
];

const customerServiceLinks = [
  { key: "footer.faq", href: "#" },
  { key: "footer.shipping", href: "#" },
  { key: "footer.contactUs", href: "#" },
  { key: "footer.terms", href: "#" },
  { key: "footer.privacy", href: "#" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Shop<span className="text-emerald-400">Zone</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {t("footer.companyDesc")}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
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

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t("footer.customerService")}
            </h3>
            <ul className="space-y-2.5">
              {customerServiceLinks.map((link) => (
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

          {/* Column 4: Connect With Us */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t("footer.connectWithUs")}
            </h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Newsletter Mini Form */}
            <div className="space-y-2">
              <p className="text-sm text-slate-400">{t("footer.followUs")}</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  className="h-9 flex-1 bg-slate-800 border-slate-700 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 shrink-0"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        {/* Bottom Row */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500">{t("footer.copyright")}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{t("footer.paymentMethods")}:</span>
            <div className="flex items-center gap-2">
              <span className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white">
                VISA
              </span>
              <span className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white">
                MC
              </span>
              <span className="rounded bg-slate-800 px-2 py-1 text-xs font-semibold text-white">
                PayPal
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
