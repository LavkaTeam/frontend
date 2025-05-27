import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthResponse } from '../types/auth';
import { getCurrentUser } from '../api/auth';

const useGetUser = () => {
  const queryClient = useQueryClient();

  const token = localStorage.getItem('token');

  const query = useQuery<AuthResponse['user'], Error>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  if (query.isError) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.removeQueries({ queryKey: ['user'] });
  }

  return query;
};
export { useGetUser };
