// App Constants

export const APP_NAME = "ShopZone";
export const APP_DESCRIPTION = "Your one-stop e-commerce destination for quality products at unbeatable prices";
export const APP_URL = "https://shopzone.com";

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

// Theme Colors
export const COLORS = {
  primary: "emerald",
  accent: "amber",
  danger: "rose",
  info: "teal",
  success: "green",
  warning: "orange",
} as const;

// Locale
export const LOCALES = ["en", "ar"] as const;
export const DEFAULT_LOCALE = "en";

// Shipping
export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING_COST = 5.99;

// Tax
export const TAX_RATE = 0.08;
