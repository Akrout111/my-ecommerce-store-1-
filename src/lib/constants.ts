// App Constants

export const APP_NAME = "Persona";
export const APP_DESCRIPTION = "Fashion Reimagined — Your Style. Your Story. Your Persona.";
export const APP_URL = "https://persona.fashion";

// Currency
export const DEFAULT_CURRENCY = "USD";
export const CURRENCY_SYMBOL = "$";

// API Routes
export const API_ROUTES = {
  products: "/api/products",
  categories: "/api/categories",
  deals: "/api/deals",
  cart: "/api/cart",
  auth: "/api/auth",
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const CATEGORIES_PER_ROW = 4;

// Theme Colors — Persona Brand Palette
export const COLORS = {
  gold: "#C9A96E",
  rose: "#E8A0BF",
  dark: "#0F0F0F",
  cream: "#FAF8F5",
} as const;

// Locale
export const LOCALES = ["en", "ar"] as const;
export const DEFAULT_LOCALE = "en";

// Shipping
export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING_COST = 5.99;

// Tax
export const TAX_RATE = 0.08;

// Navigation categories with subcategories
export const NAV_CATEGORIES = [
  {
    key: "women",
    subcategories: ["Dresses", "Tops", "Jeans", "Activewear", "Lingerie"],
    subcategoriesAr: ["فساتين", "بلوزات", "جينز", "ملابس رياضية", "ملابس داخلية"],
  },
  {
    key: "men",
    subcategories: ["Shirts", "Pants", "Suits", "Activewear", "Underwear"],
    subcategoriesAr: ["قمصان", "بنطلونات", "بدلات", "ملابس رياضية", "ملابس داخلية"],
  },
  {
    key: "kids",
    subcategories: ["Girls", "Boys", "Baby", "School Wear"],
    subcategoriesAr: ["بنات", "أولاد", "أطفال", "ملابس مدرسية"],
  },
  {
    key: "accessories",
    subcategories: ["Bags", "Jewelry", "Watches", "Sunglasses"],
    subcategoriesAr: ["حقائب", "مجوهرات", "ساعات", "نظارات شمسية"],
  },
  {
    key: "shoes",
    subcategories: ["Heels", "Sneakers", "Boots", "Sandals"],
    subcategoriesAr: ["كعب عالي", "سنيكرز", "أحذية", "صنادل"],
  },
  {
    key: "beauty",
    subcategories: ["Skincare", "Makeup", "Fragrance", "Hair"],
    subcategoriesAr: ["العناية بالبشرة", "مكياج", "عطور", "شعر"],
  },
] as const;
