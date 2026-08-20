import type { User, UserFormValues, UserFormValuesPayload } from './types';
import { toApiPayload } from './types';

const BASE = import.meta.env.VITE_API_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY;

const authHeaders: Record<string, string> = API_KEY
  ? { 'x-api-key': API_KEY as string }
  : {};

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export const usersApi = {
  list: () =>
    fetch(`${BASE}/users`, { headers: authHeaders }).then((r) =>
      handle<User[]>(r),
    ),
  get: (id: string) =>
    fetch(`${BASE}/users/${id}`, { headers: authHeaders }).then((r) =>
      handle<User>(r),
    ),
  create: (data: UserFormValuesPayload) =>
    fetch(`${BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(toApiPayload(data as UserFormValues)),
    }).then((r) => handle<User>(r)),
  update: (id: string, data: UserFormValuesPayload) =>
    fetch(`${BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(toApiPayload(data as UserFormValues)),
    }).then((r) => handle<User>(r)),
  remove: (id: string) =>
    fetch(`${BASE}/users/${id}`, { method: 'DELETE', headers: authHeaders }).then(
      (r) => {
        if (!r.ok) throw new Error('Delete failed');
        return true;
      },
    ),
};
