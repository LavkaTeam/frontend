import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../api/allProducts';

const useProducts = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allProducts'],
    queryFn: getAllProducts,
  });

  return { products, isLoading, error };
};

export { useProducts };
