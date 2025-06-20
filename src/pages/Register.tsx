import { RegisterForm } from '@components/Form';
import { useRegisterHandler } from '@hooks/useRegisterHandler';

const Register = () => {
  const { handleSubmit, isLoading: register } = useRegisterHandler();

  return (
    <RegisterForm onSubmit={handleSubmit} isLoading={register.isPending} />
  );
};

export { Register };
