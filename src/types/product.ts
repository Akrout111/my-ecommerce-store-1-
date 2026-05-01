export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  stock: number;
  priceAdjustment: number;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  images: ProductImage[];
  variants: ProductVariant[];
  categoryId: string;
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
