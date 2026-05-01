"use client";

import { motion } from "framer-motion";

type BadgeType = "SALE" | "NEW" | "HOT" | "LIMITED" | "EXCLUSIVE" | "LOW_STOCK";

interface ProductBadgeProps {
  type: BadgeType;
  text?: string;
}

const badgeStyles: Record<BadgeType, { bg: string; text: string; pulse: boolean }> = {
  SALE: { bg: "#E8A0BF", text: "#FFFFFF", pulse: false },
  NEW: { bg: "#C9A96E", text: "#0F0F0F", pulse: false },
  HOT: { bg: "#DC2626", text: "#FFFFFF", pulse: true },
  LIMITED: { bg: "#EA580C", text: "#FFFFFF", pulse: false },
  EXCLUSIVE: { bg: "#7C3AED", text: "#FFFFFF", pulse: false },
  LOW_STOCK: { bg: "#D97706", text: "#FFFFFF", pulse: false },
};

const defaultLabels: Record<BadgeType, string> = {
  SALE: "SALE",
  NEW: "NEW",
  HOT: "HOT",
  LIMITED: "LIMITED",
  EXCLUSIVE: "EXCLUSIVE",
  LOW_STOCK: "LOW STOCK",
};

export function ProductBadge({ type, text }: ProductBadgeProps) {
  const style = badgeStyles[type];
  const label = text || defaultLabels[type];

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        style.pulse ? "animate-pulse" : ""
      }`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {label}
    </motion.span>
  );
}
