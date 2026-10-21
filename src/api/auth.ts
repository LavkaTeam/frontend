import { fetchData } from './fetchData';

import type {
  AuthMessageResponse,
  AuthPayload,
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegistrationResponse,
  ResetPasswordPayload,
} from '@/types/auth';

const registerUser = (data: AuthPayload): Promise<RegistrationResponse> => {
  return fetchData<RegistrationResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      firstName: data.name,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      companyName: data.companyName,
      phoneNumber: data.telephoneNumber,
      role: data.role,
    }),
  });
};

const loginUser = (data: LoginPayload): Promise<AuthResponse> => {
  return fetchData<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

const logOutUser = (): Promise<void> => {
  return fetchData<void>('/auth/logout', {
    method: 'POST',
  });
};

const verifyEmail = (token: string): Promise<AuthMessageResponse> => {
  return fetchData<AuthMessageResponse>(
    `/auth/verify-email?token=${encodeURIComponent(token)}`,
  );
};

const requestPasswordReset = (
  data: ForgotPasswordPayload,
): Promise<AuthMessageResponse> => {
  return fetchData<AuthMessageResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

const resetPassword = (
  data: ResetPasswordPayload,
): Promise<AuthMessageResponse> => {
  return fetchData<AuthMessageResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export {
  registerUser,
  loginUser,
  logOutUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};
