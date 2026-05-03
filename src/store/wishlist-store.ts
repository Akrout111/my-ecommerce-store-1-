"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  isSynced: boolean;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
  clearWishlist: () => void;
  syncWithServer: (serverItems: string[]) => void;
  setItems: (items: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isSynced: false,

      addItem: (productId: string) => {
        const { items } = get();
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
          // Sync with server if user is authenticated
          fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          }).catch(() => {
            // Silently fail — localStorage is the fallback
          });
        }
      },

      removeItem: (productId: string) => {
        const { items } = get();
        set({ items: items.filter((id) => id !== productId) });
        // Sync with server
        fetch(`/api/wishlist/${productId}`, {
          method: "DELETE",
        }).catch(() => {
          // Silently fail — localStorage is the fallback
        });
      },

      toggleItem: (productId: string) => {
        const { items } = get();
        if (items.includes(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.includes(productId);
      },

      get itemCount() {
        return get().items.length;
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      syncWithServer: (serverItems: string[]) => {
        const { items: localItems } = get();
        // Merge: union of local and server items
        const merged = Array.from(new Set([...localItems, ...serverItems]));
        set({ items: merged, isSynced: true });

        // Push any local-only items to server
        const localOnly = localItems.filter((id) => !serverItems.includes(id));
        localOnly.forEach((productId) => {
          fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          }).catch(() => {
            // Silently fail
          });
        });
      },

      setItems: (items: string[]) => {
        set({ items, isSynced: true });
      },
    }),
    {
      name: "persona-wishlist",
    }
  )
);
