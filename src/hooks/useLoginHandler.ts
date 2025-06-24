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
      onError: (error: any) => {
        console.log('Server error:', error);
        if (error.email) {
          setError('email', { message: error.email });
        }
        if (error.password) {
          setError('password', { message: error.password });
        }
        if (!error.email && !error.password) {
          alert('Something went wrong');
        }
      },
    });
  };

  return { handleSubmit, isLoading: login.isPending };
};
