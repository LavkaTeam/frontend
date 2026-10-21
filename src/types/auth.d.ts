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
  refreshToken: string;
  user: {
    id: string;
    firstName?: string;
    name?: string;
    lastName: string;
    email: string;
    companyName: string;
    phoneNumber?: string;
    telephoneNumber?: string;
  };
}

export interface RegistrationResponse {
  message: string;
  // false: the account exists but the verification email was not delivered;
  // logging in sends a new link.
  emailSent: boolean;
}

// Backend answers verify/forgot/reset with a Map<String, String>.
export interface AuthMessageResponse {
  message?: string;
  [key: string]: string | undefined;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
