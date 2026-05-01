"use client";

import { Star } from "lucide-react";
import { COLORS } from "@/lib/constants";

interface ProductRatingProps {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md";
}

export function ProductRating({ rating, reviewCount, size = "md" }: ProductRatingProps) {
  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={starSize}
            fill={i < Math.floor(rating) ? COLORS.gold : "none"}
            style={{ color: i < Math.floor(rating) ? COLORS.gold : undefined }}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">({reviewCount})</span>
    </div>
  );
}
