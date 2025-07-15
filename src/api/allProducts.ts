import { fetchData } from './fetchData';

const getAllProducts = (): Promise<unknown[]> => {
  return fetchData<unknown[]>(`/products/all`, {
    method: 'GET',
  });
};

export { getAllProducts };
