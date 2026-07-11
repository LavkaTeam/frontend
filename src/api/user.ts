import type { Address, Subscriptions, UserResponse } from '@/types/user';
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

const getUserId = async (): Promise<string> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return Promise.reject('No token');
  }

  const response = await fetchData<string | { id: string }>('/user/me/id', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (typeof response === 'string' || typeof response === 'number') {
    return String(response);
  }

  return String(response.id);
};

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companyName?: string;
  logoUrl?: string;
  registrationNumber?: string;
  taxId?: string;
  vatNumber?: string;
  liquorLicenseNumber?: string;
  liquorLicenseDocumentUrl?: string;
  bankName?: string;
  iban?: string;
  bic?: string;
  legalAddress?: Address;
  subscriptions?: Subscriptions;

  // Legacy aliases kept during migration of account tabs.
  name?: string;
  email?: string;
  registration_Number?: string;
  liquor_License?: string;
  liquor_License_File_Url?: string;
  tax_ID?: string;
  vat_Number?: string;
  bank_Name?: string;
  telephoneNumber?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export type AddressPayload = Omit<Address, 'id'>;

const normalizeUpdateUserData = (userData: UpdateUserData) => ({
  firstName: userData.firstName ?? userData.name,
  lastName: userData.lastName,
  phoneNumber: userData.phoneNumber ?? userData.telephoneNumber,
  companyName: userData.companyName,
  logoUrl: userData.logoUrl,
  registrationNumber:
    userData.registrationNumber ?? userData.registration_Number,
  taxId: userData.taxId ?? userData.tax_ID,
  vatNumber: userData.vatNumber ?? userData.vat_Number,
  liquorLicenseNumber:
    userData.liquorLicenseNumber ?? userData.liquor_License,
  liquorLicenseDocumentUrl:
    userData.liquorLicenseDocumentUrl ?? userData.liquor_License_File_Url,
  bankName: userData.bankName ?? userData.bank_Name,
  iban: userData.iban,
  bic: userData.bic,
  legalAddress: userData.legalAddress,
  subscriptions: userData.subscriptions,
});

const updateUser = (
  _id: string,
  userData: UpdateUserData,
): Promise<UserResponse> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return Promise.reject('No token');
  }

  return fetchData<UserResponse>('/user/me', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(normalizeUpdateUserData(userData)),
  });
};

export { getUser, getUserId, updateUser };

export const changePassword = (data: ChangePasswordData): Promise<void> => {
  return fetchData<void>('/user/me/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const addUserAddress = (data: AddressPayload): Promise<Address> => {
  return fetchData<Address>('/user/me/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateUserAddress = (
  addressId: string,
  data: AddressPayload,
): Promise<Address> => {
  return fetchData<Address>(`/user/me/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteUserAddress = (addressId: string): Promise<void> => {
  return fetchData<void>(`/user/me/addresses/${addressId}`, {
    method: 'DELETE',
  });
};

export const uploadUserFile = async (
  file: Blob,
  folder: 'documents' | 'logos' | 'license' = 'documents',
): Promise<string> => {
  const formData = new FormData();
  formData.append(
    'file',
    file,
    file instanceof File ? file.name : `${folder}-upload`,
  );
  formData.append('folder', folder);

  const data = await fetchData<{ url?: string }>(
    `/user/me/upload?folder=${encodeURIComponent(folder)}`,
    {
      method: 'POST',
      body: formData,
    },
  );
  if (!data.url) {
    throw new Error('Upload response did not contain a file url');
  }

  return data.url;
};

export const getUserLicenseDocument = async (): Promise<Blob> => {
  return fetchData<Blob>('/user/me/documents/license', {
    method: 'GET',
    responseType: 'blob',
  });
};
