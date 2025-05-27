import { fetchData } from './fetchData';

import type { AuthPayload, AuthResponse, LoginPayload } from '../types/auth';

const registerUser = (data: AuthPayload): Promise<AuthResponse> => {
  return fetchData<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

const loginUser = (data: LoginPayload): Promise<AuthResponse> => {
  return fetchData<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

const logOutUser = (): Promise<void> => {
  return fetchData<void>('/auth/logout', {
    method: 'POST',
  });
};

const getCurrentUser = (): Promise<AuthResponse['user']> => {
  const token = localStorage.getItem('token');
  if (!token) return Promise.reject(new Error('No token'));
  return fetchData<AuthResponse['user']>('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export { registerUser, loginUser, logOutUser, getCurrentUser };
