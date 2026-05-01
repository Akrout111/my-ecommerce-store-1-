export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  salePrice?: number;
  brand: string;
  images: string[];
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
