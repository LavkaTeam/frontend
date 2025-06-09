import { fetchData } from './fetchData';

import type { AuthPayload, AuthResponse, LoginPayload } from '@/types/auth';

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

export { registerUser, loginUser, logOutUser };
