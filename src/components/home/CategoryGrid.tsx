"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";
import Link from "next/link";

const categories = [
  {
    key: "women",
    gradient: "from-[#C9A96E]/80 to-[#8B6914]/90",
    icon: "👗",
    size: "lg",
  },
  {
    key: "men",
    gradient: "from-[#2C2C2C]/80 to-[#0F0F0F]/90",
    icon: "🧥",
    size: "wide",
  },
  {
    key: "kids",
    gradient: "from-[#E8A0BF]/70 to-[#B8709F]/90",
    icon: "🧒",
    size: "normal",
  },
  {
    key: "accessories",
    gradient: "from-[#D4B98A]/80 to-[#A08050]/90",
    icon: "💍",
    size: "normal",
  },
  {
    key: "shoes",
    gradient: "from-[#1A1A2E]/80 to-[#0F0F0F]/90",
    icon: "👠",
    size: "normal",
  },
  {
    key: "beauty",
    gradient: "from-[#F5D5E0]/60 to-[#E8A0BF]/80",
    icon: "✨",
    size: "normal",
  },
  {
    key: "sportswear",
    gradient: "from-[#2D5A27]/80 to-[#1A3A15]/90",
    icon: "🏃",
    size: "normal",
  },
  {
    key: "luxury",
    gradient: "from-[#C9A96E]/90 to-[#8B6914]/95",
    icon: "💎",
    size: "wide",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: COLORS.dark }}>
          {t("categories.title")}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t("categories.subtitle")}
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="bento-grid"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.key}
            variants={itemVariants}
            className={`${cat.size === "lg" ? "bento-lg" : cat.size === "wide" ? "bento-wide" : ""} group relative overflow-hidden rounded-2xl cursor-pointer`}
          >
            <Link href={`/#${cat.key}`} className="block h-full">
              <div
                className={`relative bg-gradient-to-br ${cat.gradient} flex items-end justify-start p-6 sm:p-8 min-h-[180px] sm:min-h-[220px]`}
              >
                {/* Background icon */}
                <span className="absolute top-4 end-4 text-5xl sm:text-7xl opacity-30 group-hover:scale-110 transition-transform duration-500">
                  {cat.icon}
                </span>

                {/* Hover zoom overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                {/* Text */}
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
                    {t(`categories.${cat.key}`)}
                  </h3>
                  <div
                    className="mt-2 h-0.5 w-0 group-hover:w-12 transition-all duration-500"
                    style={{ backgroundColor: COLORS.gold }}
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
