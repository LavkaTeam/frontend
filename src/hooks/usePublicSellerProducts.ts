import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getPublicSellerProducts } from '@/api/Products';

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
