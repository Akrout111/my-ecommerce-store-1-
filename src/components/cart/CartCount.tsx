"use client";

import { useCartStore } from "@/store/cart-store";
import { Badge } from "@/components/ui/badge";

export function CartCount() {
  const itemCount = useCartStore((s) => s.itemCount);

  if (itemCount <= 0) return null;

  return (
    <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 p-0 text-[10px] font-bold text-white">
      {itemCount > 99 ? "99+" : itemCount}
    </Badge>
  );
}
