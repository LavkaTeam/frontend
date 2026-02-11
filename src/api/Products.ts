import { fetchData } from './fetchData';
import type { Product } from '@/types/productCard';
import type { PaginatedResponse, SearchParams } from '@/types/api';

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
): Promise<PaginatedResponse<Product>> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (key === 'sort' && Array.isArray(value)) {
      value.forEach((sortItem) => queryParams.append('sort', sortItem));
    } else {
      queryParams.append(key, value.toString());
    }
  });

  return fetchData<PaginatedResponse<Product>>(
    `/products/search?${queryParams.toString()}`,
    {
      method: 'GET',
    },
  );
};
