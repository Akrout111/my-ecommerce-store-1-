"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Apple,
} from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";

const categoryData = [
  { key: "catElectronics" as const, icon: Smartphone, color: "bg-emerald-100 text-emerald-600", hoverColor: "hover:bg-emerald-600", iconHover: "group-hover:text-white" },
  { key: "catFashion" as const, icon: Shirt, color: "bg-rose-100 text-rose-600", hoverColor: "hover:bg-rose-500", iconHover: "group-hover:text-white" },
  { key: "catHome" as const, icon: Home, color: "bg-amber-100 text-amber-600", hoverColor: "hover:bg-amber-500", iconHover: "group-hover:text-white" },
  { key: "catBeauty" as const, icon: Sparkles, color: "bg-purple-100 text-purple-600", hoverColor: "hover:bg-purple-500", iconHover: "group-hover:text-white" },
  { key: "catSports" as const, icon: Dumbbell, color: "bg-teal-100 text-teal-600", hoverColor: "hover:bg-teal-500", iconHover: "group-hover:text-white" },
  { key: "catBooks" as const, icon: BookOpen, color: "bg-orange-100 text-orange-600", hoverColor: "hover:bg-orange-500", iconHover: "group-hover:text-white" },
  { key: "catToys" as const, icon: Gamepad2, color: "bg-pink-100 text-pink-600", hoverColor: "hover:bg-pink-500", iconHover: "group-hover:text-white" },
  { key: "catGroceries" as const, icon: Apple, color: "bg-lime-100 text-lime-600", hoverColor: "hover:bg-lime-600", iconHover: "group-hover:text-white" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Categories() {
  const { t, isRTL } = useLanguage();

  return (
    <section id="categories" className="py-12 sm:py-16 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center sm:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {t("categoriesTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-slate-500"
          >
            {t("categoriesSubtitle")}
          </motion.p>
        </div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:gap-6"
        >
          {categoryData.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.key}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group cursor-pointer rounded-xl border border-slate-100 bg-white p-4 sm:p-6 text-center shadow-sm transition-colors duration-300 ${cat.hoverColor}`}
              >
                <div
                  className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 sm:h-16 sm:w-16 ${cat.color} ${cat.iconHover}`}
                >
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 transition-colors duration-300" />
                </div>
                <span className="text-sm font-semibold text-slate-700 transition-colors duration-300 group-hover:text-white sm:text-base">
                  {t(cat.key)}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
