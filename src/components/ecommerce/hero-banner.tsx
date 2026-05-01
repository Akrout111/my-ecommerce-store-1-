"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLanguage } from "@/components/ecommerce/language-provider";

const heroSlides = [
  {
    titleKey: "heroTitle1" as const,
    subtitleKey: "heroSubtitle1" as const,
    ctaKey: "heroCta1" as const,
    icon: Sparkles,
    bgGradient: "from-emerald-600 via-emerald-500 to-teal-400",
    accent: "bg-amber-400",
    pattern: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
  },
  {
    titleKey: "heroTitle2" as const,
    subtitleKey: "heroSubtitle2" as const,
    ctaKey: "heroCta2" as const,
    icon: Zap,
    bgGradient: "from-amber-500 via-orange-500 to-rose-500",
    accent: "bg-white",
    pattern: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
  },
  {
    titleKey: "heroTitle3" as const,
    subtitleKey: "heroSubtitle3" as const,
    ctaKey: "heroCta3" as const,
    icon: Truck,
    bgGradient: "from-teal-600 via-emerald-500 to-green-400",
    accent: "bg-amber-300",
    pattern: "radial-gradient(circle at 50% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
  },
];

export function HeroBanner() {
  const { t, isRTL } = useLanguage();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const handleApiInit = useCallback((carouselApi: CarouselApi) => {
    setApi(carouselApi);
  }, []);

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", handleSelect);
    // Initialize current after mounting via event
    api.on("init", handleSelect);
    return () => {
      api.off("select", handleSelect);
      api.off("init", handleSelect);
    };
  }, [api]);

  // Auto-rotate
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <Carousel
        setApi={handleApiInit}
        opts={{
          direction: isRTL ? "rtl" : "ltr",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <CarouselItem key={index}>
                <div
                  className={`relative min-h-[320px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[520px] bg-gradient-to-br ${slide.bgGradient} flex items-center`}
                  style={{ backgroundImage: slide.pattern }}
                >
                  {/* Decorative circles */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
                    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5" />
                  </div>

                  <div className="relative mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
                      <AnimatePresence mode="wait">
                        {current === index && (
                          <motion.div
                            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
                            transition={{ duration: 0.5 }}
                            className="text-white"
                          >
                            <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                              {t(slide.titleKey)}
                            </h1>
                            <p className="mb-6 max-w-lg text-base text-white/90 sm:text-lg">
                              {t(slide.subtitleKey)}
                            </p>
                            <Button
                              size="lg"
                              className={`${slide.accent} font-bold text-slate-900 hover:opacity-90 shadow-lg ${isRTL ? "text-lg" : ""}`}
                            >
                              {t(slide.ctaKey)}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden md:flex items-center justify-center"
                      >
                        <div className="relative">
                          <div className="h-56 w-56 lg:h-72 lg:w-72 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <Icon className="h-24 w-24 lg:h-32 lg:w-32 text-white/90" />
                          </div>
                          {/* Floating dots */}
                          <div className="absolute -top-2 right-8 h-4 w-4 rounded-full bg-amber-400 animate-bounce" />
                          <div className="absolute bottom-8 -left-4 h-3 w-3 rounded-full bg-white/60 animate-pulse" />
                          <div className="absolute top-1/2 -right-6 h-5 w-5 rounded-full bg-white/30 animate-pulse" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Custom Navigation Arrows */}
        <CarouselPrevious className="left-4 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm lg:-left-6" />
        <CarouselNext className="right-4 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm lg:-right-6" />
      </Carousel>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
