"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/ecommerce/language-provider";

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  category: string;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  badge?: "bestSeller" | "new" | null;
  color: string;
  icon: string;
}

const products: Product[] = [
  { id: 1, nameEn: "Wireless Noise-Canceling Headphones", nameAr: "سماعات لاسلكية عازلة للضوضاء", category: "Electronics", originalPrice: 299.99, discountPercent: 25, rating: 4.8, reviewCount: 2340, badge: "bestSeller", color: "bg-emerald-100", icon: "🎧" },
  { id: 2, nameEn: "Premium Leather Jacket", nameAr: "سترة جلد فاخرة", category: "Fashion", originalPrice: 189.99, discountPercent: 15, rating: 4.5, reviewCount: 876, badge: "new", color: "bg-amber-100", icon: "🧥" },
  { id: 3, nameEn: "Smart Home Hub Pro", nameAr: "مركز المنزل الذكي برو", category: "Electronics", originalPrice: 149.99, discountPercent: 30, rating: 4.6, reviewCount: 1234, badge: "bestSeller", color: "bg-teal-100", icon: "🏠" },
  { id: 4, nameEn: "Organic Face Serum", nameAr: "سيروم وجه عضوي", category: "Beauty", originalPrice: 45.99, discountPercent: 20, rating: 4.9, reviewCount: 3421, badge: "bestSeller", color: "bg-rose-100", icon: "✨" },
  { id: 5, nameEn: "Yoga Mat Premium", nameAr: "سجادة يوغا فاخرة", category: "Sports", originalPrice: 59.99, discountPercent: 10, rating: 4.3, reviewCount: 567, color: "bg-purple-100", icon: "🧘" },
  { id: 6, nameEn: "Ceramic Cookware Set", nameAr: "طقم أواني سيراميك", category: "Home", originalPrice: 199.99, discountPercent: 35, rating: 4.7, reviewCount: 1890, badge: "new", color: "bg-orange-100", icon: "🍳" },
  { id: 7, nameEn: "4K Action Camera", nameAr: "كاميرا أكشن 4K", category: "Electronics", originalPrice: 349.99, discountPercent: 20, rating: 4.4, reviewCount: 923, color: "bg-cyan-100", icon: "📷" },
  { id: 8, nameEn: "Cashmere Sweater", nameAr: "كنزة كشمير", category: "Fashion", originalPrice: 129.99, discountPercent: 25, rating: 4.6, reviewCount: 654, badge: "new", color: "bg-pink-100", icon: "👕" },
  { id: 9, nameEn: "Electric Standing Desk", nameAr: "مكتب قائم كهربائي", category: "Home", originalPrice: 449.99, discountPercent: 15, rating: 4.8, reviewCount: 2100, badge: "bestSeller", color: "bg-lime-100", icon: "🖥️" },
  { id: 10, nameEn: "Running Shoes Ultra", nameAr: "حذاء جري ألترا", category: "Sports", originalPrice: 139.99, discountPercent: 20, rating: 4.5, reviewCount: 1567, color: "bg-sky-100", icon: "👟" },
  { id: 11, nameEn: "Vitamin C Skincare Kit", nameAr: "طقم عناية بفيتامين سي", category: "Beauty", originalPrice: 79.99, discountPercent: 30, rating: 4.7, reviewCount: 2890, badge: "bestSeller", color: "bg-yellow-100", icon: "🍊" },
  { id: 12, nameEn: "Smart LED Light Strip", nameAr: "شريط إضاءة LED ذكي", category: "Electronics", originalPrice: 39.99, discountPercent: 40, rating: 4.2, reviewCount: 4560, badge: "new", color: "bg-indigo-100", icon: "💡" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProductGrid() {
  const { t, isRTL, language } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {language === "ar" ? "منتجات مميزة" : "Featured Products"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-slate-500"
          >
            {language === "ar" ? "اختر من أفضل منتجاتنا المختارة بعناية" : "Handpicked quality products just for you"}
          </motion.p>
        </div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          {products.map((product) => {
            const discountedPrice = product.originalPrice * (1 - product.discountPercent / 100);

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group relative rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg overflow-hidden"
              >
                {/* Product Image Placeholder */}
                <div className={`relative flex h-40 items-center justify-center sm:h-48 ${product.color}`}>
                  <span className="text-5xl sm:text-6xl transition-transform duration-300 group-hover:scale-110">
                    {product.icon}
                  </span>

                  {/* Badge */}
                  {product.badge && (
                    <Badge
                      className={`absolute top-2 ${
                        isRTL ? "right-2" : "left-2"
                      } border-0 text-xs font-bold ${
                        product.badge === "bestSeller"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {product.badge === "bestSeller" ? t("bestSeller") : t("new")}
                    </Badge>
                  )}

                  {/* Discount Badge */}
                  {product.discountPercent > 0 && (
                    <Badge
                      className={`absolute top-2 ${
                        isRTL ? "left-2" : "right-2"
                      } bg-rose-500 text-white border-0 text-xs font-bold`}
                    >
                      -{product.discountPercent}% {t("off")}
                    </Badge>
                  )}

                  {/* Wishlist */}
                  <button
                    className={`absolute bottom-2 ${
                      isRTL ? "left-2" : "right-2"
                    } rounded-full bg-white/80 p-1.5 text-slate-400 opacity-0 transition-all hover:text-rose-500 group-hover:opacity-100`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="mb-1 text-sm font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem]">
                    {language === "ar" ? product.nameAr : product.nameEn}
                  </h3>

                  {/* Category */}
                  <p className="mb-2 text-xs text-slate-400">{product.category}</p>

                  {/* Rating */}
                  <div className="mb-2 flex items-center gap-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= Math.floor(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">({product.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-base font-bold text-emerald-600 sm:text-lg">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {product.discountPercent > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm h-8 sm:h-9 gap-1.5">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {t("addToCart")}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
