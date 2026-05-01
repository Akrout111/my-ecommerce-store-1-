"use client";

import { useLanguageStore } from "@/store/language-store";

export function useDirection(): {
  isRTL: boolean;
  dir: "rtl" | "ltr";
  align: "left" | "right";
  alignStart: "start" | "end";
} {
  const { isRTL } = useLanguageStore();
  return {
    isRTL,
    dir: isRTL ? "rtl" : "ltr",
    align: isRTL ? "right" : "left",
    alignStart: isRTL ? "end" : "start",
  };
}
