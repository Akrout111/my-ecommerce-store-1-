import type { Product } from "./product";

export interface Deal {
  id: string;
  productId: string;
  product?: Product;
  title: string;
  titleAr?: string;
  discountPercent: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  maxQuantity?: number;
  soldCount: number;
  createdAt: string;
}
