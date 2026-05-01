"use client";

import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function ProductGrid({ products, onQuickView }: ProductGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </motion.div>
  );
}
