"use client";

import { ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  if (!product) return null;

  const name = language === "ar" ? product.nameAr : product.name;
  const description = language === "ar" ? product.descriptionAr : product.description;

  const getBadgeType = () => {
    if (product.isBestSeller) return "bestSeller" as const;
    if (product.isNew) return "new" as const;
    if (product.discount && product.discount > 0) return "sale" as const;
    return null;
  };

  const badgeType = getBadgeType();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{name}</DialogTitle>
        </DialogHeader>

        <div className={cn("grid gap-6", isRTL ? "md:grid-cols-2" : "md:grid-cols-2")}>
          {/* Image Placeholder */}
          <div className="aspect-square rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <ShoppingBag className="h-20 w-20 text-white/30" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-foreground">{name}</h2>
              <WishlistButton productId={product.id} size="md" />
            </div>

            <ProductRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

            {badgeType && <ProductBadge type={badgeType} />}

            <ProductPrice
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />

            <Separator />

            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("products.color")}</p>
                <div className="flex gap-2">
                  {product.variants.slice(0, 5).map((variant) => (
                    <Button
                      key={variant.id}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {variant.value}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <AddToCartButton product={product} size="lg" className="w-full" />

            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-rose-500 font-medium">
                {t("products.lowStock").replace("{count}", String(product.stock))}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
