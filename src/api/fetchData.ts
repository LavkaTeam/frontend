const apiUrl: string = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const fetchData = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJsonResponse = contentType.includes('application/json');
  const hasBody =
    response.status !== 204 &&
    response.status !== 205 &&
    response.headers.get('content-length') !== '0';

  if (!response.ok) {
    if (isJsonResponse) {
      throw await response.json();
    }

    throw new Error(await response.text());
  }

  if (!hasBody) {
    return undefined as T;
  }

  if (isJsonResponse) {
    return response.json() as Promise<T>;
  }

  return (await response.text()) as T;
};

export { fetchData };
