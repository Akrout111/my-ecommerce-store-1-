"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

export function NewsletterSection() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="newsletter" className="py-16 lg:py-24 bg-[#0F0F0F] text-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: COLORS.gold }}>
            {t("newsletter.title")}
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {t("newsletter.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="flex-1 rounded-full border border-gray-700 bg-[#1A1A1A] py-3 px-5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
              required
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-[#0F0F0F] transition-transform hover:scale-105"
              style={{ backgroundColor: COLORS.gold }}
            >
              <Send className="h-4 w-4" />
              {t("newsletter.subscribe")}
            </button>
          </form>

          <AnimatePresence>
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400"
              >
                <CheckCircle className="h-4 w-4" />
                {t("newsletter.success")}
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-red-400"
              >
                <AlertCircle className="h-4 w-4" />
                {t("newsletter.error")}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
