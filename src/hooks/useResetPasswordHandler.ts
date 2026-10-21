import { useState } from 'react';
import type { UseFormSetError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useResetPassword, type ResetPasswordRequest } from './useAuth';
import { useCountdown } from './useCountdown';
import { useToast } from './useToast';
import type { ResetPasswordFormSchema } from '@/schemas/resetPasswordSchema';
import {
  extractErrorMessage,
  getErrorCode,
  getRetryAfterSeconds,
} from '@/utils/error';
import { applyServerFieldErrors } from '@/utils/formErrors';

interface UseResetPasswordHandlerOptions {
  request?: ResetPasswordRequest;
}

export const useResetPasswordHandler = (
  token: string,
  { request }: UseResetPasswordHandlerOptions = {},
) => {
  const resetPassword = useResetPassword(request);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const cooldown = useCountdown();
  // Set when the backend rejects the token: the form is replaced by the
  // "link expired" screen, since no password will make it work.
  const [linkError, setLinkError] = useState('');

  const handleSubmit = (
    data: ResetPasswordFormSchema,
    setError: UseFormSetError<ResetPasswordFormSchema>,
  ) => {
    resetPassword.mutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          showToast(
            'Password updated. You can now log in with your new password.',
            'success',
          );
          navigate('/login', { replace: true });
        },
        onError: (error: unknown) => {
          // 429: show the backend text and block the form for the wait time.
          const retryAfter = getRetryAfterSeconds(error);
          if (retryAfter) {
            cooldown.start(retryAfter);
            showToast(extractErrorMessage(error), 'error');
            return;
          }

          const hasFieldErrors = applyServerFieldErrors(error, setError, {
            newPassword: ['newPassword', 'password'],
          });
          if (hasFieldErrors) return;

          // An invalid or expired token is the only BAD_REQUEST here.
          if (getErrorCode(error) === 'BAD_REQUEST') {
            setLinkError(extractErrorMessage(error));
            return;
          }

          showToast(
            extractErrorMessage(
              error,
              'Could not update your password. Please try again.',
            ),
            'error',
          );
        },
      },
    );
  };

  return {
    handleSubmit,
    isLoading: resetPassword.isPending,
    linkError,
    cooldownSeconds: cooldown.secondsLeft,
  };
};
