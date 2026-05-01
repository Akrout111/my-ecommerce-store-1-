"use client";

import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/store/wishlist-store";
import { COLORS } from "@/lib/constants";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WishlistButton({ productId, className = "", size = "md" }: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(productId);

  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizeMap = {
    sm: "h-3.5 w-3.5",
    md: "h-4.5 w-4.5",
    lg: "h-5 w-5",
  };

  return (
    <button
      onClick={() => toggleItem(productId)}
      className={`${sizeMap[size]} inline-flex items-center justify-center rounded-full transition-colors ${
        wishlisted
          ? "bg-[#E8A0BF]/10 hover:bg-[#E8A0BF]/20"
          : "bg-white/80 hover:bg-white backdrop-blur-sm"
      } ${className}`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={wishlisted ? "filled" : "outline"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Heart
            className={iconSizeMap[size]}
            fill={wishlisted ? COLORS.rose : "none"}
            style={{ color: wishlisted ? COLORS.rose : undefined }}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
