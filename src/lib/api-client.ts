const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiClientError extends Error {
  statusCode?: number;
  data?: unknown;

  constructor(message: string, statusCode?: number, data?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Fallback to default message
      }
      throw new ApiClientError(errorMessage, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : 'Network error or backend is unavailable.';
    throw new ApiClientError(message);
  }
}

export { API_BASE_URL };

