"use client";

import { motion } from "framer-motion";
import { Diamond } from "lucide-react";
import { COLORS } from "@/lib/constants";

export function PromoBanner() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#C9A96E]/10 via-[#FAF8F5] to-[#E8A0BF]/10 dark:from-[#C9A96E]/5 dark:via-[#0F0F0F] dark:to-[#E8A0BF]/5" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 start-[10%] opacity-10"
      >
        <Diamond className="h-16 w-16" style={{ color: COLORS.gold }} />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 end-[15%] opacity-10"
      >
        <Diamond className="h-12 w-12" style={{ color: COLORS.rose }} />
      </motion.div>
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 end-[5%] opacity-5"
      >
        <Diamond className="h-24 w-24" style={{ color: COLORS.gold }} />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-sm font-medium tracking-wider uppercase mb-4" style={{ color: COLORS.gold }}>
            Limited Time Offer
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4" style={{ color: COLORS.dark }}>
            Get 30% Off Your First Order
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Sign up today and receive an exclusive discount on your first purchase.
            Use code <span className="font-bold" style={{ color: COLORS.gold }}>PERSONA30</span> at checkout.
          </p>
          <a
            href="#newsletter"
            className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold text-[#0F0F0F] transition-transform hover:scale-105"
            style={{ backgroundColor: COLORS.gold }}
          >
            Claim Your Discount
          </a>
        </motion.div>
      </div>
    </section>
  );
}
