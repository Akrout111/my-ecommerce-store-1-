"use client";

import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

interface ProductPriceProps {
  price: number;
  salePrice?: number;
  size?: "sm" | "md" | "lg";
}

export function ProductPrice({ price, salePrice, size = "md" }: ProductPriceProps) {
  const { formatCurrency } = useLanguage();

  const sizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const hasDiscount = salePrice && salePrice > price;

  return (
    <div className="flex items-center gap-2">
      <span className={`${sizeMap[size]} font-bold`} style={{ color: COLORS.gold }}>
        {formatCurrency(price)}
      </span>
      {hasDiscount && (
        <span className={`${sizeMap[size]} text-muted-foreground line-through`}>
          {formatCurrency(salePrice)}
        </span>
      )}
    </div>
  );
}
