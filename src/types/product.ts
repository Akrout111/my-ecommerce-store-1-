export interface Product {
  id: string;
  name: string;
  nameAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  price: number;
  salePrice?: number | null;
  brand: string;
  images: string[];
  category: string;
  subcategory?: string | null;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
