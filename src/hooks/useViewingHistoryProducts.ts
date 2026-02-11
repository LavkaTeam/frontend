import { useQueries } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';
import { getProductById } from '@/api/Products';
import type { Product } from '@/types/productCard';

export const useViewingHistoryProducts = () => {
  const historyIds = useAppSelector((state) => state.viewingHistory);

  const queriesResults = useQueries({
    queries: historyIds.map((id) => ({
      queryKey: ['product', id],
      queryFn: () => getProductById(id),
      staleTime: 1000 * 60 * 5,
      retry: false,
    })),
  });

  const isLoading = queriesResults.some((result) => result.isLoading);

  const products = queriesResults
    .map((result) => result.data)
    .filter((item): item is Product => item !== undefined);

  return { products, isLoading };
};
