import { useQueries } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';
import { getProductById } from '@/api/Products';
import type { Product } from '@/types/productCard';

export const useFavoriteProducts = () => {
  const favoriteIds = useAppSelector((state) => state.favorites);

  // TanStack Query створює масив запитів паралельно
  const queriesResults = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ['product', id],
      queryFn: () => getProductById(id),
      staleTime: 1000 * 60 * 5, // Кешуємо на 5 хв
      retry: false,
    })),
  });

  // Якщо хоч один запит ще вантажиться -> isLoading = true
  const isLoading = queriesResults.some((result) => result.isLoading);

  // Збираємо успішні результати
  const products = queriesResults
    .map((result) => result.data)
    .filter((item): item is Product => item !== undefined);

  return { products, isLoading };
};
