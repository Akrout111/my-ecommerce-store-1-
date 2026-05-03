"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  ShoppingBag,
  Eye,
  Share2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductBadge } from "@/components/products/ProductBadge";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  variant?: "default" | "compact";
  priority?: boolean;
}

const categoryImageMap: Record<string, string> = {
  women: "/images/categories/women.jpg",
  men: "/images/categories/men.jpg",
  kids: "/images/categories/kids.jpg",
  shoes: "/images/categories/shoes.jpg",
  accessories: "/images/categories/accessories.jpg",
  beauty: "/images/categories/beauty.jpg",
};

const PLACEHOLDER_IMG = "/images/placeholder-product.svg";

const colorMap: Record<string, string> = {
  black: "#111",
  white: "#fff",
  beige: "#F5F0EB",
  pink: "#E8A0BF",
  gold: "#C9A96E",
  navy: "#1a2744",
  red: "#c0392b",
  blue: "#3498db",
  green: "#27ae60",
  grey: "#7f8c8d",
  gray: "#7f8c8d",
  brown: "#8B4513",
  purple: "#9b59b6",
  orange: "#e67e22",
  yellow: "#f1c40f",
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(Math.max(rating - star + 1, 0), 1);
        return (
          <div key={star} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute text-muted-foreground/20"
              fill="currentColor"
            />
            <div
              className="absolute overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={size}
                className="text-[#C9A96E]"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { addItem } = useCartStore();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      product,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: product.images[0] || "",
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      totalPrice: product.salePrice ?? product.price,
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-0 shadow-2xl">
          <div className="grid max-h-[85vh] overflow-y-auto md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square bg-muted">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <Image
                  src={categoryImageMap[product.category] || PLACEHOLDER_IMG}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col p-6">
              <Dialog.Close className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted">
                <X size={18} />
              </Dialog.Close>

              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {product.brand}
              </span>
              <h3 className="mt-1 text-xl font-bold">{product.name}</h3>

              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={product.rating} size={14} />
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>

              <div className="mt-3">
                {product.salePrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#C9A96E]">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.salePrice.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-[#C9A96E]">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    Color
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {product.colors.map((color) => {
                      const colorKey = color.toLowerCase();
                      const bgColor = colorMap[colorKey] || colorKey;
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`h-6 w-6 rounded-full border transition ${
                            selectedColor === color
                              ? "ring-2 ring-[#C9A96E] ring-offset-2"
                              : "border-muted hover:border-[#C9A96E]"
                          }`}
                          style={{ backgroundColor: bgColor }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Size
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          selectedSize === size
                            ? "border-[#C9A96E] bg-[#C9A96E] font-medium text-[#0F0F0F]"
                            : "border-border hover:border-[#C9A96E]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F] transition disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingBag size={16} />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </motion.button>

              <Link
                href={`/products/${product.id}`}
                className="mt-3 block text-center text-sm text-[#C9A96E] underline-offset-2 hover:underline"
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ProductCard({
  product,
  variant = "default",
  priority = false,
}: ProductCardProps) {
  const { isRTL } = useLanguage();
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  const [imageError, setImageError] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const isWishlisted = wishlistItems.includes(product.id);
  const hasSecondImage = product.images.length > 1 && !imageError;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!product.inStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      product,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: product.images[0] || "",
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
      totalPrice: product.salePrice ?? product.price,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleItem(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setQuickViewOpen(true);
  };

  const discountPercent = product.salePrice
    ? Math.round(((product.salePrice - product.price) / product.salePrice) * 100)
    : 0;

  // Compact variant
  if (variant === "compact") {
    return (
      <Link href={`/products/${product.id}`} className="flex items-center gap-3">
        <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {product.images[0] && !imageError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="60px"
              onError={() => setImageError(true)}
            />
          ) : (
            <Image
              src={categoryImageMap[product.category] || PLACEHOLDER_IMG}
              alt={product.name}
              fill
              className="object-cover"
              sizes="60px"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <p className="text-xs font-medium text-[#C9A96E]">
            ${product.salePrice ?? product.price}
          </p>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <>
      <Link
        href={`/products/${product.id}`}
        prefetch={true}
        className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-2xl"
      >
        {/* Image Section */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-muted">
          {product.images[0] && !imageError ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={priority}
                onError={() => setImageError(true)}
              />
              {hasSecondImage && (
                <Image
                  src={product.images[1]}
                  alt={`${product.name} alt`}
                  fill
                  className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              )}
            </>
          ) : (
            <Image
              src={categoryImageMap[product.category] || PLACEHOLDER_IMG}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
            {product.isNew && (
              <ProductBadge type="NEW" />
            )}
            {product.isBestSeller && (
              <ProductBadge type="HOT" />
            )}
            {discountPercent > 0 && (
              <ProductBadge type="SALE" text={`-${discountPercent}%`} />
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition ${
              isWishlisted
                ? "bg-rose-500 text-white"
                : "bg-white/70 text-foreground hover:bg-white"
            }`}
          >
            <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Hover Overlay */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={handleQuickView}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition hover:bg-white/40"
            >
              <Eye size={16} />
            </button>
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#C9A96E] text-xs font-semibold text-[#0F0F0F] disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={14} />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </motion.button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition hover:bg-white/40"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </span>
          <h3 className="mt-0.5 text-sm font-semibold line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-1.5">
            <StarRating rating={product.rating} size={12} />
            <span className="text-[10px] text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-sm font-bold text-[#C9A96E]">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ${product.salePrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-[#C9A96E]">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick View Dialog */}
      <QuickViewDialog
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
