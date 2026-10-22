export const apiUrl =
  import.meta.env.VITE_API_URL || 'https://lavka-api.onrender.com/api';

type ApiResponseType = 'json' | 'text' | 'blob';

export interface ApiRequestOptions extends RequestInit {
  responseType?: ApiResponseType;
}

export const ACCESS_TOKEN_STORAGE_KEY = 'token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
// Role of the signed-in user, saved with the tokens so the UI knows it
// synchronously (e.g. not to request the cart for the admin).
export const AUTH_ROLE_STORAGE_KEY = 'authRole';

type TokenPair = {
  token: string;
  refreshToken: string;
};

// Login and refresh responses also carry the user.
type AuthTokens = TokenPair & { user?: { role?: string } };

export type DownloadedFile = {
  blob: Blob;
  fileName: string;
};

type ApiErrorPayload = {
  status?: number;
  message?: string;
  [key: string]: unknown;
};

// Fired whenever tokens are saved or cleared, so UI can re-read auth state.
export const AUTH_CHANGE_EVENT = 'auth:change';
// Fired when the session could not be refreshed and the user was logged out.
export const AUTH_LOGOUT_EVENT = 'auth:logout';

let refreshRequest: Promise<TokenPair | null> | null = null;

export const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

export const getAuthRole = () => localStorage.getItem(AUTH_ROLE_STORAGE_KEY);

export const saveAuthTokens = ({ token, refreshToken, user }: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  if (user?.role) localStorage.setItem(AUTH_ROLE_STORAGE_KEY, user.role);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

const expireSession = () => {
  clearAuthTokens();
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};

const hasResponseBody = (response: Response) =>
  response.status !== 204 &&
  response.status !== 205 &&
  response.headers.get('content-length') !== '0';

const isJsonResponse = (response: Response) =>
  (response.headers.get('content-type') || '').includes('application/json');

const createApiError = (message: string, status: number) => {
  const error = new Error(message) as Error & { status: number };
  error.status = status;

  return error;
};

const parseApiError = async (response: Response): Promise<never> => {
  if (isJsonResponse(response)) {
    const payload = (await response.json()) as ApiErrorPayload;

    throw {
      ...payload,
      status: payload.status ?? response.status,
    };
  }

  throw createApiError(await response.text(), response.status);
};

const buildHeaders = (headers?: HeadersInit, body?: BodyInit | null) => {
  const nextHeaders = new Headers(headers);
  const token = getAccessToken();

  if (token && !nextHeaders.has('Authorization')) {
    nextHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    !nextHeaders.has('Content-Type')
  ) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  return nextHeaders;
};

const sendRequest = (endpoint: string, options: ApiRequestOptions = {}) => {
  const { responseType, headers, body, ...requestOptions } = options;
  void responseType;

  return fetch(`${apiUrl}${endpoint}`, {
    ...requestOptions,
    body,
    headers: buildHeaders(headers, body),
  });
};

// 429 from /auth/refresh is a rate limit, not a lost session: wait and retry.
const MAX_REFRESH_ATTEMPTS = 3;
const MAX_REFRESH_WAIT_SECONDS = 30;

const getRetryAfterSeconds = async (response: Response) => {
  const header = Number(response.headers.get('Retry-After'));
  if (Number.isFinite(header) && header > 0) return header;

  try {
    const body = (await response.clone().json()) as {
      details?: { retryAfterSeconds?: number };
    };
    return body.details?.retryAfterSeconds || 1;
  } catch {
    return 1;
  }
};

const wait = (seconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));

const requestTokenRefresh = async (
  refreshToken: string,
  attempt = 1,
): Promise<TokenPair | null> => {
  const response = await fetch(`${apiUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  // 401 (INVALID_TOKEN, ACCOUNT_DISABLED) means the session is over.
  if (response.status === 401) {
    expireSession();
    return null;
  }

  if (response.status === 429) {
    if (attempt >= MAX_REFRESH_ATTEMPTS) return null;

    const seconds = await getRetryAfterSeconds(response);
    await wait(Math.min(seconds, MAX_REFRESH_WAIT_SECONDS));
    return requestTokenRefresh(refreshToken, attempt + 1);
  }

  // Other failures are transient, so the tokens are kept for a later retry.
  if (!response.ok) return null;

  const tokens = (await response.json()) as Partial<AuthTokens>;
  if (!tokens.token || !tokens.refreshToken) {
    expireSession();
    return null;
  }

  saveAuthTokens(tokens as AuthTokens);
  return tokens as TokenPair;
};

const refreshAccessToken = async (): Promise<TokenPair | null> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

  if (!refreshToken) {
    // Sessions created before refresh tokens existed cannot be renewed.
    if (getAccessToken()) expireSession();
    return null;
  }

  // Parallel 401s share one refresh request.
  if (!refreshRequest) {
    refreshRequest = requestTokenRefresh(refreshToken)
      .catch(() => null)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

const request = async (endpoint: string, options: ApiRequestOptions = {}) => {
  let response = await sendRequest(endpoint, options);

  // 401 UNAUTHORIZED means the access token is missing, invalid or expired.
  // 403 is a real permission error and is never retried.
  const canRefresh =
    response.status === 401 &&
    Boolean(getAccessToken()) &&
    !AUTH_ENDPOINTS.includes(endpoint);

  if (canRefresh && (await refreshAccessToken())) {
    response = await sendRequest(endpoint, options);
  }

  if (!response.ok) {
    await parseApiError(response);
  }

  return response;
};

export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const response = await request(endpoint, options);

  if (!hasResponseBody(response)) {
    return undefined as T;
  }

  if (options.responseType === 'blob') {
    return (await response.blob()) as T;
  }

  if (options.responseType === 'text' || !isJsonResponse(response)) {
    return (await response.text()) as T;
  }

  return (await response.json()) as T;
};

const getFileNameFromDisposition = (
  disposition: string | null,
  fallbackFileName: string,
) => {
  const utf8Match = disposition?.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const fileNameMatch = disposition?.match(/filename="?([^"]+)"?/i);

  return fileNameMatch?.[1] || fallbackFileName;
};

export const downloadApiFile = async (
  endpoint: string,
  fallbackFileName: string,
  options: ApiRequestOptions = {},
): Promise<DownloadedFile> => {
  const response = await request(endpoint, options);

  return {
    blob: await response.blob(),
    fileName: getFileNameFromDisposition(
      response.headers.get('content-disposition'),
      fallbackFileName,
    ),
  };
};
