import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getPublicSellerProducts } from '@/api/Products';

const PRODUCT_QUERY_STALE_TIME = 5 * 60 * 1000;
const PRODUCT_QUERY_GC_TIME = 30 * 60 * 1000;

export const usePublicSellerProducts = (
  sellerId: string | undefined,
  page: number,
  size: number = 12,
) => {
  const query = useQuery({
    queryKey: ['public-seller-products', sellerId, page, size],
    queryFn: () => getPublicSellerProducts(sellerId as string, page, size),
    enabled: Boolean(sellerId),
    placeholderData: keepPreviousData,
    staleTime: PRODUCT_QUERY_STALE_TIME,
    gcTime: PRODUCT_QUERY_GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    products: query.data?.content || [],
    totalPages: query.data?.totalPages || 0,
    totalElements: query.data?.totalElements || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
};
