"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import { useLanguageStore } from "@/store/language-store";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

const categoryGradients: Record<string, string> = {
  electronics: "from-cyan-500 to-teal-600",
  fashion: "from-pink-500 to-rose-600",
  home: "from-amber-500 to-orange-600",
  beauty: "from-purple-500 to-fuchsia-600",
  sports: "from-emerald-500 to-green-600",
  books: "from-yellow-500 to-amber-600",
  toys: "from-red-500 to-pink-600",
  groceries: "from-lime-500 to-green-600",
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  const { language } = useLanguageStore();
  const name = language === "ar" ? category.nameAr : category.name;
  const gradient = categoryGradients[category.slug] ?? "from-emerald-500 to-teal-600";

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
      <Card className={cn(
        "group relative overflow-hidden cursor-pointer border-0",
        className
      )}>
        <div className={cn("aspect-[4/3] bg-gradient-to-br flex flex-col items-center justify-center gap-2 p-4 text-white", gradient)}>
          <span className="text-3xl">{category.icon || "📦"}</span>
          <h3 className="text-sm font-semibold text-center">{name}</h3>
          <span className="text-xs text-white/70">{category.productCount} items</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
      </Card>
    </motion.div>
  );
}
