export const apiUrl =
  import.meta.env.VITE_API_URL || 'https://lavka-api.onrender.com/api';

type ApiResponseType = 'json' | 'text' | 'blob';

export interface ApiRequestOptions extends RequestInit {
  responseType?: ApiResponseType;
}

export type DownloadedFile = {
  blob: Blob;
  fileName: string;
};

type ApiErrorPayload = {
  status?: number;
  message?: string;
  [key: string]: unknown;
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
  const token = localStorage.getItem('token');

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

const request = async (
  endpoint: string,
  options: ApiRequestOptions = {},
) => {
  const { responseType, headers, body, ...requestOptions } = options;
  void responseType;
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...requestOptions,
    body,
    headers: buildHeaders(headers, body),
  });

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
