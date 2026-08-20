const BASE = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export interface ApiError extends Error {
  status: number;
}

/**
 * Minimal authenticated fetch wrapper.
 * - Attaches the JWT as `Authorization: Bearer` when present.
 * - On 401 (unless `skipAuthRedirect`), clears the session and sends the user
 *   to the login page.
 * - Parses the backend's `{ error, code, message }` envelope into the thrown
 *   error's message.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  options: { skipAuthRedirect?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE}${path}`, { ...init, headers });

  if (response.status === 401 && !options.skipAuthRedirect) {
    setToken(null);
    if (window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
    const error = new Error('Session expired. Please sign in again.') as ApiError;
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let message = text || `Request failed with status ${response.status}`;
    try {
      const parsed = JSON.parse(text) as { message?: string };
      if (parsed?.message) {
        message = parsed.message;
      }
    } catch {
      /* keep raw text */
    }
    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Decode the JWT payload (client-side, unverified) for display only. */
export function decodeToken(
  token: string,
): { sub: string; email: string } | null {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as { sub: string; email: string };
  } catch {
    return null;
  }
}
