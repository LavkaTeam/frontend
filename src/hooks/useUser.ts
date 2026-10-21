import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/user';
import type { UserResponse } from '@/types/user';
import { useIsAuthenticated } from './useIsAuthenticated';

const useUser = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery<UserResponse>({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
};

export { useUser };
