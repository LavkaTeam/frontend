export interface ProductImage {
  id: string;
  url: string;
  publicId?: string;
}

export type ProductStatus =
  | 'ACTIVE'
  | 'HIDDEN'
  | 'UNDER_REVIEW'
  | 'ARCHIVED';

export type ProductCategory =
  | 'WINE'
  | 'BEER'
  | 'STRONG_DRINKS'
  | 'LOW_ALCOHOL_DRINKS'
  | 'SOFT_DRINKS'
  | 'BARWARE_ACCESSORIES';

export type ProductMainCategory =
  | 'BESTSELLERS'
  | 'RELATED_PRODUCTS'
  | 'TOP_SELECT'
  | 'NORMAL';

export interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  logoUrl?: string; // Optional since it might be missing
}

export interface WholesalePrice {
  minQuantity: number;
  price: number;
}

export interface CategoryTreeItem {
  category: ProductCategory;
  subcategories: string[];
}

export interface Product {
  id: string;
  // Search results carry only the id of the seller, not `seller`.
  sellerId?: string;
  // Sent by the backend only to the admin and the owning seller.
  adminBlocked?: boolean;
  moderationReason?: string;
  mainImage: ProductImage;
  images: ProductImage[];
  name: string;
  producer: string;
  price: number;
  quantity: number;
  mainCategory: ProductMainCategory;
  alcohol: number;
  description: string;
  status: ProductStatus;
  inStock: boolean;
  category: ProductCategory;
  subcategory: string;
  volume: number;
  sku: string;
  countryOfOrigin: string;
  tags: string[];
  minimumOrderQuantity: number;
  material: string;
  discountPrice?: number;
  barcode: string;
  salesCount: number;
  averageRating: number;
  reviewsCount: number;
  weight: number;
  taxRate: number;
  dimensions: string;
  wholesalePrices: WholesalePrice[];
  seller: Seller;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProductSummary {
  id: string;
  name: string;
  volume: number;
  producer: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  quantity: number;
  mainImage?: ProductImage;
  subcategory: string;
  country?: string;
  // Blocked by the admin: hidden and cannot be activated by the seller.
  adminBlocked?: boolean;
  moderationReason?: string;
}

export interface ProductRequest {
  mainImageId?: string;
  imageIds?: string[];
  name: string;
  producer: string;
  price: number;
  quantity: number;
  mainCategory: ProductMainCategory;
  alcohol: number;
  description: string;
  category: ProductCategory;
  subcategory: string;
  volume: number;
  sku: string;
  countryOfOrigin: string;
  tags: string[];
  minimumOrderQuantity: number;
  material: string;
  discountPrice?: number;
  barcode: string;
  weight: number;
  dimensions: string;
  taxRate?: number;
  wholesalePrices: WholesalePrice[];
}
