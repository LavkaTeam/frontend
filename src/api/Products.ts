import { fetchData } from './fetchData';
import type { Product, ProductRequest, WholesalePrice } from '@/types/productCard';
import type { PaginatedResponse, SearchParams, SearchFiltersResponse, ProductSuggestion } from '@/types/api';

// Отримати всі товари
export const getAllProducts = (): Promise<Product[]> => {
  return fetchData<Product[]>('/products/all', {
    method: 'GET',
  });
};

// Отримати один товар по ID
export const getProductById = (id: string): Promise<Product> => {
  return fetchData<Product>(`/products/${id}`, {
    method: 'GET',
  });
};

// Пошук з пагінацією та фільтрами
export const searchProducts = (
  params: SearchParams,
  signal?: AbortSignal,
): Promise<PaginatedResponse<Product>> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((val) => queryParams.append(key, val.toString()));
    } else {
      queryParams.append(key, value.toString());
    }
  });

  return fetchData<PaginatedResponse<Product>>(
    `/products/search?${queryParams.toString()}`,
    {
      method: 'GET',
      signal,
    },
  );
};

// Отримати підказки для автокомпліту пошуку
export const getProductSuggestions = (
  query: string,
  limit: number = 10,
  signal?: AbortSignal,
): Promise<ProductSuggestion[]> => {
  return fetchData<ProductSuggestion[]>(
    `/products/search/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`,
    {
      method: 'GET',
      signal,
    },
  );
};

// Отримати динамічні фільтри для актуального пошуку
export const getSearchFilters = (
  params: SearchParams,
  signal?: AbortSignal,
): Promise<SearchFiltersResponse> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Для метаданих page і size не потрібні, але хай ідуть якщо вже є
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((val) => queryParams.append(key, val.toString()));
    } else {
      queryParams.append(key, value.toString());
    }
  });

  return fetchData<SearchFiltersResponse>(
    `/products/search/filters?${queryParams.toString()}`,
    {
      method: 'GET',
      signal,
    },
  );
};

// Створити товар
export const createProduct = (data: ProductRequest): Promise<Product> => {
  return fetchData<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Оновити товар
export const updateProduct = (id: string, data: ProductRequest): Promise<Product> => {
  return fetchData<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Видалити товар
export const deleteProduct = (id: string): Promise<void> => {
  return fetchData<void>(`/products/${id}`, {
    method: 'DELETE',
  });
};

// Змінити статус товару
export const updateProductStatus = (
  id: string,
  status: 'ACTIVE' | 'HIDDEN' | 'UNDER_REVIEW' | 'ARCHIVED',
): Promise<Product> => {
  return fetchData<Product>(`/products/${id}/status?status=${status}`, {
    method: 'PATCH',
  });
};

// Оновити оптові ціни
export const updateWholesalePrices = (id: string, prices: WholesalePrice[]): Promise<Product> => {
  return fetchData<Product>(`/products/${id}/wholesale-prices`, {
    method: 'POST',
    body: JSON.stringify(prices),
  });
};

// Отримати публічні товари продавця
export const getPublicSellerProducts = (
  sellerId: string,
  page: number = 0,
  size: number = 10,
): Promise<PaginatedResponse<Product>> => {
  return fetchData<PaginatedResponse<Product>>(
    `/products/seller/${sellerId}/public?page=${page}&size=${size}`,
    {
      method: 'GET',
    },
  );
};

// Отримати товари поточного продавця
export const getMyProducts = (
  page: number = 0,
  size: number = 10,
): Promise<PaginatedResponse<Product>> => {
  return fetchData<PaginatedResponse<Product>>(
    `/products/seller/me?page=${page}&size=${size}`,
    {
      method: 'GET',
    },
  );
};
