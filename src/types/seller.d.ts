export type SellerVerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'NOT_VERIFIED';

export type SellerMainCategory =
  | 'BESTSELLERS'
  | 'RELATED_PRODUCTS'
  | 'TOP_SELECT'
  | 'NORMAL';

export interface PublicSellerProfile {
  id: string;
  displayName: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  logoUrl?: string;
  city: string;
  country: string;
  verificationStatus: SellerVerificationStatus;
  verifiedSeller: boolean;
  hasLiquorLicense: boolean;
  activeProductsCount: number;
  inStockProductsCount: number;
  mainCategories: SellerMainCategory[];
}
