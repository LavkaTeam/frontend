import type { UserResponse } from '@/types/user';
import { fetchData } from './fetchData';

export const getUser = (): Promise<UserResponse> => {
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

export interface UpdateUserData {
  name: string;
  lastName: string;
  email: string;
  companyName: string;
  registration_Number: string;
  liquor_License: string;
  liquor_License_File_Url?: string;
  tax_ID: string;
  vat_Number: string;
  bank_Name: string;
  iban: string;
  bic: string;
  telephoneNumber: string;
  logoUrl?: string;
}

export const updateUser = (
  id: string,
  userData: UpdateUserData,
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
