"use client";

import { ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCartStore } from "@/store/cart-store";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

export function CartSheet() {
  const { items, isOpen, closeCart, itemCount } = useCartStore();
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side={isRTL ? "left" : "right"} className="flex w-[350px] flex-col sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
            {t("cart.title")}
            {itemCount > 0 && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {itemCount}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your shopping cart items
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={t("cart.empty")}
            description={t("cart.emptyMessage")}
            actionLabel={t("cart.continueShopping")}
            onAction={closeCart}
          />
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-4">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <CartSummary />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
