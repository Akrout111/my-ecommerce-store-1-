"use client";

import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

export default function NotFoundPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full" style={{ backgroundColor: `${COLORS.gold}20` }}>
          <SearchX className="h-12 w-12" style={{ color: COLORS.gold }} />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
        <p className="max-w-md text-muted-foreground">
          {t("common.error")}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <a
          href={`/${language}`}
          className="inline-flex items-center gap-2 h-10 rounded-full px-6 text-sm font-semibold text-[#0F0F0F]"
          style={{ backgroundColor: COLORS.gold }}
        >
          <Home className="h-4 w-4" />
          {t("common.back")}
        </a>
      </motion.div>
    </div>
  );
}
