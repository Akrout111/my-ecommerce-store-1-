"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-emerald-800 dark:bg-emerald-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center space-y-6">
            {isSubscribed ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/30">
                    <CheckCircle className="h-8 w-8 text-emerald-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">{t("newsletter.success")}</h3>
                <p className="text-emerald-200">{t("newsletter.successMessage")}</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/30">
                    <Mail className="h-7 w-7 text-emerald-300" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  {t("newsletter.title")}
                </h2>
                <p className="text-emerald-200">{t("newsletter.subtitle")}</p>
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder={t("newsletter.placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 flex-1 bg-white/10 border-emerald-600 text-white placeholder:text-emerald-300 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                  <Button
                    type="submit"
                    className="bg-emerald-500 text-white hover:bg-emerald-400 h-11 px-6 font-semibold"
                  >
                    {t("newsletter.button")}
                  </Button>
                </form>
                <p className="text-xs text-emerald-300/70">{t("newsletter.privacy")}</p>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
