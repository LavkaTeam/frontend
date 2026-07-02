import { fetchData } from './fetchData';
import type { PublicSellerProfile } from '@/types/seller';

const getPublicSellerProfile = (
  sellerId: string,
): Promise<PublicSellerProfile> => {
  return fetchData<PublicSellerProfile>(`/sellers/${sellerId}`, {
    method: 'GET',
  });
};

export { getPublicSellerProfile };
