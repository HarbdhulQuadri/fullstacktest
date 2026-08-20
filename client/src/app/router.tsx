import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RequireAuth from '../components/RequireAuth';
import UserManagementPage from '../pages/UserManagementPage';
import UserCreatePage from '../pages/UserCreatePage';
import UserEditPage from '../pages/UserEditPage';
import UserViewPage from '../pages/UserViewPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import LoginPage from '../pages/LoginPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/users" replace /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'users/new', element: <UserCreatePage /> },
      { path: 'users/:id', element: <UserViewPage /> },
      { path: 'users/:id/edit', element: <UserEditPage /> },
      { path: 'admin', element: <AdminDashboardPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/users" replace /> },
]);
