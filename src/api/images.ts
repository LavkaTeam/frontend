import { fetchData } from './fetchData';
import type { ProductImage } from '@/types/productCard';

export const uploadImage = async (file: Blob): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append('files', file);
  const data = await fetchData<ProductImage | ProductImage[]>('/images/upload', {
    method: 'POST',
    body: formData,
  });

  if (Array.isArray(data)) {
    if (data.length > 0) return data[0];
    throw new Error('No image received from server');
  }

  return data;
};
