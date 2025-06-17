export type UserRole = 'BUYER' | 'SELLER';

export interface AuthPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  telephoneNumber: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    companyName: string;
    telephoneNumber: string;
  };
}
