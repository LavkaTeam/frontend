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
        queryClient.invalidateQueries({ queryKey: ['user'] });

        navigate('/');
      },
      onError: (error: unknown) => {
        const err = error as Record<string, string | undefined>;
        if (err?.email) {
          setError('email', { message: err.email });
        }
        if (err?.password) {
          setError('password', { message: err.password });
        }
        if (err?.telephoneNumber) {
          setError('telephoneNumber', { message: err.telephoneNumber });
        }
        if (!err?.email && !err?.password && !err?.telephoneNumber) {
          alert('Something went wrong');
        }
      },
    });
  };

  return { handleSubmit, isLoading: register };
};
