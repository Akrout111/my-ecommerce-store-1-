"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export function CartSummary() {
  const { t, formatCurrency } = useLanguage();
  const { items, subtotal, shipping, tax, discount, total, couponCode, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const isFreeShipping = shipping === 0;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");

    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    applyCoupon(code);

    // Check if the coupon actually applied a discount
    const updatedState = useCartStore.getState();
    if (updatedState.discount > 0) {
      setCouponSuccess("Code applied!");
      setCouponInput("");
    } else {
      removeCoupon();
      setCouponError("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess("");
    setCouponError("");
  };

  return (
    <div className="border-t border-border p-4 space-y-3">
      {/* Free Shipping Progress Bar */}
      <div className="space-y-1.5">
        {subtotal < FREE_SHIPPING_THRESHOLD ? (
          <>
            <p className="text-xs text-muted-foreground">
              You&apos;re <span className="font-semibold text-foreground">{formatCurrency(amountToFreeShipping)}</span> away from free shipping
            </p>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C9A96E] transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-xs font-medium text-green-600">
            You&apos;ve unlocked free shipping!
          </p>
        )}
      </div>

      {/* Coupon Code */}
      {couponCode ? (
        <div className="flex items-center justify-between rounded-lg border border-[#C9A96E]/30 bg-[#C9A96E]/5 px-3 py-2">
          <span className="text-sm">
            Applied: <span className="font-semibold">{couponCode}</span>
            {discount > 0 && (
              <span className="text-green-600 text-xs ml-1">
                (-{formatCurrency(discount)})
              </span>
            )}
          </span>
          <button
            onClick={handleRemoveCoupon}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                setCouponError("");
                setCouponSuccess("");
              }}
              placeholder={t("cart.promoCode")}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
            />
            <button
              onClick={handleApplyCoupon}
              className="rounded-lg border border-[#C9A96E] px-4 py-2 text-sm font-medium hover:bg-[#C9A96E] hover:text-[#0F0F0F] transition-colors"
              style={{ color: COLORS.gold }}
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-xs text-red-500">{couponError}</p>}
          {couponSuccess && <p className="text-xs text-green-600">{couponSuccess}</p>}
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.subtotal")}</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
          </div>
        )}
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
      <Link
        href="/checkout"
        className={`block w-full h-12 rounded-xl text-sm font-semibold text-center leading-[3rem] transition-transform hover:scale-[1.02] ${
          items.length === 0
            ? "pointer-events-none opacity-50 bg-muted text-muted-foreground"
            : "text-[#0F0F0F]"
        }`}
        style={items.length > 0 ? { backgroundColor: COLORS.gold } : undefined}
        aria-disabled={items.length === 0}
      >
        {t("cart.checkout")}
      </Link>
    </div>
  );
}
