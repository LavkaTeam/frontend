import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/user';

const useUser = () => {
  const initialUser = (() => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  })();

  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    initialData: initialUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
};

export { useUser };
