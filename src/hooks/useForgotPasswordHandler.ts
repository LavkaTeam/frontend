import { useState } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import { useForgotPassword, type ForgotPasswordRequest } from './useAuth';
import { useCountdown } from './useCountdown';
import { useToast } from './useToast';
import type { ForgotPasswordPayload } from '@/types/auth';
import {
  extractErrorMessage,
  getRetryAfterSeconds,
} from '@/utils/error';
import { applyServerFieldErrors } from '@/utils/formErrors';

interface UseForgotPasswordHandlerOptions {
  request?: ForgotPasswordRequest;
}

export const useForgotPasswordHandler = ({
  request,
}: UseForgotPasswordHandlerOptions = {}) => {
  const forgotPassword = useForgotPassword(request);
  const { showToast } = useToast();
  const cooldown = useCountdown();
  const [sentToEmail, setSentToEmail] = useState('');

  const handleSubmit = (
    data: ForgotPasswordPayload,
    setError: UseFormSetError<ForgotPasswordPayload>,
  ) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setSentToEmail(data.email);
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
          email: ['email'],
        });

        // e.g. 503 EMAIL_DELIVERY_FAILED: the text says to retry later.
        if (!hasFieldErrors) {
          showToast(
            extractErrorMessage(
              error,
              'Could not send the reset link. Please try again.',
            ),
            'error',
          );
        }
      },
    });
  };

  return {
    handleSubmit,
    isLoading: forgotPassword.isPending,
    sentToEmail,
    cooldownSeconds: cooldown.secondsLeft,
  };
};
