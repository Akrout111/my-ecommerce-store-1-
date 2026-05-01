"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types/product";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";
import { cn } from "@/lib/utils";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: string;
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant: selectedVariant,
  size = "sm",
  className,
  showText = true,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addProduct } = useCart();
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addProduct(product, quantity, selectedVariant);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || product.stock <= 0}
      size={size === "icon" ? "icon" : size === "lg" ? "lg" : size === "md" ? "default" : "sm"}
      className={cn(
        "bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5",
        className
      )}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {showText && (
        <span>
          {product.stock <= 0 ? t("products.outOfStock") : t("products.addToCart")}
        </span>
      )}
    </Button>
  );
}
