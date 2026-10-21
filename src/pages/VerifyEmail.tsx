import { useSearchParams } from 'react-router-dom';

import { VerifyEmailStatus } from '@/components/Form';
import { useVerifyEmail } from '@/hooks/useAuth';
import { extractErrorMessage } from '@/utils/error';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { isSuccess, isError, error } = useVerifyEmail(token);

  if (!token) return <VerifyEmailStatus state='missingToken' />;
  if (isSuccess) return <VerifyEmailStatus state='success' />;

  if (isError) {
    return (
      <VerifyEmailStatus
        state='error'
        errorMessage={extractErrorMessage(
          error,
          'This link has expired or has already been used.',
        )}
      />
    );
  }

  return <VerifyEmailStatus state='loading' />;
};

export default VerifyEmail;
