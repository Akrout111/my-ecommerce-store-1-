"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;

  // Computed
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

function calculateTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, shipping, tax, discount, total, itemCount };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,

      addItem: (item: CartItem) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = items.map((i, idx) =>
            idx === existingIndex
              ? { ...i, quantity: i.quantity + item.quantity, totalPrice: (i.quantity + item.quantity) * i.price }
              : i
          );
        } else {
          newItems = [...items, item];
        }

        const totals = calculateTotals(newItems);
        set({ items: newItems, ...totals });
      },

      removeItem: (itemId: string) => {
        const newItems = get().items.filter((i) => i.id !== itemId);
        const totals = calculateTotals(newItems);
        set({ items: newItems, ...totals });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const newItems = get().items.map((i) =>
          i.id === itemId ? { ...i, quantity, totalPrice: quantity * i.price } : i
        );
        const totals = calculateTotals(newItems);
        set({ items: newItems, ...totals });
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          discount: 0,
          total: 0,
          couponCode: null,
        });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyCoupon: (code: string) => set({ couponCode: code }),
      removeCoupon: () => set({ couponCode: null }),
    }),
    {
      name: "persona-cart",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
      }),
    }
  )
);
