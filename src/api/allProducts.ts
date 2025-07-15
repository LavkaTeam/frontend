import type { AllProducts } from '@/types/allProducts';
import { fetchData } from './fetchData';

const getAllProducts = (): Promise<AllProducts[]> => {
  return fetchData<AllProducts[]>(`/products/all`, {
    method: 'GET',
  });
};

export { getAllProducts };
