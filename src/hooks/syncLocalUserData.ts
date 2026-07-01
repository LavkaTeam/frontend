import type { QueryClient } from '@tanstack/react-query';

const isMissingSyncEndpointError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const status =
    'status' in error && typeof error.status === 'number' ? error.status : undefined;
  const message =
    'message' in error && typeof error.message === 'string'
      ? error.message.toLowerCase()
      : '';

  return status === 404 || message.includes('404') || message.includes('not found');
};

export const syncLocalUserData = async (queryClient: QueryClient) => {
  try {
    const { store } = await import('@/store');
    const { clearCart } = await import('@/store/cartSlice');
    const { clearFavorites } = await import('@/store/favoritesSlice');

    const localCartStr = localStorage.getItem('cart');
    if (localCartStr) {
      const localCart = JSON.parse(localCartStr);

      if (Array.isArray(localCart) && localCart.length > 0) {
        const cartItems = localCart
          .filter(
            (
              item,
            ): item is {
              id: string;
              quantity: number;
            } =>
              typeof item?.id === 'string' && typeof item?.quantity === 'number',
          )
          .map((item) => ({
            productId: item.id,
            requestedQuantity: item.quantity,
          }));

        if (cartItems.length > 0) {
          const { addCartItem, syncCart } = await import('@/api/cart');

          try {
            await syncCart({ items: cartItems });
          } catch (error) {
            if (!isMissingSyncEndpointError(error)) {
              throw error;
            }

            await Promise.all(
              cartItems.map((item) =>
                addCartItem(item).catch((cartItemError) =>
                  console.error('Failed to add item to cart', cartItemError),
                ),
              ),
            );
          }
        }

        store.dispatch(clearCart());
        await queryClient.invalidateQueries({ queryKey: ['cart'] });
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

    await queryClient.invalidateQueries({ queryKey: ['favorites'] });
  } catch (error) {
    console.error('Failed to sync local data to backend', error);
  }
};
