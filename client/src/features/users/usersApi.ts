import type { User, UserFormValues, UserFormValuesPayload } from './types';
import { toApiPayload } from './types';
import { apiFetch } from '../../lib/http';

export const usersApi = {
  list: () => apiFetch<User[]>('/users'),
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
