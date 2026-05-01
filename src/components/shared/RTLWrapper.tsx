"use client";

import { useLanguageStore } from "@/store/language-store";

interface RTLWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function RTLWrapper({ children, className }: RTLWrapperProps) {
  const { isRTL } = useLanguageStore();

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={className}>
      {children}
    </div>
  );
}
