export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'NOT_VERIFIED';

export interface Address {
  id?: string;
  title?: string;
  country?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  recipientName?: string;
  recipientPhone?: string;
  deliveryNotes?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  products: [];
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
  shippingAddresses?: Address[];
  verificationStatus?: VerificationStatus;

  // Legacy aliases kept for compatibility with parts of the current UI.
  name?: string;
  telephoneNumber?: string;
  registration_Number?: string;
  tax_ID?: string;
  vat_Number?: string;
  liquor_License?: string;
  bank_Name?: string;
}
