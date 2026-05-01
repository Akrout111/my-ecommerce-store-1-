"use client";

import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";

interface ProductPriceProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProductPrice({
  price,
  originalPrice,
  currency = CURRENCY_SYMBOL,
  size = "md",
  className,
}: ProductPriceProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const originalSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className={cn("font-bold text-emerald-600 dark:text-emerald-400", sizeClasses[size])}>
        {currency}{price.toFixed(2)}
      </span>
      {hasDiscount && (
        <>
          <span
            className={cn(
              "text-muted-foreground line-through",
              originalSizeClasses[size]
            )}
          >
            {currency}{originalPrice.toFixed(2)}
          </span>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
            -{discountPercentage}%
          </span>
        </>
      )}
    </div>
  );
}
