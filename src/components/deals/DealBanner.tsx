"use client";

import { Flame } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

export function DealBanner() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 mb-4">
      <Flame className="h-5 w-5 text-[#E8A0BF] animate-pulse" />
      <h3 className="text-lg font-bold" style={{ color: COLORS.gold }}>
        {t("deals.dealOfTheDay")}
      </h3>
    </div>
  );
}
