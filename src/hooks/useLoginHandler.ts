import { useQueryClient } from '@tanstack/react-query';
import { useLogin } from './useAuth';
import { useNavigate } from 'react-router';
import type { LoginPayload } from '@/types/auth';
import { syncLocalUserData } from './syncLocalUserData';

export const useLoginHandler = () => {
  const queryClient = useQueryClient();
  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (
    data: LoginPayload,
    setError: (field: keyof LoginPayload, error: { message: string }) => void,
  ) => {
    login.mutate(data, {
      onSuccess: async (response) => {
        localStorage.setItem('token', response.token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        await syncLocalUserData(queryClient);

        // Check if there's a redirect state, otherwise go to home
        const locationState = window.history.state as { usr?: { from?: string } };
        const from = locationState?.usr?.from || '/';
        navigate(from);
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
