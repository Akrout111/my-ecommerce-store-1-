"use client";

import { ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductPrice } from "./ProductPrice";
import { ProductRating } from "./ProductRating";
import { ProductBadge } from "./ProductBadge";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";
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

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  className?: string;
}

const categoryColors: Record<string, string> = {
  electronics: "from-cyan-500 to-teal-600",
  fashion: "from-pink-500 to-rose-600",
  home: "from-amber-500 to-orange-600",
  beauty: "from-purple-500 to-fuchsia-600",
  sports: "from-emerald-500 to-green-600",
  books: "from-yellow-500 to-amber-600",
  toys: "from-red-500 to-pink-600",
  groceries: "from-lime-500 to-green-600",
};

export function ProductCard({ product, onQuickView, className }: ProductCardProps) {
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const name = language === "ar" ? product.nameAr : product.name;
  const gradientClass = categoryColors[product.category?.toLowerCase()] ?? "from-emerald-500 to-teal-600";

  const getBadgeType = () => {
    if (product.isBestSeller) return "bestSeller" as const;
    if (product.isNew) return "new" as const;
    if (product.discount && product.discount > 0) return "sale" as const;
    return null;
  };

  const badgeType = getBadgeType();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("group relative overflow-hidden border transition-shadow hover:shadow-lg", className)}>
        {/* Image Placeholder */}
        <div className={cn("relative aspect-square overflow-hidden bg-gradient-to-br", gradientClass)}>
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-white/40" />
          </div>

          {/* Badges */}
          {badgeType && (
            <div className={cn("absolute top-2 flex gap-1.5", isRTL ? "right-2" : "left-2")}>
              <ProductBadge type={badgeType} />
            </div>
          )}

          {/* Wishlist */}
          <div className={cn("absolute top-2", isRTL ? "left-2" : "right-2")}>
            <WishlistButton productId={product.id} />
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 transition-opacity group-hover:opacity-100 gap-1.5"
              onClick={() => onQuickView?.(product)}
            >
              <Eye className="h-4 w-4" />
              {t("products.quickView")}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{name}</h3>

          <ProductRating rating={product.rating} reviewCount={product.reviewCount} />

          <ProductPrice
            price={product.price}
            originalPrice={product.originalPrice}
            size="sm"
          />

          <AddToCartButton product={product} className="w-full" />
        </div>
      </Card>
    </motion.div>
  );
}
