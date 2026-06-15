export type MainCategory =
  | 'BESTSELLERS'
  | 'RELATED_PRODUCTS'
  | 'TOP_SELECT'
  | 'NORMAL';

export interface SearchParams {
  page?: number;
  size?: number;
  name?: string;
  category?: string;
  subcategory?: string;
  producer?: string;
  minPrice?: number;
  maxPrice?: number;
  mainCategory?: MainCategory;
  volume?: number[];
  alcoholRanges?: string[];
  promotionsOnly?: boolean;
  tags?: string[];
  countryOfOrigin?: string;
  sort?: string[]; // ["property,asc"]
}

export interface FilterCount {
  name: string;
  count: number;
}

export interface SearchFiltersResponse {
  minPrice: number;
  maxPrice: number;
  volumes: FilterCount[];
  strengths: FilterCount[];
  countries: FilterCount[];
  producers: FilterCount[];
  hasPromotionsAvailable: boolean;
}

export interface SortObject {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface PageableObject {
  sort: SortObject;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: PageableObject;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: SortObject;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ProductSuggestion {
  id: string;
  name: string;
  mainImage: string | import('./productCard.d').ProductImage;
  price: number;
  discountPrice?: number;
  wholesalePrices: { minQuantity: number; price: number }[];
  producer: string;
  mainCategory: string;
  category: string;
  subcategory: string;
  minimumOrderQuantity: number;
  sku: string;
  volume: number;
  alcohol: number;
  quantity: number;
  averageRating: number;
  reviewsCount: number;
}
