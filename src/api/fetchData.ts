const apiUrl: string =
  import.meta.env.VITE_API_URL || 'https://lavka-api.onrender.com/api';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const fetchData = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const response = await fetch(`${apiUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

export { fetchData };
