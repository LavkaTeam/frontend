import { useState, useEffect } from 'react';
import { getProductById } from '@/api/Products';
import type { Product } from '@/types/productCard';
import { extractErrorMessage } from '@/utils/error';

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        // A failed earlier product must not keep the next one on NotFound.
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(extractErrorMessage(err, 'Failed to load the product.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  return { product, isLoading, error };
};
