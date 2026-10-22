import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { UseFormSetError } from 'react-hook-form';

import { useLogin, type LoginRequest } from './useAuth';
import { useCountdown } from './useCountdown';
import { useToast } from './useToast';
import { syncLocalUserData } from './syncLocalUserData';
import { saveAuthTokens } from '@/shared/api/client';
import type { AuthResponse, LoginPayload } from '@/types/auth';
import {
  extractErrorMessage,
  getErrorCode,
  getRetryAfterSeconds,
} from '@/utils/error';
import {
  applyServerFieldErrors,
  CREDENTIALS_ERROR_TYPE,
} from '@/utils/formErrors';

// The backend sends a new verification email at most once per minute.
const RESEND_COOLDOWN_SECONDS = 60;

// Login outcomes that replace the form with a dedicated screen.
export type LoginBlocker =
  | { kind: 'emailNotVerified'; email: string; message: string }
  | { kind: 'accountDisabled'; message: string };

interface UseLoginHandlerOptions {
  request?: LoginRequest;
}

export const useLoginHandler = ({ request }: UseLoginHandlerOptions = {}) => {
  const queryClient = useQueryClient();
  const login = useLogin(request);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const resendCountdown = useCountdown();
  const cooldown = useCountdown();
  const [blocker, setBlocker] = useState<LoginBlocker | null>(null);
  const [lastEmail, setLastEmail] = useState('');
  // Kept in memory only, so "Resend email" can repeat the login attempt:
  // the backend resends the verification link on a login with valid
  // credentials.
  const credentialsRef = useRef<LoginPayload | null>(null);

  const finishLogin = async (response: AuthResponse) => {
    credentialsRef.current = null;
    saveAuthTokens(response);
    queryClient.invalidateQueries({ queryKey: ['user'] });

    // The admin has no cart or favorites to merge and works in /admin.
    if (response.user?.role === 'ADMIN') {
      navigate('/admin');
      return;
    }

    await syncLocalUserData(queryClient);

    const locationState = window.history.state as { usr?: { from?: string } };
    navigate(locationState?.usr?.from || '/account');
  };

  const showUnexpectedError = (error: unknown) => {
    showToast(
      extractErrorMessage(
        error,
        'We could not log you in right now. Please try again in a moment.',
      ),
      'error',
    );
  };

  // Handles outcomes that do not belong to a single form field.
  // Returns true when the error was handled.
  const handleBlockingError = (error: unknown, data: LoginPayload) => {
    switch (getErrorCode(error)) {
      case 'EMAIL_NOT_VERIFIED':
        credentialsRef.current = data;
        resendCountdown.start(RESEND_COOLDOWN_SECONDS);
        setBlocker({
          kind: 'emailNotVerified',
          email: data.email,
          message: extractErrorMessage(error),
        });
        return true;
      case 'ACCOUNT_DISABLED':
        credentialsRef.current = null;
        setBlocker({
          kind: 'accountDisabled',
          message: extractErrorMessage(error),
        });
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = (
    data: LoginPayload,
    setError: UseFormSetError<LoginPayload>,
  ) => {
    if (cooldown.secondsLeft > 0) return;
    setLastEmail(data.email);

    login.mutate(data, {
      onSuccess: finishLogin,
      onError: (error: unknown) => {
        // 429: show the backend text and block the form for the wait time.
        const retryAfter = getRetryAfterSeconds(error);
        if (retryAfter) {
          cooldown.start(retryAfter);
          showToast(extractErrorMessage(error), 'error');
          return;
        }

        if (handleBlockingError(error, data)) return;

        if (getErrorCode(error) === 'INVALID_CREDENTIALS') {
          // The backend does not say which of the two is wrong: highlight
          // both and put the message under the password.
          setError('email', { type: CREDENTIALS_ERROR_TYPE, message: '' });
          setError(
            'password',
            {
              type: CREDENTIALS_ERROR_TYPE,
              message: extractErrorMessage(error),
            },
            { shouldFocus: true },
          );
          return;
        }

        const hasFieldErrors = applyServerFieldErrors(error, setError, {
          email: ['email'],
          password: ['password'],
        });

        if (!hasFieldErrors) showUnexpectedError(error);
      },
    });
  };

  const resendVerificationEmail = () => {
    const credentials = credentialsRef.current;
    if (!credentials || resendCountdown.secondsLeft > 0) return;

    login.mutate(credentials, {
      // The user may have verified the email in the meantime.
      onSuccess: finishLogin,
      onError: (error: unknown) => {
        if (handleBlockingError(error, credentials)) return;

        const retryAfter = getRetryAfterSeconds(error);
        if (retryAfter) {
          resendCountdown.start(retryAfter);
          cooldown.start(retryAfter);
        }

        showUnexpectedError(error);
      },
    });
  };

  const backToForm = () => {
    credentialsRef.current = null;
    setBlocker(null);
  };

  return {
    handleSubmit,
    isLoading: login.isPending,
    blocker,
    lastEmail,
    resendVerificationEmail,
    resendSecondsLeft: resendCountdown.secondsLeft,
    cooldownSeconds: cooldown.secondsLeft,
    backToForm,
  };
};
