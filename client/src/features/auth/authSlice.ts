import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { decodeToken, getToken } from '../../lib/http';
import { login as loginRequest } from './authApi';

interface AuthState {
  token: string | null;
  email: string | null;
}

function loadInitialState(): AuthState {
  const token = getToken();
  if (!token) {
    return { token: null, email: null };
  }
  return { token, email: decodeToken(token)?.email ?? null };
}

const initialState: AuthState = loadInitialState();

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const token = await loginRequest(credentials);
    const email = decodeToken(token)?.email ?? null;
    return { token, email };
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.token = null;
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
    });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
