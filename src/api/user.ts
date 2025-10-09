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

interface UpdateUserData {
  name: string;
  lastName: string;
  email: string;
  companyName: string;
  registration_Number: string;
  liquor_License: string;
  tax_ID: string;
  vat_Number: string;
  bank_Name: string;
  iban: string;
  bic: string;
  telephoneNumber: string;
}

const updateUser = (
  id: string,
  userData: UpdateUserData
): Promise<UserResponse> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return Promise.reject('No token');
  }

  return fetchData<UserResponse>(`/user/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
};

export { getUser, updateUser };
