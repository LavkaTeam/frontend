import { fetchData } from './fetchData';

export interface CategoryTreeDto {
  category: string;
  subcategories: string[];
}

export const getCategoryTree = async (): Promise<CategoryTreeDto[]> => {
  return await fetchData('/categories/tree');
};
