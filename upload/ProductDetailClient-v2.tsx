"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingBag, Star, Share2, ChevronLeft, ChevronRight,
  ZoomIn, Truck, RotateCcw, Shield, X, Check, Minus, Plus,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Sheet from "@radix-ui/react-dialog";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductDetailClientProps {
  product: {
    id: string; name: string; nameAr?: string;
    description: string; descriptionAr?: string;
    price: number; salePrice?: number; brand: string;
    images: string[]; category: string;
    sizes: string[]; colors: string[];
    rating: number; reviewCount: number;
    inStock: boolean; stockCount: number;
    isNew: boolean; isBestSeller: boolean;
    tags: string[];
  };
  relatedProducts: any[];
}

const colorMap: Record<string, string> = {
  black: "#111", white: "#fff", beige: "#F5F0EB", pink: "#E8A0BF",
  gold: "#C9A96E", navy: "#1a2744", grey: "#9CA3AF", gray: "#9CA3AF",
  brown: "#8B4513", red: "#DC2626", blue: "#2563EB", green: "#16A34A",
  purple: "#9333EA", orange: "#EA580C", yellow: "#EAB308",
};

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => {
        const fill = Math.min(Math.max(rating - s + 1, 0), 1);
        return (
          <div key={s} style={{ width: size, height: size }} className="relative">
            <Star size={size} className="absolute text-muted-foreground/20" fill="currentColor" />
            <div className="absolute overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-[#C9A96E]" fill="currentColor" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 text-xs text-muted-foreground">{stars}</span>
      <Star size={12} className="text-[#C9A96E]" fill="currentColor" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full rounded-full bg-[#C9A96E]" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
      </div>
      <span className="w-8 text-right text-xs text-muted-foreground">{percent}%</span>
    </div>
  );
}

const mockReviews = [
  { name: "Sarah Mitchell", date: "2026-04-15", rating: 5, title: "Absolutely stunning!", comment: "The quality exceeded my expectations. The fabric feels luxurious and the fit is perfect. Will definitely be ordering more from this collection.", verified: true },
  { name: "James Cooper", date: "2026-04-10", rating: 4, title: "Great quality, minor sizing issue", comment: "Beautiful piece with excellent craftsmanship. I had to size up but customer service was helpful with the exchange. Highly recommend!", verified: true },
  { name: "Aisha Rahman", date: "2026-03-28", rating: 5, title: "My new favorite", comment: "This has become my go-to outfit for special occasions. The attention to detail is incredible and it photographs beautifully.", verified: false },
];

const ratingDistribution = [
  { stars: 5, percent: 65 }, { stars: 4, percent: 20 }, { stars: 3, percent: 10 },
  { stars: 2, percent: 3 }, { stars: 1, percent: 2 },
];

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { isRTL, dir } = useLanguage();
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleItem } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [cartSuccess, setCartSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const isWishlisted = wishlistItems.some((i) => i.id === product.id);
  const discountPercent = product.salePrice
    ? Math.round(((product.salePrice - product.price) / product.salePrice) * 100)
    : 0;

  const handleAddToCart = useCallback(() => {
    if (!product.inStock) return;
    addItem({
      id: product.id, name: product.name,
      price: product.salePrice ?? product.price,
      image: product.images[0] || "", quantity,
      size: selectedSize, color: selectedColor,
    });
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2000);
  }, [product, quantity, selectedSize, selectedColor, addItem]);

  const handleShare = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleLightboxNav = useCallback((dir: number) => {
    setLightboxIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return product.images.length - 1;
      if (next >= product.images.length) return 0;
      return next;
    });
  }, [product.images.length]);

  const stockBadge = () => {
    if (!product.inStock || product.stockCount === 0)
      return <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">✗ Out of Stock</span>;
    if (product.stockCount <= 5)
      return <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500">⚠ Only {product.stockCount} left</span>;
    return <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">✓ In Stock</span>;
  };

  const maxQty = Math.min(product.stockCount || 10, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" dir={dir}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* LEFT — Image Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
            <AnimatePresence mode="wait">
              <motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                <Image src={product.images[selectedImage] || "/placeholder.jpg"} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </motion.div>
            </AnimatePresence>
            <button onClick={() => { setLightboxIndex(selectedImage); setLightboxOpen(true); }} className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60">
              <ZoomIn size={18} />
            </button>
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.isNew && <span className="rounded-full bg-[#C9A96E] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0F0F0F]">New</span>}
              {product.isBestSeller && <span className="rounded-full bg-[#E8A0BF] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Best Seller</span>}
              {discountPercent > 0 && <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">-{discountPercent}%</span>}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.map((img, idx) => (
              <button key={idx} onClick={() => setSelectedImage(idx)} className={`relative h-20 w-20 overflow-hidden rounded-lg transition ${selectedImage === idx ? "ring-2 ring-[#C9A96E]" : "opacity-70 hover:opacity-100"}`}>
                <Image src={img || "/placeholder.jpg"} alt={`${product.name} ${idx + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Product Info */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">{product.brand}</span>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {isRTL && product.nameAr && <p className="mb-3 text-lg text-muted-foreground">{product.nameAr}</p>}
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <a href="#reviews" className="text-sm text-muted-foreground underline-offset-2 hover:underline">{product.reviewCount} reviews</a>
          </div>
          <div className="mt-2">{stockBadge()}</div>

          <div className="mt-4 flex items-center gap-3">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-[#C9A96E]">${product.price.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through">${product.salePrice.toFixed(2)}</span>
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-500">-{discountPercent}%</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-[#C9A96E]">${product.price.toFixed(2)}</span>
            )}
          </div>

          <hr className="my-6 border-border" />

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Color</span>
                <span className="text-sm text-muted-foreground">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const bg = colorMap[color.toLowerCase()] || color.toLowerCase();
                  return (
                    <motion.button key={color} onClick={() => setSelectedColor(color)} whileTap={{ scale: 0.9 }}
                      className={`h-8 w-8 rounded-full border-2 transition ${selectedColor === color ? "ring-2 ring-[#C9A96E] ring-offset-2" : "border-border hover:border-[#C9A96E]"}`}
                      style={{ backgroundColor: bg }} title={color} />
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
                <button onClick={() => setSizeGuideOpen(true)} className="text-xs text-[#C9A96E] underline-offset-2 hover:underline">Size Guide →</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <motion.button key={size} onClick={() => setSelectedSize(size)} whileTap={{ scale: 0.95 }}
                    className={`rounded-full border px-4 py-1.5 text-sm transition ${selectedSize === size ? "border-[#C9A96E] bg-[#C9A96E] font-medium text-[#0F0F0F]" : "border-border hover:border-[#C9A96E]"}`}>
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="flex h-8 w-8 items-center justify-center rounded-full border text-sm transition hover:bg-muted disabled:opacity-40"><Minus size={14} /></button>
              <span className="w-8 text-center text-lg font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} className="flex h-8 w-8 items-center justify-center rounded-full border text-sm transition hover:bg-muted disabled:opacity-40"><Plus size={14} /></button>
            </div>
          </div>

          {/* Add to Cart */}
          <motion.button onClick={handleAddToCart} disabled={!product.inStock}
            className="relative flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#C9A96E] font-semibold text-[#0F0F0F] transition disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <AnimatePresence mode="wait">
              {cartSuccess ? (
                <motion.span key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Check size={18} className="text-green-700" /> Added to Cart
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <ShoppingBag size={18} /> {product.inStock ? "Add to Cart" : "Out of Stock"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Wishlist + Share */}
          <div className="mt-3 flex gap-3">
            <button onClick={() => toggleItem(product)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium transition ${isWishlisted ? "border-rose-500 text-rose-500" : "border-border hover:border-[#C9A96E]"}`}>
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} /> {isWishlisted ? "Saved" : "Add to Wishlist"}
            </button>
            <button onClick={handleShare}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium transition hover:border-[#C9A96E]">
              <Share2 size={16} />
              <AnimatePresence>
                {copied && (
                  <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-8 rounded-md bg-[#0F0F0F] px-2 py-1 text-[10px] text-white">Link copied!</motion.span>
                )}
              </AnimatePresence>
              Share
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col items-center gap-1.5 text-center"><Truck size={18} className="text-[#C9A96E]" /><span className="text-[10px] font-medium uppercase tracking-wide">Free Shipping</span></div>
            <div className="flex flex-col items-center gap-1.5 text-center"><RotateCcw size={18} className="text-[#C9A96E]" /><span className="text-[10px] font-medium uppercase tracking-wide">30-Day Returns</span></div>
            <div className="flex flex-col items-center gap-1.5 text-center"><Shield size={18} className="text-[#C9A96E]" /><span className="text-[10px] font-medium uppercase tracking-wide">Secure Payment</span></div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <Tabs.Root defaultValue="description" className="mt-12">
        <Tabs.List className="flex gap-6 border-b border-border">
          {["description","details","shipping","reviews"].map((t) => (
            <Tabs.Trigger key={t} value={t} className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium capitalize text-muted-foreground transition data-[state=active]:border-[#C9A96E] data-[state=active]:text-foreground">{t}</Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="description" className="mt-6">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <ReactMarkdown>{isRTL && product.descriptionAr ? product.descriptionAr : product.description}</ReactMarkdown>
          </div>
        </Tabs.Content>

        <Tabs.Content value="details" className="mt-6">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Brand", product.brand],
                  ["Category", product.category],
                  ["SKU", product.id.slice(0, 8).toUpperCase()],
                  ["Material", "Premium blend — see care label"],
                  ["Care Instructions", "Dry clean recommended. Do not bleach."],
                ].map(([k, v]) => (
                  <tr key={k as string} className="border-b border-border last:border-0">
                    <td className="bg-muted/50 px-4 py-3 font-medium">{k}</td>
                    <td className="px-4 py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content value="shipping" className="mt-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>We offer free standard shipping on all orders over $50. Orders are processed within 1-2 business days and delivered within 3-5 business days for standard shipping.</p>
            <p>Express shipping (2-3 business days) is available for $12.99, and next-day delivery is available for $24.99.</p>
            <p>We accept returns within 30 days of delivery for a full refund or exchange. Items must be unworn with original tags attached.</p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="reviews" className="mt-6" id="reviews">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Rating Summary */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-center">
                <span className="text-5xl font-bold">{product.rating}</span>
                <p className="text-xs text-muted-foreground">out of 5</p>
                <div className="mt-1 flex justify-center"><StarRating rating={product.rating} size={20} /></div>
                <p className="mt-1 text-sm text-muted-foreground">Based on {product.reviewCount} reviews</p>
              </div>
              <div className="mt-4 space-y-1.5">
                {ratingDistribution.map((r) => <RatingBar key={r.stars} stars={r.stars} percent={r.percent} />)}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {mockReviews.map((review, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96E]/10 text-sm font-bold text-[#C9A96E]">{review.name[0]}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{review.name}</span>
                          {review.verified && <span className="ml-2 text-[10px] text-green-500">✓ Verified Purchase</span>}
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{review.date}</p>
                      {review.title && <p className="mt-1 text-sm font-semibold">{review.title}</p>}
                      <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setReviewDialogOpen(true)} className="rounded-full border border-[#C9A96E] px-6 py-2.5 text-sm font-medium text-[#C9A96E] transition hover:bg-[#C9A96E] hover:text-[#0F0F0F]">Write a Review</button>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">{isRTL ? "قد يعجبك أيضاً" : "You Might Also Like"}</h2>
          <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="w-[260px] flex-shrink-0"><ProductCard product={p} /></div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={(e) => { if (e.key === "ArrowLeft") handleLightboxNav(-1); if (e.key === "ArrowRight") handleLightboxNav(1); if (e.key === "Escape") setLightboxOpen(false); }}>
            <div className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center">
              <Image src={product.images[lightboxIndex] || "/placeholder.jpg"} alt={product.name} width={1200} height={1600} className="max-h-[85vh] w-auto rounded-lg object-contain" />
              <Dialog.Close className="absolute -top-10 right-0 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"><X size={20} /></Dialog.Close>
              {product.images.length > 1 && (
                <>
                  <button onClick={() => handleLightboxNav(-1)} className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"><ChevronLeft size={24} /></button>
                  <button onClick={() => handleLightboxNav(1)} className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"><ChevronRight size={24} /></button>
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
            <div className="flex items-center justify-between"><h3 className="text-lg font-bold">Size Guide</h3><Sheet.Close className="rounded-full p-1 transition hover:bg-muted"><X size={20} /></Sheet.Close></div>
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <p>Our sizes follow standard international sizing. Please refer to the chart below for measurements.</p>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/50"><th className="px-3 py-2 text-left font-medium">Size</th><th className="px-3 py-2 text-left font-medium">Chest (in)</th><th className="px-3 py-2 text-left font-medium">Waist (in)</th></tr></thead>
                  <tbody>{[["XS","32-34","24-26"],["S","34-36","26-28"],["M","36-38","28-30"],["L","38-40","30-32"],["XL","40-42","32-34"]].map(([s,c,w]) => (
                    <tr key={s} className="border-b border-border last:border-0"><td className="px-3 py-2 font-medium">{s}</td><td className="px-3 py-2">{c}</td><td className="px-3 py-2">{w}</td></tr>
                  ))}</tbody>
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
            <div className="flex items-center justify-between"><Dialog.Title className="text-lg font-bold">Write a Review</Dialog.Title><Dialog.Close className="rounded-full p-1 transition hover:bg-muted"><X size={20} /></Dialog.Close></div>
            <div className="mt-4 space-y-4">
              <div><label className="mb-1 block text-sm font-medium">Your Rating</label><div className="flex gap-1">{[1,2,3,4,5].map((s) => (
                <button key={s} onClick={() => setReviewRating(s)} className="transition hover:scale-110">
                  <Star size={24} className={s <= reviewRating ? "text-[#C9A96E]" : "text-muted-foreground/30"} fill={s <= reviewRating ? "currentColor" : "none"} />
                </button>
              ))}</div></div>
              <div><label className="mb-1 block text-sm font-medium">Title (optional)</label><input type="text" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" placeholder="Summarize your experience" /></div>
              <div><label className="mb-1 block text-sm font-medium">Your Review</label><textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" placeholder="Share your experience with this product..." /></div>
              <button onClick={() => setReviewDialogOpen(false)} className="w-full rounded-full bg-[#C9A96E] py-3 font-semibold text-[#0F0F0F]">Submit Review</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
