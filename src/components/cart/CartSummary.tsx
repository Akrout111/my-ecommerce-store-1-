"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

export function CartSummary() {
  const { t, formatCurrency } = useLanguage();
  const { subtotal, shipping, tax, total } = useCartStore();
  const [promoCode, setPromoCode] = useState("");

  const isFreeShipping = shipping === 0;

  return (
    <div className="border-t border-border p-4 space-y-3">
      {/* Promo code */}
      <div className="flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder={t("cart.promoCode")}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
        />
        <button
          className="rounded-lg border border-[#C9A96E] px-4 py-2 text-sm font-medium hover:bg-[#C9A96E] hover:text-[#0F0F0F] transition-colors"
          style={{ color: COLORS.gold }}
        >
          {t("cart.apply")}
        </button>
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.shipping")}</span>
          <span className="font-medium" style={{ color: isFreeShipping ? "#22C55E" : undefined }}>
            {isFreeShipping ? t("cart.free") : formatCurrency(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.tax")}</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="font-bold text-base">{t("cart.total")}</span>
          <span className="font-bold text-base" style={{ color: COLORS.gold }}>
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Checkout */}
      <button
        className="w-full h-12 rounded-xl text-sm font-semibold text-[#0F0F0F] transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: COLORS.gold }}
      >
        {t("cart.checkout")}
      </button>
    </div>
  );
}
