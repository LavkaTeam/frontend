import type {
  AddressDraft,
  AddressFieldConfig,
  ProfileFieldConfig,
  ProfileFieldKey,
} from '../types/profileForm.types';

export const REQUIRED_PROFILE_FIELDS: ProfileFieldKey[] = [
  'firstName',
  'lastName',
  'phoneNumber',
  'companyName',
  'registrationNumber',
  'taxId',
  'vatNumber',
  'bankName',
  'iban',
  'bic',
  'liquorLicenseNumber',
  'liquorLicenseDocumentUrl',
  'legalCountry',
  'legalCity',
  'legalStreet',
  'legalZipCode',
];

export const PROFILE_FIELD_LABELS: Record<ProfileFieldKey, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phoneNumber: 'Phone number',
  companyName: 'Company name',
  bankName: 'Bank name',
  iban: 'IBAN',
  bic: 'BIC',
  taxId: 'Tax ID',
  vatNumber: 'VAT number',
  registrationNumber: 'Registration number',
  liquorLicenseNumber: 'Liquor license number',
  liquorLicenseDocumentUrl: 'License file',
  logoUrl: 'Logo',
  legalCountry: 'Legal address country',
  legalCity: 'Legal address city',
  legalStreet: 'Legal address street',
  legalZipCode: 'Legal address zip code',
};

export const PERSONAL_FIELD_CONFIGS: ProfileFieldConfig[] = [
  {
    id: 'firstName',
    label: 'First name',
    placeholder: 'First name',
  },
  {
    id: 'lastName',
    label: 'Last name',
    placeholder: 'Last name',
  },
  {
    id: 'email',
    label: 'Email',
    placeholder: 'Email',
    type: 'email',
    readOnly: true,
  },
  {
    id: 'phoneNumber',
    label: 'Phone number',
    placeholder: 'Phone number',
  },
];

export const COMPANY_FIELD_CONFIGS: ProfileFieldConfig[] = [
  {
    id: 'companyName',
    label: 'Company name',
    placeholder: 'Company name',
  },
  {
    id: 'registrationNumber',
    label: 'Registration number',
    placeholder: 'Registration number',
  },
  {
    id: 'taxId',
    label: 'Tax ID',
    placeholder: 'Tax ID',
  },
  {
    id: 'vatNumber',
    label: 'VAT number',
    placeholder: 'VAT number',
  },
  {
    id: 'bankName',
    label: 'Bank name',
    placeholder: 'Bank name',
  },
  {
    id: 'iban',
    label: 'IBAN',
    placeholder: 'IBAN',
  },
  {
    id: 'bic',
    label: 'BIC',
    placeholder: 'BIC',
  },
  {
    id: 'liquorLicenseNumber',
    label: 'Liquor license number',
    placeholder: 'Liquor license number',
  },
  {
    id: 'legalCountry',
    label: 'Legal address country',
    placeholder: 'Legal address country',
  },
  {
    id: 'legalCity',
    label: 'Legal address city',
    placeholder: 'Legal address city',
  },
  {
    id: 'legalStreet',
    label: 'Legal address street',
    placeholder: 'Legal address street',
  },
  {
    id: 'legalZipCode',
    label: 'Legal address zip code',
    placeholder: 'Legal address zip code',
  },
];

export const ADDRESS_FIELD_CONFIGS: AddressFieldConfig[] = [
  {
    id: 'title',
    label: 'Address title',
    placeholder: 'Address title',
  },
  {
    id: 'recipientName',
    label: 'Recipient name',
    placeholder: 'Recipient name',
  },
  {
    id: 'recipientPhone',
    label: 'Recipient phone',
    placeholder: 'Recipient phone',
  },
  {
    id: 'country',
    label: 'Country',
    placeholder: 'Country',
  },
  {
    id: 'city',
    label: 'City',
    placeholder: 'City',
  },
  {
    id: 'zipCode',
    label: 'Zip code',
    placeholder: 'Zip code',
  },
  {
    id: 'street',
    label: 'Street',
    placeholder: 'Street',
    fullWidth: true,
  },
  {
    id: 'deliveryNotes',
    label: 'Delivery notes',
    placeholder: 'Delivery notes',
    fullWidth: true,
  },
];

export const EMPTY_ADDRESS_DRAFT: AddressDraft = {
  title: '',
  country: '',
  city: '',
  street: '',
  zipCode: '',
  recipientName: '',
  recipientPhone: '',
  deliveryNotes: '',
};

export const SUPPORTED_LICENSE_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
];
