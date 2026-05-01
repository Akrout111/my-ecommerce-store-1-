"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { useLanguageStore } from "@/store/language-store";
import enTranslations from "@/i18n/locales/en/translation.json";
import arTranslations from "@/i18n/locales/ar/translation.json";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return acc;
  }, obj) as string ?? path;
}

const slides = [
  {
    titleKey: "hero.slide1Title",
    subtitleKey: "hero.slide1Subtitle",
    ctaKey: "hero.slide1Cta",
    gradient: "from-emerald-600 to-teal-700",
    emoji: "☀️",
  },
  {
    titleKey: "hero.slide2Title",
    subtitleKey: "hero.slide2Subtitle",
    ctaKey: "hero.slide2Cta",
    gradient: "from-amber-500 to-orange-600",
    emoji: "💻",
  },
  {
    titleKey: "hero.slide3Title",
    subtitleKey: "hero.slide3Subtitle",
    ctaKey: "hero.slide3Cta",
    gradient: "from-teal-500 to-cyan-600",
    emoji: "🚚",
  },
];

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { language, isRTL } = useLanguageStore();
  const translations = language === "ar" ? arTranslations : enTranslations;
  const t = (key: string) => getNestedValue(translations, key);

  const handleApiChange = useCallback((newApi: CarouselApi) => {
    setApi(newApi);
    if (newApi) {
      setCurrent(newApi.selectedScrollSnap());
    }
  }, []);

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative">
      <Carousel
        setApi={handleApiChange}
        opts={{ direction: isRTL ? "rtl" : "ltr", loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div
                className={`relative flex min-h-[320px] items-center sm:min-h-[420px] lg:min-h-[500px] bg-gradient-to-r ${slide.gradient}`}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10" />
                  <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/10" />
                  <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-white/5" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                  <div className="max-w-2xl space-y-4 sm:space-y-6">
                    <span className="text-4xl sm:text-5xl">{slide.emoji}</span>
                    <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight">
                      {t(slide.titleKey)}
                    </h1>
                    <p className="text-base text-white/80 sm:text-lg max-w-lg">
                      {t(slide.subtitleKey)}
                    </p>
                    <Button
                      size="lg"
                      className="bg-white text-emerald-700 hover:bg-white/90 font-semibold px-8"
                    >
                      {t(slide.ctaKey)}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white" />
        <CarouselNext className="right-4 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white" />
      </Carousel>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              current === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
