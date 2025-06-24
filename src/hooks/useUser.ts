import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/user';

const useUser = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
};

export { useUser };
