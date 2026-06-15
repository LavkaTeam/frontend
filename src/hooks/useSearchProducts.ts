import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchProducts, getSearchFilters } from '@/api/Products';
import type { SearchParams } from '@/types/api';

export const useSearchProducts = (
  params: SearchParams,
  options?: {
    skipFilters?: boolean;
    skipProducts?: boolean;
    staleTime?: number;
    gcTime?: number;
  },
) => {
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    error: productsError,
  } = useQuery({
    queryKey: ['products-search', params],
    queryFn: ({ signal }) => searchProducts(params, signal),
    enabled: !options?.skipProducts,
    placeholderData: keepPreviousData,
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  });

  const {
    data: filtersData,
    isLoading: isFiltersLoading,
    isFetching: isFiltersFetching,
    error: filtersError,
  } = useQuery({
    queryKey: ['products-search-filters', params],
    queryFn: ({ signal }) => getSearchFilters(params, signal),
    enabled: !options?.skipFilters,
    placeholderData: keepPreviousData,
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  });

  return {
    products: productsData?.content || [],
    totalPages: productsData?.totalPages || 0,
    totalElements: productsData?.totalElements || 0,
    metaFilters: filtersData,
    isLastPage: productsData?.last,
    isLoading:
      (options?.skipProducts ? false : isProductsLoading) ||
      (options?.skipFilters ? false : isFiltersLoading),
    isFetching:
      (options?.skipProducts ? false : isProductsFetching) ||
      (options?.skipFilters ? false : isFiltersFetching),
    error: productsError || filtersError,
  };
};
