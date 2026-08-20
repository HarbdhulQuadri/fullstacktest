import { apiFetch, setToken } from '../../lib/http';

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export async function login(credentials: LoginCredentials): Promise<string> {
  const result = await apiFetch<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    },
    { skipAuthRedirect: true },
  );
  setToken(result.access_token);
  return result.access_token;
}
