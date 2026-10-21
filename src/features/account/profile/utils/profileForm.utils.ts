import type { UpdateUserData } from '@/api/user';
import type { Address, UserResponse, VerificationStatus } from '@/types/user';

import {
  EMPTY_ADDRESS_DRAFT,
  PROFILE_FIELD_LABELS,
  REQUIRED_PROFILE_FIELDS,
} from '../config/profileForm.constants';
import type {
  AddressDraft,
  AddressFormErrors,
  LicenseStatusMeta,
  ProfileFieldKey,
  ProfileFormData,
  ProfileFormErrors,
} from '../types/profileForm.types';
import {
  ADDRESS_FIELD_RULES,
  getFieldFormatError,
  PROFILE_FIELD_RULES,
} from './fieldRules';

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

// Required fields still empty: the same list the backend checks before it
// moves the account to PENDING and before it allows checkout.
export const getMissingProfileFields = (
  data: ProfileFormData,
): ProfileFieldKey[] =>
  REQUIRED_PROFILE_FIELDS.filter((field) => isBlank(data[field]));

// Backend uses nested keys for the legal address.
const BACKEND_FIELD_TO_FORM: Record<string, ProfileFieldKey> = {
  'legalAddress.country': 'legalCountry',
  'legalAddress.city': 'legalCity',
  'legalAddress.street': 'legalStreet',
  'legalAddress.zipCode': 'legalZipCode',
};

export const toProfileFieldKey = (backendField: string): ProfileFieldKey =>
  BACKEND_FIELD_TO_FORM[backendField] || (backendField as ProfileFieldKey);

const PROFILE_FIELD_KEYS = new Set(Object.keys(PROFILE_FIELD_LABELS));

// Maps a 400 validation response of PUT /api/user/me to form errors.
export const getProfileFieldErrors = (error: unknown): ProfileFormErrors => {
  if (!error || typeof error !== 'object' || error instanceof Error) return {};

  const errors: ProfileFormErrors = {};

  Object.entries(error as Record<string, unknown>).forEach(([key, value]) => {
    const field = toProfileFieldKey(key);
    if (typeof value === 'string' && PROFILE_FIELD_KEYS.has(field)) {
      errors[field] = value;
    }
  });

  return errors;
};

interface ProfileValidationOptions {
  // Also report empty required fields. Off when saving: the backend accepts
  // a partly filled profile and keeps it NOT_VERIFIED until it is complete.
  requireFilled?: boolean;
}

export const validateProfileField = (
  field: ProfileFieldKey,
  value: string,
  { requireFilled = false }: ProfileValidationOptions = {},
): string | undefined => {
  if (isBlank(value)) {
    return requireFilled && REQUIRED_PROFILE_FIELDS.includes(field)
      ? `${PROFILE_FIELD_LABELS[field]} is required.`
      : undefined;
  }

  return getFieldFormatError(PROFILE_FIELD_RULES, field, value);
};

export const validateProfileForm = (
  data: ProfileFormData,
  options: ProfileValidationOptions = {},
): ProfileFormErrors => {
  const nextErrors: ProfileFormErrors = {};

  (Object.keys(data) as ProfileFieldKey[]).forEach((field) => {
    const error = validateProfileField(field, data[field], options);
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

// Format check of a shipping address before POST/PUT /api/user/me/addresses.
export const validateAddressDraft = (draft: AddressDraft): AddressFormErrors => {
  const errors: AddressFormErrors = {};

  (Object.keys(ADDRESS_FIELD_RULES) as Array<keyof AddressDraft>).forEach(
    (field) => {
      const error = getFieldFormatError(
        ADDRESS_FIELD_RULES,
        field,
        draft[field] || '',
      );
      if (error) errors[field] = error;
    },
  );

  return errors;
};

// Maps a 400 validation response of the address endpoints to form errors.
export const getAddressFieldErrors = (error: unknown): AddressFormErrors => {
  if (!error || typeof error !== 'object' || error instanceof Error) return {};

  const errors: AddressFormErrors = {};

  Object.entries(error as Record<string, unknown>).forEach(([key, value]) => {
    if (typeof value === 'string' && key in EMPTY_ADDRESS_DRAFT) {
      errors[key as keyof AddressDraft] = value;
    }
  });

  return errors;
};
