"use client";

import { ShoppingBag, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProductPrice } from "@/components/products/ProductPrice";
import type { Deal } from "@/types/deal";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";
import { cn } from "@/lib/utils";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface DealCardProps {
  deal: Deal;
  className?: string;
}

export function DealCard({ deal, className }: DealCardProps) {
  const { language } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const title = language === "ar" ? deal.titleAr : deal.title;
  const badge = language === "ar" ? deal.badgeAr : deal.badge;
  const stockPercentage = (deal.soldStock / deal.totalStock) * 100;
  const remaining = deal.totalStock - deal.soldStock;

  return (
    <Card className={cn("overflow-hidden border transition-shadow hover:shadow-md", className)}>
      {/* Image Placeholder */}
      <div className="relative aspect-square bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center">
        <ShoppingBag className="h-12 w-12 text-white/30" />

        {/* Discount Badge */}
        <div className="absolute top-2 left-2 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white">
          -{deal.discountPercentage}%
        </div>

        {badge && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white">
            <Flame className="h-3 w-3" />
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{title}</h3>

        <ProductPrice
          price={deal.dealPrice}
          originalPrice={deal.originalPrice}
          size="sm"
        />

        {/* Stock Progress */}
        <div className="space-y-1">
          <Progress value={stockPercentage} className="h-2 bg-rose-100 [&>[data-slot=progress-indicator]]:bg-rose-500" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {deal.soldStock} {t("deals.itemsSold")}
            </span>
            <span className="font-medium text-rose-500">
              {remaining} {t("deals.remaining")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
