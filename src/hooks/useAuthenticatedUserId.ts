import { useQuery } from '@tanstack/react-query';
import { getUser, getUserId } from '@/api/user';

const useAuthenticatedUserId = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return useQuery<string>({
    queryKey: ['authenticated-user-id'],
    queryFn: async () => {
      try {
        return await getUserId();
      } catch {
        const user = await getUser();
        return String(user.id);
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
};

export { useAuthenticatedUserId };
