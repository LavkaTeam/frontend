export interface ProductImage {
  id: string;
  url: string;
  publicId?: string;
}

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

export interface Product {
  id: string;
  mainImage: ProductImage;
  images: ProductImage[];
  name: string;
  producer: string;
  price: number;
  quantity: number;
  mainCategory: 'BESTSELLERS' | 'RELATED_PRODUCTS' | 'TOP_SELECT' | 'NORMAL';
  alcohol: number;
  description: string;
  status: 'ACTIVE' | 'HIDDEN' | 'UNDER_REVIEW' | 'ARCHIVED';
  inStock: boolean;
  category: 'WINE' | 'BEER' | 'STRONG_DRINKS' | 'LOW_ALCOHOL_DRINKS' | 'SOFT_DRINKS' | 'BARWARE_ACCESSORIES';
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

export interface ProductRequest {
  mainImageId?: string;
  imageIds?: string[];
  name: string;
  producer: string;
  price: number;
  quantity: number;
  mainCategory: 'BESTSELLERS' | 'RELATED_PRODUCTS' | 'TOP_SELECT' | 'NORMAL';
  alcohol: number;
  description: string;
  category: 'WINE' | 'BEER' | 'STRONG_DRINKS' | 'LOW_ALCOHOL_DRINKS' | 'SOFT_DRINKS' | 'BARWARE_ACCESSORIES';
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
  taxRate: number;
  wholesalePrices: WholesalePrice[];
}
