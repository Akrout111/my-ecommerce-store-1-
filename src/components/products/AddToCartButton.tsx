"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { useCartStore } from "@/store/cart-store";
import { COLORS } from "@/lib/constants";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  size?: string;
  color?: string;
  className?: string;
  variant?: "default" | "outline";
}

export function AddToCartButton({ product, size, color, className = "", variant = "default" }: AddToCartButtonProps) {
  const { t } = useLanguage();
  const { addItem, openCart } = useCartStore();

  const handleClick = () => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      product,
      name: product.name,
      image: product.images?.[0] || "",
      quantity: 1,
      size: size || product.sizes[0],
      color: color || product.colors[0],
      price: product.salePrice ?? product.price,
      totalPrice: product.salePrice ?? product.price,
    });
    openCart();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl h-11 px-6 text-sm font-semibold transition-all ${
        variant === "outline"
          ? "border-2 border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0F0F0F]"
          : "text-[#0F0F0F] hover:opacity-90"
      } ${className}`}
      style={variant === "default" ? { backgroundColor: COLORS.gold } : undefined}
    >
      <ShoppingBag className="h-4 w-4" />
      {t("common.addToCart")}
    </motion.button>
  );
}
