import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logOutUser,

    //КОД КОТОРЫЙ ИДЁТ ДАЛЬШЕ НУЖНО СЕПАРИРОВАТЬ ДЛЯ ОТДЕЛЬНОЙ ЛОГИКИ LOGOUT

    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.clear();
    },
  });
};

export { useRegister, useLogin, useLogOut };
