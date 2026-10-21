import { RegisterForm, RegistrationResult } from '@components/Form';
import type { RegisterRequest } from '@hooks/useAuth';
import { useRegisterHandler } from '@hooks/useRegisterHandler';

interface RegisterProps {
  // Replaces the API call; used by the dev preview only.
  request?: RegisterRequest;
}

const Register = ({ request }: RegisterProps) => {
  const { handleSubmit, isLoading, registration, cooldownSeconds } =
    useRegisterHandler({ request });

  if (registration) {
    return (
      <RegistrationResult
        email={registration.email}
        emailSent={registration.emailSent}
        message={registration.message}
      />
    );
  }

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      cooldownSeconds={cooldownSeconds}
    />
  );
};

export default Register;
