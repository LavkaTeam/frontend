import type { ApiErrorCode } from '@/types/apiError';

const collectMessages = (value: unknown): string[] => {
  if (!value) {
    return [];
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMessages(item));
  }

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    const priorityKeys = [
      'message',
      'error',
      'details',
      'detail',
      'description',
      'title',
      'reason',
    ];

    const messages = priorityKeys.flatMap((key) =>
      collectMessages(objectValue[key]),
    );

    if (messages.length > 0) {
      return messages;
    }

    // `code` and `status` are machine-readable, never user-facing text.
    return Object.entries(objectValue)
      .filter(([key]) => key !== 'code' && key !== 'status')
      .flatMap(([, item]) => collectMessages(item));
  }

  return [];
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const errorRecord = error as Record<string, unknown>;
  const status = errorRecord.status ?? errorRecord.statusCode;

  return typeof status === 'number' ? status : undefined;
};

// Branch on this, never on the error text.
const getErrorCode = (error: unknown): ApiErrorCode | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const code = (error as Record<string, unknown>).code;

  return typeof code === 'string' ? (code as ApiErrorCode) : undefined;
};

// `details` object of coded errors, e.g. retryAfterSeconds for 429 or
// missingFields for COMPANY_NOT_VERIFIED.
const getErrorDetails = (error: unknown): Record<string, unknown> => {
  if (!error || typeof error !== 'object') return {};

  const details = (error as Record<string, unknown>).details;

  return details && typeof details === 'object'
    ? (details as Record<string, unknown>)
    : {};
};

// Seconds to wait after 429 TOO_MANY_REQUESTS; 0 for any other error.
const getRetryAfterSeconds = (error: unknown) => {
  if (getErrorCode(error) !== 'TOO_MANY_REQUESTS') return 0;

  const seconds = Number(getErrorDetails(error).retryAfterSeconds);

  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 60;
};

const isSellerNotVerifiedError = (error: unknown) =>
  getErrorCode(error) === 'SELLER_NOT_VERIFIED';

// fetch() rejects with a TypeError when the request never reached the server.
const isNetworkError = (error: unknown) => error instanceof TypeError;

// React Query retry policy: only network and server failures can succeed on a
// retry; a 4xx answer will not change.
const retryOnServerError = (failureCount: number, error: unknown) => {
  const status = getErrorStatus(error);
  const isRetryable =
    isNetworkError(error) || status === undefined || status >= 500;

  return isRetryable && failureCount < 3;
};

const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Check your internet connection and try again.';

// Messages from responses without a `code` that carry no useful information.
const GENERIC_MESSAGES = [
  /unexpected error/i,
  /internal server error/i,
  /^(forbidden|unauthorized|bad request|not found)$/i,
];

const toDisplayMessage = (message: string) => {
  const trimmed = message.trim();

  // Non-JSON error pages (HTML, stack traces) are useless to show.
  if (!trimmed || trimmed.startsWith('<') || trimmed.length > 300) {
    return '';
  }

  return GENERIC_MESSAGES.some((pattern) => pattern.test(trimmed))
    ? ''
    : trimmed;
};

const getRawErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return collectMessages(error)[0] || '';
};

const extractErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) => {
  if (isNetworkError(error)) {
    return NETWORK_ERROR_MESSAGE;
  }

  const code = getErrorCode(error);
  if (code === 'INTERNAL_ERROR') {
    return fallback;
  }

  // Coded errors carry text the backend marks as safe to show (e.g. 503
  // EMAIL_DELIVERY_FAILED). Uncoded 5xx responses do not.
  const status = getErrorStatus(error);
  if (!code && status !== undefined && status >= 500) {
    return fallback;
  }

  return toDisplayMessage(getRawErrorMessage(error)) || fallback;
};

const getErrorFieldMessage = (error: unknown, field: string) => {
  // Field errors only come as a plain JSON body. Error instances carry
  // inherited properties such as `name` ("TypeError") that are not fields.
  if (
    !error ||
    typeof error !== 'object' ||
    error instanceof Error ||
    !Object.prototype.hasOwnProperty.call(error, field)
  ) {
    return '';
  }

  const value = (error as Record<string, unknown>)[field];

  return toDisplayMessage(collectMessages(value)[0] || '');
};

export {
  extractErrorMessage,
  getErrorCode,
  getErrorDetails,
  getErrorFieldMessage,
  getRetryAfterSeconds,
  getErrorStatus,
  isSellerNotVerifiedError,
  retryOnServerError,
};
