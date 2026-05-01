"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/ecommerce/language-provider";

interface DealProduct {
  id: number;
  nameEn: string;
  nameAr: string;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  soldCount: number;
  totalStock: number;
  color: string;
  icon: string;
}

const dealProducts: DealProduct[] = [
  { id: 1, nameEn: "Wireless Earbuds Pro", nameAr: "سماعات لاسلكية برو", originalPrice: 129.99, discountPercent: 45, rating: 4.5, soldCount: 187, totalStock: 250, color: "bg-emerald-500", icon: "🎧" },
  { id: 2, nameEn: "Smart Fitness Watch", nameAr: "ساعة ذكية للياقة", originalPrice: 249.99, discountPercent: 35, rating: 4.3, soldCount: 142, totalStock: 200, color: "bg-teal-500", icon: "⌚" },
  { id: 3, nameEn: "Bluetooth Speaker", nameAr: "مكبر صوت بلوتوث", originalPrice: 89.99, discountPercent: 50, rating: 4.7, soldCount: 320, totalStock: 400, color: "bg-amber-500", icon: "🔊" },
  { id: 4, nameEn: "USB-C Fast Charger", nameAr: "شاحن سريع USB-C", originalPrice: 49.99, discountPercent: 40, rating: 4.8, soldCount: 410, totalStock: 500, color: "bg-orange-500", icon: "🔌" },
  { id: 5, nameEn: "Laptop Stand Aluminum", nameAr: "حامل لابتوب ألمنيوم", originalPrice: 69.99, discountPercent: 30, rating: 4.4, soldCount: 95, totalStock: 150, color: "bg-rose-500", icon: "💻" },
  { id: 6, nameEn: "Mechanical Keyboard", nameAr: "لوحة مفاتيح ميكانيكية", originalPrice: 159.99, discountPercent: 25, rating: 4.6, soldCount: 78, totalStock: 120, color: "bg-violet-500", icon: "⌨️" },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-lg font-bold text-white sm:h-14 sm:w-14 sm:text-xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] font-medium text-slate-500 sm:text-xs">{label}</span>
    </div>
  );
}

export function DealsSection() {
  const { t, isRTL, language } = useLanguage();
  // Set deal to end in ~2 days
  const endDate = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(23, 59, 59);
    return d;
  }, []);
  const timeLeft = useCountdown(endDate);

  return (
    <section id="deals" className="py-12 sm:py-16 bg-slate-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white"
            >
              <Zap className="h-5 w-5" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {t("flashSale")}
              </h2>
              <p className="text-sm text-slate-500">{t("endsIn")}</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            <CountdownBox value={timeLeft.days} label={t("days")} />
            <span className="text-xl font-bold text-slate-300 mt-[-16px]">:</span>
            <CountdownBox value={timeLeft.hours} label={t("hours")} />
            <span className="text-xl font-bold text-slate-300 mt-[-16px]">:</span>
            <CountdownBox value={timeLeft.minutes} label={t("minutes")} />
            <span className="text-xl font-bold text-slate-300 mt-[-16px]">:</span>
            <CountdownBox value={timeLeft.seconds} label={t("seconds")} />
          </div>
        </div>

        {/* Deal Products - Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {dealProducts.map((product, index) => {
            const discountedPrice = product.originalPrice * (1 - product.discountPercent / 100);
            const soldPercent = (product.soldCount / product.totalStock) * 100;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="min-w-[220px] sm:min-w-[260px] flex-shrink-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Product Image Placeholder */}
                <div className={`relative mb-3 flex h-36 items-center justify-center rounded-lg ${product.color} bg-opacity-10`}>
                  <span className="text-5xl">{product.icon}</span>
                  <Badge className="absolute top-2 left-2 bg-rose-500 text-white border-0 text-xs font-bold">
                    -{product.discountPercent}%
                  </Badge>
                  <button className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Product Info */}
                <h3 className="mb-1 text-sm font-semibold text-slate-800 line-clamp-1">
                  {language === "ar" ? product.nameAr : product.nameEn}
                </h3>

                {/* Rating */}
                <div className="mb-2 flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= Math.floor(product.rating) ? "text-amber-400" : "text-slate-200"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">({product.rating})</span>
                </div>

                {/* Price */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{product.soldCount} {t("itemsSold")}</span>
                    <span className="font-medium text-rose-500">{product.totalStock - product.soldCount} {t("remaining")}</span>
                  </div>
                  <Progress value={soldPercent} className="h-2 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-rose-500" />
                </div>

                {/* Add to Cart */}
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-9">
                  <ShoppingCart className="h-4 w-4" />
                  {t("addToCart")}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
