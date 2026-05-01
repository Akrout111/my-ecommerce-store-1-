"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { CountdownTimer } from "@/components/deals/CountdownTimer";
import type { Deal } from "@/types/deal";
import { sampleProducts } from "@/lib/sample-data";
import { COLORS } from "@/lib/constants";
import { useLanguage } from "@/components/ecommerce/language-provider";

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const { t, formatCurrency } = useLanguage();
  const product = sampleProducts.find((p) => p.id === deal.productId);
  if (!product) return null;

  const soldPercent = deal.maxQuantity
    ? Math.round((deal.soldCount / deal.maxQuantity) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-[#E8A0BF]" />
          <span className="text-sm font-semibold">{deal.title}</span>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ backgroundColor: `${COLORS.rose}20`, color: COLORS.rose }}>
          -{deal.discountPercent}%
        </span>
      </div>
      <div className="p-4">
        <CountdownTimer endDate={deal.endsAt} />
      </div>
    </motion.div>
  );
}
