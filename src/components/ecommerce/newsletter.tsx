"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/ecommerce/language-provider";

export function Newsletter() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-10 lg:p-14"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-500/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/5" />
          </div>

          <div className="relative flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.1 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20"
            >
              <Mail className="h-8 w-8 text-emerald-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-3 text-2xl font-bold text-white sm:text-3xl"
            >
              {t("newsletterTitle")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-8 max-w-xl text-sm text-slate-400 sm:text-base"
            >
              {t("newsletterSubtitle")}
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder={t("newsletterPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${isRTL ? "text-right" : "text-left"} h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20`}
              />
              <Button
                type="submit"
                className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shrink-0 gap-2"
              >
                {subscribed ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    ✓
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("newsletterButton")}
                  </>
                )}
              </Button>
            </motion.form>

            <p className="mt-3 text-xs text-slate-500">
              {t("newsletterPrivacy")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
