import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/api/Products';
import type { SearchParams } from '@/types/api';

export const useSearchProducts = (params: SearchParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products-search', params],
    queryFn: () => searchProducts(params),
  });

  return {
    products: data?.content || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    isLastPage: data?.last,
    isLoading,
    error,
  };
};
