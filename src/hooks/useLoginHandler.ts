import { useQueryClient } from '@tanstack/react-query';
import { useLogin } from './useAuth';
import { useNavigate } from 'react-router';
import type { LoginPayload } from '@/types/auth';

export const useLoginHandler = () => {
  const queryClient = useQueryClient();
  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (
    data: LoginPayload,
    setError: (field: keyof LoginPayload, error: { message: string }) => void,
  ) => {
    login.mutate(data, {
      onSuccess: (response) => {
        localStorage.setItem('token', response.token);
        queryClient.invalidateQueries({ queryKey: ['user'] });

        navigate('/');
      },
      onError: (error: unknown) => {
        const err = error as Record<string, string | undefined>;
        console.log('Server error:', err);
        if (err?.email) {
          setError('email', { message: err.email });
        }
        if (err?.password) {
          setError('password', { message: err.password });
        }
        if (!err?.email && !err?.password) {
          alert('Something went wrong');
        }
      },
    });
  };

  return { handleSubmit, isLoading: login.isPending };
};
