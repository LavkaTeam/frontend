import { useCallback } from 'react';

import { useToast } from '@/hooks/useToast';
import {
  extractErrorMessage,
  getErrorCode,
  getErrorDetails,
} from '@/utils/error';

import { formatMissingField } from './adminDisplay';

// Text for a failed admin action, shown inside the dialog that started it.
export const getAdminActionError = (error: unknown) => {
  const message = extractErrorMessage(
    error,
    'The action could not be completed. Please try again.',
  );

  if (getErrorCode(error) === 'PROFILE_INCOMPLETE') {
    const missing = getErrorDetails(error).missingFields;

    if (Array.isArray(missing) && missing.length > 0) {
      return `${message} Missing: ${missing.map((field) => formatMissingField(String(field))).join(', ')}.`;
    }
  }

  return message;
};

/**
 * Toast after an admin decision. The backend emails the user and never undoes
 * the decision when the email fails, so `emailSent: false` is a warning, not
 * an error of the action itself.
 */
export const useAdminFeedback = () => {
  const { showToast } = useToast();

  return useCallback(
    (message: string, emailSent?: boolean) => {
      if (emailSent === false) {
        showToast(
          `${message} The notification email could not be sent.`,
          'error',
        );
        return;
      }

      showToast(message, 'success');
    },
    [showToast],
  );
};
