"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/ecommerce/language-provider";

export function PromoBanner() {
  const { t, isRTL, language } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-slate-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 shadow-xl"
        >
          <div className="grid grid-cols-1 items-center md:grid-cols-2">
            {/* Text Content */}
            <div className="p-8 sm:p-10 lg:p-12">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  <Gift className="h-4 w-4" />
                  {language === "ar" ? "عرض محدود" : "Limited Offer"}
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {t("promoTitle")}
                </h2>
                <p className="mb-6 text-white/90 text-sm sm:text-base max-w-md">
                  {t("promoSubtitle")}
                </p>
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 font-bold hover:bg-white/90 shadow-lg gap-2"
                >
                  {t("promoCta")}
                  {isRTL ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Visual Content */}
            <div className="relative hidden items-center justify-center p-12 md:flex">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="relative"
              >
                {/* Background circle */}
                <div className="h-56 w-56 lg:h-72 lg:w-72 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                  <Gift className="h-24 w-24 lg:h-32 lg:w-32 text-white/90" />
                </div>
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -top-4 right-4 h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                >
                  30%
                </motion.div>
                <motion.div
                  animate={{ y: [8, -8, 8] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full bg-white/30 backdrop-blur-sm"
                />
                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-1/2 -right-8 h-6 w-6 rounded-full bg-rose-400"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

