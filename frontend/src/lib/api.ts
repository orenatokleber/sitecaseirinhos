const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  json?: any;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request(path: string, options: RequestOptions = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const headers = new Headers(options.headers);

  // Inject JWT access token if present
  const token = localStorage.getItem('caseirinhos_access_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.json) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.json);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Attempt Token Refresh
    const refreshToken = localStorage.getItem('caseirinhos_refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const tokens = await refreshResponse.json();
          localStorage.setItem('caseirinhos_access_token', tokens.accessToken);
          localStorage.setItem('caseirinhos_refresh_token', tokens.refreshToken);

          // Retry original request with new token
          headers.set('Authorization', `Bearer ${tokens.accessToken}`);
          const retryResponse = await fetch(url, { ...options, headers });
          
          if (!retryResponse.ok) {
            const errData = await retryResponse.json().catch(() => ({}));
            throw new ApiError(errData.error || 'Erro na requisição', retryResponse.status);
          }
          return await retryResponse.json();
        }
      } catch (refreshErr) {
        // Failed to refresh - log out user
        localStorage.removeItem('caseirinhos_access_token');
        localStorage.removeItem('caseirinhos_refresh_token');
        window.dispatchEvent(new Event('auth-expired'));
      }
    }
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new ApiError(errData.error || 'Erro na requisição', response.status);
  }

  // Handle empty responses
  if (response.status === 204) return null;
  return await response.json();
}

export const apiClient = {
  get: (path: string, options?: RequestOptions) => request(path, { ...options, method: 'GET' }),
  post: (path: string, json?: any, options?: RequestOptions) => request(path, { ...options, method: 'POST', json }),
  put: (path: string, json?: any, options?: RequestOptions) => request(path, { ...options, method: 'PUT', json }),
  delete: (path: string, options?: RequestOptions) => request(path, { ...options, method: 'DELETE' }),
};
