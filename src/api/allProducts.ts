import type { AllProducts } from '@/types/productCard';
import { fetchData } from './fetchData';

const getAllProducts = (): Promise<AllProducts[]> => {
  return fetchData<AllProducts[]>(`/products/all`, {
    method: 'GET',
  });
};

export { getAllProducts };
