/**
 * @fileOverview Application-wide types and deterministic mock data.
 * Updated to support multiple images and consistent category mapping.
 */

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string;
  slug?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: 'Active' | 'Inactive';
  createdAt?: any;
  updatedAt?: any;
}

export interface Product {
  id: string;
  name: string;
  slug?: string; // New field for dynamic routing
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string; // Main featured image
  images: string[]; // Gallery images
  videoUrl?: string; // Product Reel or Demo Video
  imageHint?: string;
  categoryId?: string; // Reference to Category document
  category: string; // Legacy string category
  subcategory?: string; // Legacy string subcategory
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  status?: 'Draft' | 'Active' | 'Out of Stock' | 'Archived'; // New product status
  inventoryStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock'; // Legacy inventory
  stockQuantity?: number; // New accurate inventory tracking
  lowStockThreshold?: number;
  couponCode?: string;
  couponDiscount?: number;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  createdAt?: any;
  updatedAt?: any;
  seo?: ProductSEO;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  personalizationName?: string;
}

// DEPRECATED: Migrate to dynamic Firestore categories.
export const CATEGORIES_MAP: Record<string, string[]> = {
  'new': ['new-collection', 'new-launch', 'best-sellers', 'festive'],
  'personalized-gifts': ['mugs', 'bottles', 'passport-covers', 'laptop-bags', 'travel-cases', 'corporate-gifts'],
  'kids': ['bags', 'water-bottles', 'lunch-boxes', 'kids-gifts', 'stationery', 'toys', 'umbrellas', 'combos'],
  'adults': ['mens', 'womens', 'unisex'],
  'accessories': ['bags', 'travel-combo', 'gift-boxes', 'desk', 'combos']
};

export const ALL_PRODUCTS: Product[] = [];
