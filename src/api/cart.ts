import { fetchData } from './fetchData';
import type {
  CartItemRequestDto,
  CartSyncRequestDto,
  CartUpdateRequestDto,
  CartResponseDto,
} from '@/types/cart';

export const getCart = (): Promise<CartResponseDto> => {
  return fetchData<CartResponseDto>('/cart/me');
};

export const addCartItem = (data: CartItemRequestDto): Promise<void> => {
  return fetchData<void>('/cart/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const syncCart = (data: CartSyncRequestDto): Promise<void> => {
  return fetchData<void>('/cart/me/sync', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCartItemQuantity = (
  productId: string,
  data: CartUpdateRequestDto,
): Promise<void> => {
  return fetchData<void>(`/cart/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const removeCartItem = (productId: string): Promise<void> => {
  return fetchData<void>(`/cart/items/${productId}`, {
    method: 'DELETE',
  });
};

export const clearCartAPI = (): Promise<void> => {
  return fetchData<void>('/cart/me', {
    method: 'DELETE',
  });
};
