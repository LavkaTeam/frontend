import type { Address } from '@/types/user';

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  bankName: string;
  iban: string;
  bic: string;
  taxId: string;
  vatNumber: string;
  registrationNumber: string;
  liquorLicenseNumber: string;
  liquorLicenseDocumentUrl: string;
  logoUrl: string;
  legalCountry: string;
  legalCity: string;
  legalStreet: string;
  legalZipCode: string;
};

export type ProfileFieldKey = keyof ProfileFormData;
export type ProfileFormErrors = Partial<Record<ProfileFieldKey, string>>;

export type AddressDraft = {
  id?: string;
  title: string;
  country: string;
  city: string;
  street: string;
  zipCode: string;
  recipientName: string;
  recipientPhone: string;
  deliveryNotes: string;
};

export type LicenseStatusTone =
  | 'default'
  | 'verified'
  | 'pending'
  | 'rejected';

export type LicenseStatusMeta = {
  label: string;
  tone: LicenseStatusTone;
};

export type ProfileFieldConfig = {
  id: ProfileFieldKey;
  label: string;
  placeholder: string;
  type?: 'email' | 'text';
  readOnly?: boolean;
};

export type AddressFieldConfig = {
  id: keyof AddressDraft;
  label: string;
  placeholder: string;
  fullWidth?: boolean;
};

export type UserAddress = Address;
