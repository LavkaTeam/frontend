import type { QueryClient } from '@tanstack/react-query';

import { clearCart } from '@/store/cartSlice';
import { clearFavorites } from '@/store/favoritesSlice';
import { clearHistory } from '@/store/viewingHistorySlice';

import type { AppDispatch } from '@/store';

// Everything a sandbox leaves in the browser besides the tokens: items of the
// last user's cart, wishlist and viewing history point at data of a sandbox
// that is gone, and cached queries belong to the previous user.
export const clearDemoClientState = (
  dispatch: AppDispatch,
  queryClient: QueryClient,
) => {
  dispatch(clearCart());
  dispatch(clearFavorites());
  dispatch(clearHistory());
  queryClient.clear();
};
