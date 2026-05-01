"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

const departments = [
  {
    key: "womens",
    title: "Women's Fashion",
    titleAr: "أزياء النساء",
    gradient: "from-[#C9A96E]/20 to-[#E8A0BF]/20",
    border: "border-[#C9A96E]/30",
    accent: COLORS.gold,
  },
  {
    key: "mens",
    title: "Men's Fashion",
    titleAr: "أزياء الرجال",
    gradient: "from-[#0F0F0F]/80 to-[#1A1A1A]/90",
    border: "border-gray-700",
    accent: "#D4B98A",
  },
  {
    key: "kids",
    title: "Kids' Fashion",
    titleAr: "أزياء الأطفال",
    gradient: "from-[#E8A0BF]/20 to-[#F5D5E0]/20",
    border: "border-[#E8A0BF]/30",
    accent: COLORS.rose,
  },
  {
    key: "beauty",
    title: "Beauty & Wellness",
    titleAr: "الجمال والعافية",
    gradient: "from-[#D4B98A]/20 to-[#C9A96E]/20",
    border: "border-[#C9A96E]/30",
    accent: COLORS.gold,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function DepartmentHub() {
  const { t, language } = useLanguage();

  return (
    <section id="departments" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-5 w-5" style={{ color: COLORS.gold }} />
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: COLORS.dark }}>
            {t("departments.title")}
          </h2>
          <Sparkles className="h-5 w-5" style={{ color: COLORS.gold }} />
        </div>
        <p className="text-muted-foreground text-lg">
          {t("departments.subtitle")}
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {departments.map((dept) => (
          <motion.div
            key={dept.key}
            variants={itemVariants}
            className={`relative overflow-hidden rounded-2xl border ${dept.border} bg-gradient-to-br ${dept.gradient} p-6 sm:p-8 cursor-pointer group hover:shadow-xl transition-shadow duration-300`}
          >
            <div className="relative z-10">
              {/* AI Style Pick badge */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-4"
                style={{ backgroundColor: `${dept.accent}20`, color: dept.accent }}
              >
                <Sparkles className="h-3 w-3" />
                {t("departments.aiSuggestion")}
              </div>

              <h3 className="text-xl font-bold mb-2" style={{ color: dept.accent }}>
                {language === "ar" ? dept.titleAr : dept.title}
              </h3>

              <button
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                style={{ color: dept.accent }}
              >
                {t("departments.explore")}
                <span className="rtl:rotate-180">→</span>
              </button>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
