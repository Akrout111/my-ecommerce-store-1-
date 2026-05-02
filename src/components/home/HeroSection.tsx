"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, Users, ChevronDown } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import dynamic from "next/dynamic";
import { useLanguage } from "@/components/ecommerce/language-provider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const HeroCanvas = dynamic(() => import("./HeroCanvas").then((m) => ({ default: m.HeroCanvas })), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HeroSection() {
  const { isRTL } = useLanguage();

  return (
    <section
      className={`relative min-h-screen w-full overflow-hidden bg-[#0F0F0F] ${playfair.variable}`}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(232,160,191,0.05)_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col lg:flex-row">
        {/* Left Column — Content */}
        <motion.div
          className="flex flex-1 flex-col justify-center px-6 py-20 sm:px-12 lg:w-[55%] lg:px-16 xl:px-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#C9A96E]">
              ✦ New Collection — Spring 2026
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            className="mt-8 text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            <motion.span
              className="block"
              initial={{ x: isRTL ? 80 : -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fashion
            </motion.span>
            <motion.span
              className="block text-[#C9A96E]"
              initial={{ x: isRTL ? -80 : 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Reimagined
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-md text-lg text-white/60"
          >
            Your Style. Your Story. Your Persona. Discover curated collections for
            every moment.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.a
              href="/products"
              className="inline-flex items-center rounded-full bg-[#C9A96E] px-8 py-3.5 text-sm font-semibold text-[#0F0F0F]"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(201,169,110,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              Shop Now
            </motion.a>
            <motion.a
              href="/lookbook"
              className="inline-flex items-center rounded-full border-2 border-[#C9A96E] px-8 py-3.5 text-sm font-semibold text-[#C9A96E]"
              whileHover={{
                backgroundColor: "#C9A96E",
                color: "#0F0F0F",
              }}
            >
              View Lookbook
            </motion.a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-6 text-xs text-white/50"
          >
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Free Shipping
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Easy Returns
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              50k+ Customers
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column — 3D Canvas */}
        <div className="relative hidden h-[500px] min-h-[500px] lg:block lg:h-auto lg:w-[45%]">
          <HeroCanvas />
          <div className="pointer-events-none absolute inset-0" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span className="text-xs uppercase tracking-widest text-white/30">
          Scroll
        </span>
        <ChevronDown className="h-6 w-6 text-[#C9A96E]/60" />
      </motion.div>
    </section>
  );
}
