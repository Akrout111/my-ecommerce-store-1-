"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";
import type { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { t, language, formatCurrency } = useLanguage();
  const { updateQuantity, removeItem } = useCartStore();

  const displayName =
    language === "ar" && item.product.nameAr ? item.product.nameAr : item.product.name;

  return (
    <div className="flex gap-3 rounded-xl border border-border p-3">
      {/* Image placeholder */}
      <div className="w-20 h-24 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
        {item.product.category === "women" || item.product.category === "beauty"
          ? "👗"
          : item.product.category === "men"
          ? "🧥"
          : item.product.category === "shoes"
          ? "👠"
          : item.product.category === "kids"
          ? "🧒"
          : "💍"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{item.product.brand}</p>
        <h4 className="text-sm font-semibold line-clamp-1">{displayName}</h4>

        {/* Size & Color */}
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {item.size && (
            <span className="rounded bg-muted px-1.5 py-0.5">
              {t("products.size")}: {item.size}
            </span>
          )}
          {item.color && (
            <span className="rounded bg-muted px-1.5 py-0.5">
              {t("products.color")}: {item.color}
            </span>
          )}
        </div>

        {/* Quantity & Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: COLORS.gold }}>
              {formatCurrency(item.totalPrice)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label={t("cart.removeItem")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
