import { useQuery } from '@tanstack/react-query';
import { getUser, getUserId } from '@/api/user';
import { useIsShopper } from './useIsAuthenticated';

const useAuthenticatedUserId = () => {
  // Used to recognise one's own products; the admin has none.
  const isShopper = useIsShopper();

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
    enabled: isShopper,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
};

export { useAuthenticatedUserId };
