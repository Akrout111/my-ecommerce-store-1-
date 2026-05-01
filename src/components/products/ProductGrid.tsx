"use client";

import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  onQuickView?: (product: Product) => void;
  className?: string;
}

const columnClasses: Record<number, string> = {
  2: "grid-cols-2 md:grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function ProductGrid({
  products,
  columns = 4,
  onQuickView,
  className,
}: ProductGridProps) {
  return (
    <div className={cn("grid gap-4", columnClasses[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
