import { useQuery } from '@tanstack/react-query';
import { getProductSuggestions } from '@/api/Products';

export const useProductSuggestions = (query: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['product-suggestions', query, limit],
    queryFn: ({ signal }) => getProductSuggestions(query, limit, signal),
    enabled: query.length >= 2, // Backend ignores words shorter than 2 chars for fuzzy search
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
