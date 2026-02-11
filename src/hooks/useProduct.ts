import { useState, useEffect } from 'react';
import { getProductById } from '@/api/Products';
import type { Product } from '@/types/productCard';

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  return { product, isLoading, error };
};
