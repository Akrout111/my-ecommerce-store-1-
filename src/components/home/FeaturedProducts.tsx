"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";
import { COLORS } from "@/lib/constants";

interface FeaturedProductsProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export function FeaturedProducts({ products, onQuickView }: FeaturedProductsProps) {
  const { t } = useLanguage();

  return (
    <section id="featured" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: COLORS.dark }}>
            {t("products.featured")}
          </h2>
        </div>
        <a
          href="#"
          className="text-sm font-medium hover:underline"
          style={{ color: COLORS.gold }}
        >
          {t("common.viewAll")} →
        </a>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </motion.div>
    </section>
  );
}
