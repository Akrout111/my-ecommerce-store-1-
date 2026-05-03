"use client";

import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

// Re-export
export { ProductCard };

export function ProductImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((img, idx) => (
        <div key={idx} className="aspect-square rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export function ProductQuickView({
  product,
  open: _open,
  onOpenChange: _onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!product) return null;
  
  return null; // Placeholder - quick view is handled inline
}
