"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { COLORS } from "@/lib/constants";

export function CartCount() {
  const { itemCount, openCart } = useCartStore();

  return (
    <button
      onClick={openCart}
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="h-5 w-5" style={{ color: COLORS.gold }} />
      {itemCount > 0 && (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: COLORS.gold }}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}
