import type { UpdateUserData } from '@/api/user';
import type { Address, UserResponse, VerificationStatus } from '@/types/user';

import {
  EMPTY_ADDRESS_DRAFT,
  PROFILE_FIELD_LABELS,
  REQUIRED_PROFILE_FIELDS,
} from '../config/profileForm.constants';
import type {
  AddressDraft,
  LicenseStatusMeta,
  ProfileFieldKey,
  ProfileFormData,
  ProfileFormErrors,
} from '../types/profileForm.types';

export const buildProfileFormData = (user: UserResponse): ProfileFormData => ({
  firstName: user.firstName || user.name || '',
  lastName: user.lastName || '',
  email: user.email || '',
  phoneNumber: user.phoneNumber || user.telephoneNumber || '',
  companyName: user.companyName || '',
  bankName: user.bankName || user.bank_Name || '',
  iban: user.iban || '',
  bic: user.bic || '',
  taxId: user.taxId || user.tax_ID || '',
  vatNumber: user.vatNumber || user.vat_Number || '',
  registrationNumber: user.registrationNumber || user.registration_Number || '',
  liquorLicenseNumber: user.liquorLicenseNumber || user.liquor_License || '',
  liquorLicenseDocumentUrl:
    user.liquorLicenseDocumentUrl || user.liquor_License_File_Url || '',
  logoUrl: user.logoUrl || '',
  legalCountry: user.legalAddress?.country || '',
  legalCity: user.legalAddress?.city || '',
  legalStreet: user.legalAddress?.street || '',
  legalZipCode: user.legalAddress?.zipCode || '',
});

const isBlank = (value: string) => value.trim().length === 0;

export const validateProfileField = (
  field: ProfileFieldKey,
  value: string,
): string | undefined => {
  const trimmedValue = value.trim();

  if (REQUIRED_PROFILE_FIELDS.includes(field) && isBlank(value)) {
    return `${PROFILE_FIELD_LABELS[field]} is required.`;
  }

  if (field === 'phoneNumber') {
    const normalized = trimmedValue.replace(/[\s()-]/g, '');
    if (!/^\+?[0-9]{8,15}$/.test(normalized)) {
      return 'Enter a valid phone number.';
    }
  }

  if (field === 'iban' && trimmedValue.length < 15) {
    return 'IBAN must be at least 15 characters.';
  }

  if (field === 'bic' && !/^[A-Za-z0-9]{8,11}$/.test(trimmedValue)) {
    return 'BIC must contain 8 to 11 letters or numbers.';
  }

  if (field === 'legalZipCode' && trimmedValue.length < 3) {
    return 'Enter a valid zip code.';
  }

  if (
    [
      'firstName',
      'lastName',
      'companyName',
      'bankName',
      'legalCountry',
      'legalCity',
    ].includes(field) &&
    trimmedValue.length < 2
  ) {
    return `${PROFILE_FIELD_LABELS[field]} must be at least 2 characters.`;
  }

  if (
    [
      'registrationNumber',
      'taxId',
      'vatNumber',
      'liquorLicenseNumber',
    ].includes(field) &&
    trimmedValue.length < 4
  ) {
    return `${PROFILE_FIELD_LABELS[field]} must be at least 4 characters.`;
  }

  if (field === 'legalStreet' && trimmedValue.length < 5) {
    return 'Legal address street must be at least 5 characters.';
  }

  return undefined;
};

export const validateProfileForm = (
  data: ProfileFormData,
): ProfileFormErrors => {
  const nextErrors: ProfileFormErrors = {};

  (Object.keys(data) as ProfileFieldKey[]).forEach((field) => {
    const error = validateProfileField(field, data[field]);
    if (error) {
      nextErrors[field] = error;
    }
  });

  return nextErrors;
};

export const getLicenseFileName = (
  pendingFile: File | null,
  remoteUrl: string,
): string | null => {
  if (pendingFile) return pendingFile.name;
  if (!remoteUrl) return null;

  try {
    const pathname = new URL(remoteUrl).pathname;
    return decodeURIComponent(pathname.split('/').pop() || 'license-file');
  } catch {
    return 'license-file';
  }
};

export const getLicenseStatusMeta = (
  userStatus: VerificationStatus | undefined,
  hasRemoteFile: boolean,
  hasPendingFile: boolean,
): LicenseStatusMeta => {
  if (hasPendingFile) {
    return {
      label: 'Selected locally · Save changes to upload',
      tone: 'default',
    };
  }

  if (!hasRemoteFile) {
    return {
      label: 'No file uploaded',
      tone: 'default',
    };
  }

  switch (userStatus) {
    case 'VERIFIED':
      return {
        label: 'Uploaded · Verified',
        tone: 'verified',
      };
    case 'PENDING':
      return {
        label: 'Uploaded · Pending verification',
        tone: 'pending',
      };
    case 'REJECTED':
      return {
        label: 'Uploaded · Rejected',
        tone: 'rejected',
      };
    case 'NOT_VERIFIED':
    default:
      return {
        label: 'Uploaded · Not verified',
        tone: 'rejected',
      };
  }
};

export const toAddressDraft = (address?: Address): AddressDraft => ({
  ...EMPTY_ADDRESS_DRAFT,
  id: address?.id,
  title: address?.title || '',
  country: address?.country || '',
  city: address?.city || '',
  street: address?.street || '',
  zipCode: address?.zipCode || '',
  recipientName: address?.recipientName || '',
  recipientPhone: address?.recipientPhone || '',
  deliveryNotes: address?.deliveryNotes || '',
});

export const buildProfileUpdatePayload = (
  user: UserResponse,
  formData: ProfileFormData,
  overrides: Partial<UpdateUserData> = {},
): UpdateUserData => ({
  firstName: formData.firstName,
  lastName: formData.lastName,
  phoneNumber: formData.phoneNumber,
  companyName: formData.companyName,
  logoUrl: formData.logoUrl,
  registrationNumber: formData.registrationNumber,
  taxId: formData.taxId,
  vatNumber: formData.vatNumber,
  liquorLicenseNumber: formData.liquorLicenseNumber,
  liquorLicenseDocumentUrl: formData.liquorLicenseDocumentUrl,
  bankName: formData.bankName,
  iban: formData.iban,
  bic: formData.bic,
  subscriptions: user.subscriptions,
  legalAddress: {
    ...user.legalAddress,
    country: formData.legalCountry,
    city: formData.legalCity,
    street: formData.legalStreet,
    zipCode: formData.legalZipCode,
  },
  ...overrides,
});
