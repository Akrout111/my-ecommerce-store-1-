import type { Product } from "./product";

export interface Deal {
  id: string;
  productId: string;
  product?: Product;
  title: string;
  titleAr?: string | null;
  discountPercent: number;
  startsAt: string | Date;
  endsAt: string | Date;
  isActive: boolean;
  maxQuantity?: number | null;
  soldCount: number;
  createdAt: string | Date;
}
