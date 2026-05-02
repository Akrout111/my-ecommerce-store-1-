import type { Product } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  name: string;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  itemCount: number;
  couponCode?: string;
}
