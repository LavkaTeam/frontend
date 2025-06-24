export interface UserResponse {
  id: string;
  name: string;
  lastName: string;
  email: string;
  companyName: string;
  telephoneNumber: string;
  role: 'BUYER' | 'SELLER';
  products: [];
}
