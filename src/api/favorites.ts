import { fetchData } from './fetchData';
import type { Product } from '@/types/productCard';

interface FavoritesSyncDto {
  productIds: string[];
}

export const getFavorites = (): Promise<Product[]> => {
  return fetchData<Product[]>('/user/me/favorites');
};

export const addFavoriteItem = (productId: string): Promise<void> => {
  return fetchData<void>(`/user/me/favorites/${productId}`, {
    method: 'POST',
  });
};

export const removeFavoriteItem = (productId: string): Promise<void> => {
  return fetchData<void>(`/user/me/favorites/${productId}`, {
    method: 'DELETE',
  });
};

export const syncFavorites = (data: FavoritesSyncDto): Promise<void> => {
  return fetchData<void>('/user/me/favorites/sync', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
