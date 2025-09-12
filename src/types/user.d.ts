export interface UserResponse {
  id: string;
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
  role: 'BUYER' | 'SELLER';
  products: [];
}
