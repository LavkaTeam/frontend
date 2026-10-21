import { useMutation, useQuery } from '@tanstack/react-query';
import {
  loginUser,
  logOutUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from '../api/auth';
import type {
  AuthMessageResponse,
  AuthPayload,
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegistrationResponse,
  ResetPasswordPayload,
} from '@/types/auth';

// Request functions can be swapped out, so the dev preview (/dev/auth) can run
// the real handlers against simulated backend responses.
export type RegisterRequest = (
  payload: AuthPayload,
) => Promise<RegistrationResponse>;
export type LoginRequest = (payload: LoginPayload) => Promise<AuthResponse>;
export type ForgotPasswordRequest = (
  payload: ForgotPasswordPayload,
) => Promise<AuthMessageResponse>;
export type ResetPasswordRequest = (
  payload: ResetPasswordPayload,
) => Promise<AuthMessageResponse>;

const useRegister = (request: RegisterRequest = registerUser) => {
  return useMutation<RegistrationResponse, unknown, AuthPayload>({
    mutationFn: request,
  });
};

const useLogin = (request: LoginRequest = loginUser) => {
  return useMutation<AuthResponse, unknown, LoginPayload>({
    mutationFn: request,
  });
};

const useLogOut = () => {
  return useMutation({
    mutationFn: logOutUser,
  });
};

// Verification tokens are single-use, so the result must never be refetched.
const useVerifyEmail = (token: string) => {
  return useQuery<AuthMessageResponse, unknown>({
    queryKey: ['verify-email', token],
    queryFn: () => verifyEmail(token),
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

const useForgotPassword = (
  request: ForgotPasswordRequest = requestPasswordReset,
) => {
  return useMutation<AuthMessageResponse, unknown, ForgotPasswordPayload>({
    mutationFn: request,
  });
};

const useResetPassword = (request: ResetPasswordRequest = resetPassword) => {
  return useMutation<AuthMessageResponse, unknown, ResetPasswordPayload>({
    mutationFn: request,
  });
};

export {
  useRegister,
  useLogin,
  useLogOut,
  useVerifyEmail,
  useForgotPassword,
  useResetPassword,
};
