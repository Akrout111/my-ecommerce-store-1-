import { z } from 'zod';

export const ProductCreateInput = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  price: z.number().positive(),
  compareAtPrice: z.number().optional(),
  category: z.string(),
  images: z.array(z.string().url()).min(1).max(10),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  tags: z.array(z.string()),
  stock: z.int().min(0),
  featured: z.boolean(),
  isNew: z.boolean(),
  brand: z.string().min(1),
  nameAr: z.string().optional(),
  descriptionAr: z.string().optional(),
  subcategory: z.string().optional(),
  isBestSeller: z.boolean().optional(),
  salePrice: z.number().optional(),
  rating: z.number().optional(),
  reviewCount: z.int().optional(),
  inStock: z.boolean().optional(),
  stockCount: z.int().optional(),
});

export const ProductUpdateInput = ProductCreateInput.partial();

export const OrderStatusUpdateInput = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
});
