"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import type { CartItem as CartItemType } from "@/types/cart";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import { cn } from "@/lib/utils";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const name = language === "ar" ? item.product.nameAr : item.product.name;

  return (
    <div className="flex gap-3 py-3">
      {/* Image Placeholder */}
      <div className="h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        <span className="text-lg font-bold text-white/40">{name.charAt(0)}</span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-1 text-sm font-medium text-foreground">{name}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-rose-500"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {CURRENCY_SYMBOL}{item.price.toFixed(2)}
        </span>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <span className="text-sm font-bold text-foreground">
            {CURRENCY_SYMBOL}{item.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
