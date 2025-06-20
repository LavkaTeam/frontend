import { useMutation } from '@tanstack/react-query';
import { loginUser, logOutUser, registerUser } from '../api/auth';
import type { AuthPayload, AuthResponse, LoginPayload } from '@/types/auth';

const useRegister = () => {
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: registerUser,
  });
};

const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: loginUser,
  });
};

const useLogOut = () => {
  return useMutation({
    mutationFn: logOutUser,
  });
};

export { useRegister, useLogin, useLogOut };
