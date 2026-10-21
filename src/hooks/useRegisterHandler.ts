import { useState } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import { useRegister, type RegisterRequest } from './useAuth';
import { useCountdown } from './useCountdown';
import { useToast } from './useToast';
import type { AuthPayload, RegistrationResponse } from '@/types/auth';
import {
  extractErrorMessage,
  getErrorCode,
  getRetryAfterSeconds,
} from '@/utils/error';
import { applyServerFieldErrors, SERVER_ERROR_TYPE } from '@/utils/formErrors';

interface RegistrationResult extends RegistrationResponse {
  email: string;
}

interface UseRegisterHandlerOptions {
  request?: RegisterRequest;
}

export const useRegisterHandler = ({
  request,
}: UseRegisterHandlerOptions = {}) => {
  const register = useRegister(request);
  const { showToast } = useToast();
  const cooldown = useCountdown();
  const [registration, setRegistration] = useState<RegistrationResult | null>(
    null,
  );

  const handleSubmit = (
    data: AuthPayload,
    setError: UseFormSetError<AuthPayload>,
  ) => {
    register.mutate(data, {
      onSuccess: (response) => {
        setRegistration({ ...response, email: data.email });
      },
      onError: (error: unknown) => {
        // 429: show the backend text and block the form for the wait time.
        const retryAfter = getRetryAfterSeconds(error);
        if (retryAfter) {
          cooldown.start(retryAfter);
          showToast(extractErrorMessage(error), 'error');
          return;
        }

        if (getErrorCode(error) === 'EMAIL_ALREADY_EXISTS') {
          setError(
            'email',
            { type: SERVER_ERROR_TYPE, message: extractErrorMessage(error) },
            { shouldFocus: true },
          );
          return;
        }

        // Backend field names differ from the form ones for name and phone.
        const hasFieldErrors = applyServerFieldErrors(error, setError, {
          name: ['firstName', 'name'],
          lastName: ['lastName'],
          email: ['email'],
          password: ['password'],
          companyName: ['companyName'],
          telephoneNumber: ['phoneNumber', 'telephoneNumber'],
          role: ['role'],
        });

        if (!hasFieldErrors) {
          showToast(
            extractErrorMessage(
              error,
              'We could not complete your registration right now. Please try again in a few minutes.',
            ),
            'error',
          );
        }
      },
    });
  };

  return {
    handleSubmit,
    isLoading: register.isPending,
    registration,
    cooldownSeconds: cooldown.secondsLeft,
  };
};
