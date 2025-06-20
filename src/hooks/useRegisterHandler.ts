import { useQueryClient } from '@tanstack/react-query';
import { useRegister } from './useAuth';
import { useNavigate } from 'react-router';
import type { AuthPayload } from '@/types/auth';

export const useRegisterHandler = () => {
  const queryClient = useQueryClient();
  const register = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (
    data: AuthPayload,
    setError: (field: keyof AuthPayload, error: { message: string }) => void,
  ) => {
    register.mutate(data, {
      onSuccess: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userName', JSON.stringify(response.user.name));
        queryClient.setQueryData(['user'], response.user);

        navigate('/');
      },
      onError: (error: any) => {
        if (error.email) {
          setError('email', { message: error.email });
        }
        if (error.password) {
          setError('password', { message: error.password });
        }
        if (error.telephoneNumber) {
          setError('telephoneNumber', { message: error.telephoneNumber });
        }
        if (!error.email && !error.password && !error.telephoneNumber) {
          alert('Something went wrong');
        }
      },
    });
  };

  return { handleSubmit, isLoading: register };
};
