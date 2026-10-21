import { useSearchParams } from 'react-router-dom';

import { InvalidResetLink, ResetPasswordForm } from '@/components/Form';
import type { ResetPasswordRequest } from '@/hooks/useAuth';
import { useResetPasswordHandler } from '@/hooks/useResetPasswordHandler';

interface ResetPasswordProps {
  // Replaces the API call; used by the dev preview only.
  request?: ResetPasswordRequest;
  token?: string;
}

const ResetPassword = ({ request, token: tokenOverride }: ResetPasswordProps) => {
  const [searchParams] = useSearchParams();
  const token = tokenOverride ?? (searchParams.get('token') || '');
  const { handleSubmit, isLoading, linkError, cooldownSeconds } =
    useResetPasswordHandler(token, { request });

  if (!token) return <InvalidResetLink />;
  if (linkError) return <InvalidResetLink message={linkError} />;

  return (
    <ResetPasswordForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      cooldownSeconds={cooldownSeconds}
    />
  );
};

export default ResetPassword;
