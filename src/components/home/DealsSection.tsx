"use client";

import { useRef } from "react";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DealCard } from "@/components/deals/DealCard";
import { CountdownTimer } from "@/components/deals/CountdownTimer";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import type { Deal } from "@/types/deal";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

interface DealsSectionProps {
  deals: Deal[];
}

export function DealsSection({ deals }: DealsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Use first deal's end date for the countdown
  const dealEndDate = deals.length > 0 ? deals[0].endDate : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <section id="deals" className="py-12 sm:py-16 bg-rose-50/50 dark:bg-rose-950/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                <Flame className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {t("deals.flashSale")}
                </h2>
                <p className="text-sm text-muted-foreground">{t("deals.endsIn")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CountdownTimer targetDate={dealEndDate} />
              <div className="hidden sm:flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => scroll(isRTL ? "right" : "left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => scroll(isRTL ? "left" : "right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <ScrollArea className="w-full" ref={scrollRef}>
          <div className="flex gap-4 pb-4">
            {deals.map((deal) => (
              <div key={deal.id} className="w-[220px] shrink-0 sm:w-[260px]">
                <DealCard deal={deal} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
