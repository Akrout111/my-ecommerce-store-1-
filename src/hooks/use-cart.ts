"use client";

import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

export function useCart() {
  const {
    items,
    isOpen,
    itemCount,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    couponCode,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const addProduct = (product: Product, quantity: number = 1, variant?: string) => {
    const cartItem: CartItem = {
      id: `${product.id}-${variant ?? "default"}`,
      productId: product.id,
      product,
      quantity,
      selectedVariant: variant,
      price: product.price,
      totalPrice: product.price * quantity,
    };
    addItem(cartItem);
    openCart();
  };

  return {
    items,
    isOpen,
    itemCount,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    couponCode,
    addProduct,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    applyCoupon,
    removeCoupon,
  };
}
