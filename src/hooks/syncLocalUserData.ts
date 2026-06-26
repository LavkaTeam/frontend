import type { QueryClient } from '@tanstack/react-query';

export const syncLocalUserData = async (queryClient: QueryClient) => {
  try {
    const { store } = await import('@/store');
    const { clearCart } = await import('@/store/cartSlice');
    const { clearFavorites } = await import('@/store/favoritesSlice');

    const localCartStr = localStorage.getItem('cart');
    if (localCartStr) {
      const localCart = JSON.parse(localCartStr);

      if (Array.isArray(localCart) && localCart.length > 0) {
        const { addCartItem } = await import('@/api/cart');

        await Promise.all(
          localCart.map((item) =>
            addCartItem({
              productId: item.id,
              requestedQuantity: item.quantity,
            }).catch((error) =>
              console.error('Failed to add item to cart', error),
            ),
          ),
        );

        store.dispatch(clearCart());
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    }

    const localFavoritesStr = localStorage.getItem('favorites');
    if (localFavoritesStr) {
      const localFavorites = JSON.parse(localFavoritesStr);

      if (Array.isArray(localFavorites) && localFavorites.length > 0) {
        const { syncFavorites } = await import('@/api/favorites');

        await syncFavorites({
          productIds: Array.from(new Set(localFavorites)),
        });

        store.dispatch(clearFavorites());
      }
    }

    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  } catch (error) {
    console.error('Failed to sync local data to backend', error);
  }
};
