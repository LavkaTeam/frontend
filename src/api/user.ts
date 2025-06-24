import type { UserResponse } from '@/types/user';
import { fetchData } from './fetchData';

const getUser = (): Promise<UserResponse> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return Promise.reject('No token');
  }

  return fetchData<UserResponse>('/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getUser };
