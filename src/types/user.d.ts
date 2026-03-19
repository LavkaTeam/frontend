export type UserRole = 'BUYER' | 'SELLER';

export interface UserResponse {
  id: string;
  name: string;
  lastName: string;
  email: string;
  companyName: string;
  registration_Number: string;
  liquor_License: string;
  liquor_License_File_Url: string;
  tax_ID: string;
  vat_Number: string;
  bank_Name: string;
  iban: string;
  bic: string;
  telephoneNumber: string;
  role: UserRole;
  products: [];
  status: 'VERIFIED' | 'PENDING' | 'NOT_VERIFIED';
  logoUrl: string;
}
