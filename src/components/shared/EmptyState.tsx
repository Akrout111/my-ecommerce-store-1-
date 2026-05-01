"use client";

import { Diamond } from "lucide-react";
import { COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <Diamond className="h-16 w-16 text-muted-foreground/20 mb-4" style={{ color: `${COLORS.gold}40` }} />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-[#0F0F0F]"
          style={{ backgroundColor: COLORS.gold }}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
