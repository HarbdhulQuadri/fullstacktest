import type { User, UserFormValues, UserFormValuesPayload, PaginatedUsers } from './types';
import { toApiPayload } from './types';
import { apiFetch } from '../../lib/http';

export const usersApi = {
  list: (page = 1, limit = 50) => apiFetch<PaginatedUsers>(`/users?page=${page}&limit=${limit}`),
  get: (id: string) => apiFetch<User>(`/users/${id}`),
  create: (data: UserFormValuesPayload) =>
    apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(toApiPayload(data as UserFormValues)),
    }),
  update: (id: string, data: UserFormValuesPayload) =>
    apiFetch<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toApiPayload(data as UserFormValues)),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/users/${id}`, { method: 'DELETE' }),
};
