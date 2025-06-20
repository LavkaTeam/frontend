import { LoginForm } from '@/components/Form';
import { useLoginHandler } from '@/hooks/useLoginHandler';

const Login = () => {
  const { handleSubmit, isLoading: login } = useLoginHandler();

  return <LoginForm onSubmit={handleSubmit} isLoading={login.isPending} />;
};

export { Login };
