import { useQuery } from '@tanstack/react-query';

import { getPublicSellerProfile } from '@/api/sellers';

const usePublicSellerProfile = (sellerId: string | undefined) => {
  const query = useQuery({
    queryKey: ['public-seller-profile', sellerId],
    queryFn: () => getPublicSellerProfile(sellerId as string),
    enabled: Boolean(sellerId),
  });

  return {
    seller: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
};

export { usePublicSellerProfile };
