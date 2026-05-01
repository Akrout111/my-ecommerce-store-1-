"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  initialActive?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({
  productId,
  initialActive = false,
  className,
  size = "sm",
}: WishlistButtonProps) {
  const [isActive, setIsActive] = useState(initialActive);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsActive(!isActive);
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "h-8 w-8 rounded-full transition-colors",
        isActive
          ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
          : "text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800",
        className
      )}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          iconSize,
          isActive && "fill-rose-500"
        )}
      />
    </Button>
  );
}
