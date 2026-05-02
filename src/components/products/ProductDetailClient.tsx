"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Truck,
  RotateCcw,
  Shield,
  X,
  Check,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Sheet from "@radix-ui/react-dialog";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    nameAr?: string | null;
    description: string;
    descriptionAr?: string | null;
    price: number;
    salePrice?: number | null;
    brand: string;
    images: string[];
    category: string;
    subcategory?: string | null;
    sizes: string[];
    colors: string[];
    rating: number;
    reviewCount: number;
    inStock: boolean;
    stockCount: number;
    isFeatured?: boolean;
    isNew: boolean;
    isBestSeller: boolean;
    tags: string[];
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  relatedProducts: any[];
}

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

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
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

function RatingBar({ stars, percentage }: { stars: number; percentage: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 text-xs text-muted-foreground">{stars}</span>
      <Star size={12} className="text-[#C9A96E]" fill="currentColor" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[#C9A96E] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs text-muted-foreground">
        {percentage}%
      </span>
    </div>
  );
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { isRTL, dir } = useLanguage();
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleItem } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isWishlisted = wishlistItems.includes(product.id);

  const discountPercent = product.salePrice
    ? Math.round(((product.salePrice - product.price) / product.salePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem({
      id: product.id,
      productId: product.id,
      product,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: product.images[0] || "",
      quantity,
      size: selectedSize,
      color: selectedColor,
      totalPrice: (product.salePrice ?? product.price) * quantity,
    });
  };

  const handlePrevImage = () => {
    setLightboxIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const stockBadge = () => {
    if (!product.inStock || product.stockCount === 0) {
      return (
        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
          Out of Stock
        </span>
      );
    }
    if (product.stockCount <= 5) {
      return (
        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500">
          Only {product.stockCount} left
        </span>
      );
    }
    return (
      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
        In Stock
      </span>
    );
  };

  const mockReviews = [
    {
      name: "Sarah M.",
      date: "2026-04-15",
      stars: 5,
      comment:
        "Absolutely love this piece! The quality is outstanding and it fits perfectly. Will definitely be ordering more from this collection.",
    },
    {
      name: "James K.",
      date: "2026-04-10",
      stars: 4,
      comment:
        "Great quality fabric and beautiful design. Shipping was fast too. Only wish there were more color options available.",
    },
    {
      name: "Aisha R.",
      date: "2026-03-28",
      stars: 5,
      comment:
        "This exceeded my expectations! The attention to detail is incredible. It's become my go-to outfit for special occasions.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" dir={dir}>
      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left — Image Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {/* Main Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[selectedImage] || "/images/placeholder-product.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Zoom Button */}
            <button
              onClick={() => {
                setLightboxIndex(selectedImage);
                setLightboxOpen(true);
              }}
              className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
            >
              <ZoomIn size={18} />
            </button>

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.isNew && (
                <span className="rounded-full bg-[#C9A96E] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0F0F0F]">
                  New
                </span>
              )}
              {product.isBestSeller && (
                <span className="rounded-full bg-[#E8A0BF] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Best Seller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-3 flex gap-2">
            {product.images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-20 w-20 overflow-hidden rounded-lg transition ${
                  selectedImage === idx
                    ? "ring-2 ring-[#C9A96E]"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img || "/images/placeholder-product.svg"}
                  alt={`${product.name} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right — Product Info */}
        <div className="flex flex-col">
          {/* Brand */}
          <span className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
            {product.brand}
          </span>

          {/* Name */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Arabic Name */}
          {isRTL && product.nameAr && (
            <p className="mb-3 text-lg text-muted-foreground">
              {product.nameAr}
            </p>
          )}

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <a
              href="#reviews"
              className="text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
              {product.reviewCount} reviews
            </a>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-[#C9A96E]">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-500">
                  -{discountPercent}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-[#C9A96E]">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Badge */}
          <div className="mt-2">{stockBadge()}</div>

          <hr className="my-6 border-border" />

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Color</span>
                <span className="text-sm text-muted-foreground">
                  {selectedColor}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const colorKey = color.toLowerCase();
                  const bgColor = colorMap[colorKey] || colorKey;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full border-2 transition ${
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
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Size</span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-[#C9A96E] underline-offset-2 hover:underline"
                >
                  Size Guide →
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition ${
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

          {/* Quantity */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border text-sm transition hover:bg-muted"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stockCount, q + 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border text-sm transition hover:bg-muted"
                disabled={quantity >= product.stockCount}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F] transition disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag size={18} />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </motion.button>

          {/* Wishlist + Share */}
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => toggleItem(product.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium transition ${
                isWishlisted
                  ? "border-rose-500 text-rose-500"
                  : "border-border hover:border-[#C9A96E]"
              }`}
            >
              <Heart
                size={16}
                fill={isWishlisted ? "currentColor" : "none"}
              />
              {isWishlisted ? "Saved" : "Add to Wishlist"}
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium transition hover:border-[#C9A96E]">
              <Share2 size={16} />
              Share
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Truck size={18} className="text-[#C9A96E]" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                Free Shipping
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <RotateCcw size={18} className="text-[#C9A96E]" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                30-Day Returns
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Shield size={18} className="text-[#C9A96E]" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                Secure Payment
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs.Root defaultValue="description" className="mt-12">
        <Tabs.List className="flex gap-6 border-b border-border">
          {["description", "details", "shipping", "reviews"].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium capitalize text-muted-foreground transition data-[state=active]:border-[#C9A96E] data-[state=active]:text-foreground"
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="description" className="mt-6">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <ReactMarkdown>
              {isRTL && product.descriptionAr
                ? product.descriptionAr
                : product.description}
            </ReactMarkdown>
          </div>
        </Tabs.Content>

        <Tabs.Content value="details" className="mt-6">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <td className="bg-muted/50 px-4 py-3 font-medium">Brand</td>
                  <td className="px-4 py-3">{product.brand}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="bg-muted/50 px-4 py-3 font-medium">
                    Category
                  </td>
                  <td className="px-4 py-3 capitalize">{product.category}</td>
                </tr>
                <tr>
                  <td className="bg-muted/50 px-4 py-3 font-medium">SKU</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {product.id.slice(0, 8).toUpperCase()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content value="shipping" className="mt-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              We offer free standard shipping on all orders over $50. Orders are
              processed within 1-2 business days and delivered within 5-7
              business days for standard shipping.
            </p>
            <p>
              Express shipping (2-3 business days) is available for $12.99, and
              next-day delivery is available for $24.99.
            </p>
            <p>
              International shipping is available to select countries. Delivery
              times vary by destination.
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="reviews" className="mt-6" id="reviews">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Rating Summary */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-center">
                <span className="text-5xl font-bold">{product.rating}</span>
                <div className="mt-1 flex justify-center">
                  <StarRating rating={product.rating} size={20} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on {product.reviewCount} reviews
                </p>
              </div>
              <div className="mt-4 space-y-1.5">
                <RatingBar stars={5} percentage={68} />
                <RatingBar stars={4} percentage={22} />
                <RatingBar stars={3} percentage={6} />
                <RatingBar stars={2} percentage={3} />
                <RatingBar stars={1} percentage={1} />
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {mockReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{review.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <StarRating rating={review.stars} size={14} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              ))}

              <button
                onClick={() => setReviewDialogOpen(true)}
                className="rounded-full border border-[#C9A96E] px-6 py-2.5 text-sm font-medium text-[#C9A96E] transition hover:bg-[#C9A96E] hover:text-[#0F0F0F]"
              >
                Write a Review
              </button>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
          <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="w-[260px] flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center">
              <Image
                src={product.images[lightboxIndex] || "/images/placeholder-product.svg"}
                alt={product.name}
                width={800}
                height={1000}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />

              {/* Close */}
              <Dialog.Close className="absolute -top-10 right-0 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20">
                <X size={20} />
              </Dialog.Close>

              {/* Prev/Next */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Size Guide Sheet */}
      <Sheet.Root open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <Sheet.Portal>
          <Sheet.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Sheet.Content className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-background p-6 sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:w-[400px] sm:rounded-none sm:rounded-l-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Size Guide</h3>
              <Sheet.Close className="rounded-full p-1 transition hover:bg-muted">
                <X size={20} />
              </Sheet.Close>
            </div>
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <p>
                Our sizes follow standard international sizing. Please refer to
                the chart below for measurements.
              </p>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-3 py-2 text-left font-medium">Size</th>
                      <th className="px-3 py-2 text-left font-medium">
                        Chest (in)
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Waist (in)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["XS", "32-34", "24-26"],
                      ["S", "34-36", "26-28"],
                      ["M", "36-38", "28-30"],
                      ["L", "38-40", "30-32"],
                      ["XL", "40-42", "32-34"],
                    ].map(([size, chest, waist]) => (
                      <tr
                        key={size}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-3 py-2 font-medium">{size}</td>
                        <td className="px-3 py-2">{chest}</td>
                        <td className="px-3 py-2">{waist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>

      {/* Review Dialog */}
      <Dialog.Root open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-bold">
                Write a Review
              </Dialog.Title>
              <Dialog.Close className="rounded-full p-1 transition hover:bg-muted">
                <X size={20} />
              </Dialog.Close>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Your Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          star <= reviewRating
                            ? "text-[#C9A96E]"
                            : "text-muted-foreground/30"
                        }
                        fill={star <= reviewRating ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                  placeholder="Share your experience with this product..."
                />
              </div>
              <button
                onClick={() => setReviewDialogOpen(false)}
                className="w-full rounded-full bg-[#C9A96E] py-3 font-semibold text-[#0F0F0F]"
              >
                Submit Review
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
