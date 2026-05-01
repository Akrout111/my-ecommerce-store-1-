"use client";

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showCount?: boolean;
  className?: string;
}

export function ProductRating({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
  className,
}: ProductRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(iconSize, "fill-amber-400 text-amber-400")}
          />
        ))}
        {hasHalfStar && (
          <StarHalf className={cn(iconSize, "fill-amber-400 text-amber-400")} />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(iconSize, "text-slate-300 dark:text-slate-600")}
          />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
