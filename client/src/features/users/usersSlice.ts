import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { usersApi } from './usersApi';
import type { User, UserFormValues } from './types';

interface UsersState {
  items: User[];
  current: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', () => usersApi.list());
export const fetchUser = createAsyncThunk('users/fetchOne', (id: string) => usersApi.get(id));
export const createUser = createAsyncThunk('users/create', (data: UserFormValues) =>
  usersApi.create(data),
);
export const updateUser = createAsyncThunk(
  'users/update',
  ({ id, data }: { id: string; data: UserFormValues }) => usersApi.update(id, data),
);
export const deleteUser = createAsyncThunk('users/delete', async (id: string) => {
  await usersApi.remove(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Failed to load users';
      })
      .addCase(fetchUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload;
      })
      .addCase(fetchUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Failed to load user';
      })
      .addCase(createUser.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.current = a.payload;
        s.items = s.items.map((u) => (u.id === a.payload.id ? a.payload : u));
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.items = s.items.filter((u) => u.id !== a.payload);
      });
  },
});

export const { clearCurrent } = usersSlice.actions;
export default usersSlice.reducer;
