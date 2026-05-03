"use client";

import { useCartStore } from "@/store/cart-store";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/lib/constants";

export function CartSheet() {
  const { t, isRTL } = useLanguage();
  const { items, isOpen, closeCart, itemCount } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 z-50 w-full max-w-md bg-background shadow-2xl ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" style={{ color: COLORS.gold }} />
                  <h2 className="text-lg font-bold">
                    {t("cart.title")} ({itemCount})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-colors"
                  aria-label={t("common.close")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-semibold mb-1">{t("cart.empty")}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t("cart.emptyMessage")}
                    </p>
                    <button
                      onClick={closeCart}
                      className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-[#0F0F0F]"
                      style={{ backgroundColor: COLORS.gold }}
                    >
                      {t("cart.startShopping")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              {items.length > 0 && <CartSummary />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
