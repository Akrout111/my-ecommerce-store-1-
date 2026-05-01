"use client";

import { useLanguage } from "@/components/ecommerce/language-provider";

export function RTLWrapper({ children }: { children: React.ReactNode }) {
  const { dir } = useLanguage();

  return <div dir={dir}>{children}</div>;
}
