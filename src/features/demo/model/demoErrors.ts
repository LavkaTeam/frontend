import { getErrorCode, getErrorDetails } from '@/utils/error';

import { demoCopy } from './demoCopy';

// Seconds a DEMO_CAPACITY_REACHED answer asks to wait: 600 when the sandbox
// ceiling is reached, 30 while the demo is still starting up.
export const getCapacityRetrySeconds = (error: unknown) => {
  const seconds = Number(getErrorDetails(error).retryAfterSeconds);

  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 0;
};

const STARTING_UP_MAX_SECONDS = 60;

/**
 * Text for the demo error codes, or undefined for any other error. Registered
 * with extractErrorMessage, so every toast and form shows the same words.
 */
export const getDemoErrorMessage = (error: unknown): string | undefined => {
  const details = getErrorDetails(error);

  switch (getErrorCode(error)) {
    case 'DEMO_READ_ONLY':
      return demoCopy.errors.readOnly;
    case 'DEMO_SESSION_EXPIRED':
      return demoCopy.errors.expired;
    case 'DEMO_LIMIT_REACHED':
      return demoCopy.errors.limit(
        String(details.limit ?? 'items'),
        Number(details.max),
      );
    case 'DEMO_CAPACITY_REACHED': {
      const seconds = getCapacityRetrySeconds(error);

      return seconds > 0 && seconds <= STARTING_UP_MAX_SECONDS
        ? demoCopy.errors.starting
        : demoCopy.errors.busy;
    }
    default:
      return undefined;
  }
};
