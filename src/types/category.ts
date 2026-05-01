export interface SubCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  parentId: string;
  productCount: number;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  image: string;
  icon: string;
  productCount: number;
  subcategories: SubCategory[];
  isFeatured: boolean;
  displayOrder: number;
}
