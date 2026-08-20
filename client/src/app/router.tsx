import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RequireAuth from '../components/RequireAuth';
import UserManagementPage from '../pages/UserManagementPage';
import UserCreatePage from '../pages/UserCreatePage';
import UserEditPage from '../pages/UserEditPage';
import UserViewPage from '../pages/UserViewPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import LoginPage from '../pages/LoginPage';
import SuccessPage from '../pages/SuccessPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <UserCreatePage /> },
  { path: '/success', element: <SuccessPage /> },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'users/:id', element: <UserViewPage /> },
      { path: 'users/:id/edit', element: <UserEditPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
