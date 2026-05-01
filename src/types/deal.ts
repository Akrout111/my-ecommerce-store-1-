export interface Deal {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  discountPercentage: number;
  originalPrice: number;
  dealPrice: number;
  currency: string;
  startDate: string;
  endDate: string;
  totalStock: number;
  soldStock: number;
  isActive: boolean;
  isFeatured: boolean;
  badge: string;
  badgeAr: string;
}

export interface FlashDeal extends Deal {
  timeRemaining: number;
  isExpiring: boolean;
}
