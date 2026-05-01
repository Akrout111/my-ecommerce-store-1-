"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeType = "bestSeller" | "new" | "sale" | "limited";

interface ProductBadgeProps {
  type: BadgeType;
  label?: string;
  className?: string;
}

const badgeStyles: Record<BadgeType, string> = {
  bestSeller: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  new: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  sale: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  limited: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const defaultLabels: Record<BadgeType, string> = {
  bestSeller: "Best Seller",
  new: "New",
  sale: "Sale",
  limited: "Limited",
};

export function ProductBadge({ type, label, className }: ProductBadgeProps) {
  return (
    <Badge
      className={cn(
        "px-2 py-0.5 text-xs font-semibold border-0",
        badgeStyles[type],
        className
      )}
    >
      {label ?? defaultLabels[type]}
    </Badge>
  );
}
