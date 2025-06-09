import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, logOutUser, registerUser } from '../api/auth';
import type { AuthPayload, AuthResponse } from '@/types/auth';

const useRegister = () => {
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: registerUser,
  });
};

const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: loginUser,

    //КОД КОТОРЫЙ ИДЁТ ДАЛЬШЕ НУЖНО СЕПАРИРОВАТЬ ДЛЯ ОТДЕЛЬНОЙ ЛОГИКИ LOGIN

    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
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
