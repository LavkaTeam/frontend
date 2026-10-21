import { ForgotPasswordForm, PasswordResetEmailSent } from '@/components/Form';
import type { ForgotPasswordRequest } from '@/hooks/useAuth';
import { useForgotPasswordHandler } from '@/hooks/useForgotPasswordHandler';

interface ForgotPasswordProps {
  // Replaces the API call; used by the dev preview only.
  request?: ForgotPasswordRequest;
}

const ForgotPassword = ({ request }: ForgotPasswordProps) => {
  const { handleSubmit, isLoading, sentToEmail, cooldownSeconds } =
    useForgotPasswordHandler({ request });

  if (sentToEmail) return <PasswordResetEmailSent email={sentToEmail} />;

  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      cooldownSeconds={cooldownSeconds}
    />
  );
};

export default ForgotPassword;
