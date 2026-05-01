"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

export function CartSummary() {
  const { subtotal, shipping, tax, discount, total } = useCartStore();
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="space-y-3">
      <Separator />

      {/* Free Shipping Progress */}
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isFreeShipping
            ? t("products.freeShipping") + " ✓"
            : `${CURRENCY_SYMBOL}${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} ${t("cart.freeShippingNote").replace(`$${FREE_SHIPPING_THRESHOLD}`, `$${FREE_SHIPPING_THRESHOLD}`)}`
          }
        </p>
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span className="font-medium">{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("cart.shipping")}</span>
          <span className="font-medium">
            {shipping === 0 ? t("products.freeShipping") : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("cart.tax")}</span>
          <span className="font-medium">{CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("cart.discount")}</span>
            <span className="font-medium text-rose-500">-{CURRENCY_SYMBOL}{discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-base font-bold">{t("cart.total")}</span>
        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {CURRENCY_SYMBOL}{total.toFixed(2)}
        </span>
      </div>

      <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-11">
        {t("cart.checkout")}
      </Button>
    </div>
  );
}
