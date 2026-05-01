"use client";

import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductBadge } from "@/components/products/ProductBadge";
import { COLORS } from "@/lib/constants";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  variant?: "default" | "compact";
}

export function ProductCard({ product, onQuickView, variant = "default" }: ProductCardProps) {
  const { t, language, formatCurrency } = useLanguage();
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      product,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
      price: product.salePrice ? product.price : product.price,
      totalPrice: product.salePrice ? product.price : product.price,
    });
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem(product.id);
  };

  const discountPercent = product.salePrice
    ? Math.round(((product.salePrice - product.price) / product.salePrice) * 100)
    : 0;

  const displayName = language === "ar" && product.nameAr ? product.nameAr : product.name;

  if (variant === "compact") {
    return (
      <div className="flex items-start gap-3">
        <div
          className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0"
        >
          {product.category === "women" || product.category === "beauty"
            ? "👗"
            : product.category === "men" || product.category === "shoes"
            ? "🧥"
            : product.category === "kids"
            ? "🧒"
            : "💍"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <p className="text-sm font-medium truncate">{displayName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold" style={{ color: COLORS.gold }}>
              {formatCurrency(product.price)}
            </span>
            {product.salePrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.salePrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
          {product.category === "women" || product.category === "beauty"
            ? "👗"
            : product.category === "men"
            ? "🧥"
            : product.category === "shoes"
            ? "👠"
            : product.category === "kids"
            ? "🧒"
            : product.category === "accessories"
            ? "💍"
            : "👟"}
        </div>

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {discountPercent > 0 && <ProductBadge type="SALE" text={`${discountPercent}% ${t("products.off")}`} />}
          {product.isNew && <ProductBadge type="NEW" />}
          {product.isBestSeller && <ProductBadge type="HOT" />}
          {product.stockCount <= 5 && product.inStock && <ProductBadge type="LOW_STOCK" />}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div
            whileTap={{ scale: 1.3 }}
            animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className="h-4 w-4"
              fill={wishlisted ? COLORS.rose : "none"}
              style={{ color: wishlisted ? COLORS.rose : undefined }}
            />
          </motion.div>
        </button>

        {/* Quick Add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold text-[#0F0F0F] transition-transform"
            style={{ backgroundColor: COLORS.gold }}
          >
            <ShoppingBag className="h-4 w-4" />
            {t("common.addToCart")}
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
        <h3 className="text-sm font-semibold line-clamp-1 mb-2">{displayName}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3"
                fill={i < Math.floor(product.rating) ? COLORS.gold : "none"}
                style={{ color: i < Math.floor(product.rating) ? COLORS.gold : undefined }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold" style={{ color: COLORS.gold }}>
            {formatCurrency(product.price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.salePrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
