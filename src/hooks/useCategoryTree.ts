import { useQuery } from '@tanstack/react-query';
import { getCategoryTree } from '@/api/categories';
import type { Category, Subcategory } from '@/types/categoryTypes';

const formatLabel = (key: string) => {
  return key
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const useCategoryTree = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['categoryTree'],
    queryFn: getCategoryTree,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const categories: Category[] =
    data?.map((item) => ({
      id: item.category,
      label: formatLabel(item.category),
      subcategories: item.subcategories.map((sub) => ({
        id: sub,
        label: formatLabel(sub),
      })) as Subcategory[],
    })) || [];

  return {
    categories,
    isLoading,
    isError,
    error,
  };
};
