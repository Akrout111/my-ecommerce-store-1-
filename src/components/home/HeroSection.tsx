"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

const slides = [
  {
    bgGradient: "from-[#FAF8F5] via-[#F5EFE6] to-[#E8DCC8]",
    darkGradient: "from-[#0F0F0F] via-[#1A1510] to-[#2A2015]",
    titleKey: "hero.title",
    subtitleKey: "hero.subtitle",
    ctaKey: "hero.cta",
    secondaryCtaKey: "hero.secondaryCta",
    accent: COLORS.gold,
  },
  {
    bgGradient: "from-[#1A1510] via-[#0F0F0F] to-[#1A1A1A]",
    darkGradient: "from-[#1A1510] via-[#0F0F0F] to-[#1A1A1A]",
    titleKey: "nav.men",
    subtitleKey: "hero.subtitle",
    ctaKey: "hero.cta",
    secondaryCtaKey: "hero.secondaryCta",
    accent: COLORS.gold,
    customTitle: "Men's Collection",
    customTitleAr: "مجموعة الرجال",
  },
  {
    bgGradient: "from-[#2A1525] via-[#1A0F1A] to-[#0F0F0F]",
    darkGradient: "from-[#2A1525] via-[#1A0F1A] to-[#0F0F0F]",
    titleKey: "nav.sale",
    subtitleKey: "hero.subtitle",
    ctaKey: "hero.cta",
    secondaryCtaKey: "hero.secondaryCta",
    accent: COLORS.rose,
    customTitle: "Sale — Up to 50% Off",
    customTitleAr: "تخفيضات — حتى 50%",
  },
];

export function HeroSection() {
  const { t, isRTL, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden" aria-label="Hero banner">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center bg-gradient-to-br ${slide.bgGradient} dark:${slide.darkGradient}`}
        >
          {/* Parallax decorative elements */}
          <motion.div
            style={{ y: scrollY * 0.3 }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div
              className="absolute top-20 end-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: slide.accent }}
            />
            <div
              className="absolute bottom-20 start-20 w-96 h-96 rounded-full opacity-5 blur-3xl"
              style={{ backgroundColor: slide.accent }}
            />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              style={{ color: slide.accent }}
            >
              {slide.customTitle
                ? language === "ar"
                  ? slide.customTitleAr
                  : slide.customTitle
                : t(slide.titleKey)}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto"
            >
              {t(slide.subtitleKey)}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="#featured"
                className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold text-[#0F0F0F] transition-transform hover:scale-105"
                style={{ backgroundColor: slide.accent }}
              >
                {t(slide.ctaKey)}
              </a>
              <a
                href="#categories"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-current px-8 text-sm font-semibold transition-transform hover:scale-105"
                style={{ color: slide.accent, borderColor: slide.accent }}
              >
                {t(slide.secondaryCtaKey)}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute start-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute end-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? "w-8" : "w-2"
            }`}
            style={{
              backgroundColor: idx === currentSlide ? slide.accent : "rgba(255,255,255,0.4)",
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
