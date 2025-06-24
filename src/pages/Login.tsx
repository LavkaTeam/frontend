import { LoginForm } from '@/components/Form';
import { useLoginHandler } from '@/hooks/useLoginHandler';

const Login = () => {
  const { handleSubmit, isLoading } = useLoginHandler();

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default Login;
