"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/wishlist-store";

export function useWishlistSync() {
  const { data: session, status } = useSession();
  const { syncWithServer, isSynced } = useWishlistStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && !isSynced) {
      fetch("/api/wishlist")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch wishlist");
          return res.json();
        })
        .then((data) => {
          if (data.data?.productIds) {
            syncWithServer(data.data.productIds);
          }
        })
        .catch(() => {
          // Silently fail — localStorage is the fallback
        });
    }
  }, [status, session, syncWithServer, isSynced]);
}
