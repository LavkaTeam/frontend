import { useEffect } from 'react';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getProductById } from '@/api/Products';
import {
  addFavoriteItem,
  getFavorites,
  removeFavoriteItem,
} from '@/api/favorites';
import {
  addFavorite,
  clearFavorites as clearFavoritesLocal,
  removeFavorite,
  setFavorites,
  toggleFavorite as toggleFavoriteLocal,
} from '@/store/favoritesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Product } from '@/types/productCard';

const favoritesQueryKey = ['favorites'] as const;

interface UseFavoriteProductsOptions {
  loadProducts?: boolean;
}

export const useFavoriteProducts = (
  options: UseFavoriteProductsOptions = {},
) => {
  const { loadProducts = true } = options;
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites);
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const favoritesQuery = useQuery({
    queryKey: favoritesQueryKey,
    queryFn: getFavorites,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(setFavorites((favoritesQuery.data || []).map((item) => item.id)));
  }, [dispatch, favoritesQuery.data, isAuthenticated]);

  const guestQueriesResults = useQueries({
    queries:
      !isAuthenticated && loadProducts
        ? favoriteIds.map((id) => ({
            queryKey: ['product', id],
            queryFn: () => getProductById(id),
            staleTime: 1000 * 60 * 5,
            retry: false,
          }))
        : [],
  });

  const guestProducts = guestQueriesResults
    .map((result) => result.data)
    .filter((item): item is Product => item !== undefined);

  return {
    favoriteIds,
    favoriteCount: isAuthenticated
      ? favoritesQuery.data?.length ?? favoriteIds.length
      : favoriteIds.length,
    products: isAuthenticated
      ? loadProducts
        ? favoritesQuery.data || []
        : []
      : guestProducts,
    isLoading: isAuthenticated
      ? favoritesQuery.isLoading
      : loadProducts
        ? guestQueriesResults.some((result) => result.isLoading)
        : false,
    isFetching: isAuthenticated ? favoritesQuery.isFetching : false,
    isAuthenticated,
  };
};

export const useFavoriteActions = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const favoriteIds = useAppSelector((state) => state.favorites);
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const addMutation = useMutation({
    mutationFn: (productId: string) => addFavoriteItem(productId),
    onMutate: (productId) => {
      dispatch(addFavorite(productId));
    },
    onError: (_error, productId) => {
      dispatch(removeFavorite(productId));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFavoriteItem(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: favoritesQueryKey });
      const previousFavorites =
        queryClient.getQueryData<Product[]>(favoritesQueryKey);

      dispatch(removeFavorite(productId));
      queryClient.setQueryData<Product[]>(favoritesQueryKey, (current = []) =>
        current.filter((item) => item.id !== productId),
      );

      return { previousFavorites, productId };
    },
    onError: (_error, _productId, context) => {
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData(favoritesQueryKey, context.previousFavorites);
        dispatch(
          setFavorites(context.previousFavorites.map((item) => item.id)),
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKey });
    },
  });

  const toggleFavorite = async (productId: string) => {
    if (!isAuthenticated) {
      dispatch(toggleFavoriteLocal(productId));
      return;
    }

    if (favoriteIds.includes(productId)) {
      await removeMutation.mutateAsync(productId);
      return;
    }

    await addMutation.mutateAsync(productId);
  };

  const clearFavorites = async () => {
    if (!isAuthenticated) {
      dispatch(clearFavoritesLocal());
      return;
    }

    await Promise.allSettled(
      favoriteIds.map((productId) => removeMutation.mutateAsync(productId)),
    );
  };

  return {
    toggleFavorite,
    clearFavorites,
    isUpdatingFavorites: addMutation.isPending || removeMutation.isPending,
  };
};
