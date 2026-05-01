export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  image: string;
  description?: string;
  descriptionAr?: string;
  order: number;
  isActive: boolean;
}
