import type { AuthPayload } from '@/types/auth';
import { useRegister } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { RegisterForm } from '@/components/Form/RegisterForm';

const Register = () => {
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

  return (
    <RegisterForm onSubmit={handleSubmit} isLoading={register.isPending} />
  );
};

export { Register };
