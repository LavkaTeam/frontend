export type MainCategory =
  | 'BESTSELLERS'
  | 'RELATED_PRODUCTS'
  | 'TOP_SELECT'
  | 'NORMAL';

export interface SearchParams {
  page?: number;
  size?: number;
  name?: string;
  volume?: string;
  category?: string;
  subcategory?: string;
  status?: string;
  producer?: string;
  minPrice?: number;
  maxPrice?: number;
  alcohol?: number;
  mainCategory?: MainCategory;
  sort?: string[]; // ["price,asc"]
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
