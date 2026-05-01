"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId: string) => {
        const { items } = get();
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },

      removeItem: (productId: string) => {
        const { items } = get();
        set({ items: items.filter((id) => id !== productId) });
      },

      toggleItem: (productId: string) => {
        const { items } = get();
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
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
    }),
    {
      name: "persona-wishlist",
    }
  )
);
