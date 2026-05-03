"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { CountdownTimer } from "@/components/deals/CountdownTimer";
import { ProductCard } from "@/components/products/ProductCard";
import type { Deal } from "@/types/deal";
import { COLORS } from "@/lib/constants";

interface DealsSectionProps {
  deals: Deal[];
}

export function DealsSection({ deals }: DealsSectionProps) {
  const { t } = useLanguage();

  const activeDeals = deals.filter((d) => d.isActive);

  return (
    <section id="deals" className="py-16 lg:py-24 bg-[#0F0F0F] text-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="h-6 w-6 text-[#E8A0BF] animate-pulse" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#C9A96E]">
              {t("deals.title")}
            </h2>
            <Flame className="h-6 w-6 text-[#E8A0BF] animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg">
            {t("deals.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDeals.map((deal, index) => {
            if (!deal.product) return null;
            const product = deal.product;

            const soldPercent = deal.maxQuantity
              ? Math.round((deal.soldCount / deal.maxQuantity) * 100)
              : 0;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="rounded-2xl bg-[#1A1A1A] border border-gray-800 overflow-hidden"
              >
                {/* Countdown */}
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider">
                      {t("deals.endsIn")}
                    </span>
                    {soldPercent > 80 && (
                      <span className="text-xs font-semibold text-[#E8A0BF] animate-pulse">
                        {t("deals.almostGone")}
                      </span>
                    )}
                  </div>
                  <CountdownTimer endDate={deal.endsAt} />
                </div>

                {/* Product */}
                <div className="p-4">
                  <ProductCard product={product} variant="compact" />

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>{t("deals.sold", { percent: soldPercent })}</span>
                      <span>
                        {deal.soldCount}/{deal.maxQuantity}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${soldPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            soldPercent > 80
                              ? "#E53E3E"
                              : soldPercent > 50
                              ? "#E8A0BF"
                              : COLORS.gold,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
