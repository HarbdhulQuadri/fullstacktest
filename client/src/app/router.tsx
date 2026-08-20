import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import UserManagementPage from '../pages/UserManagementPage';
import UserCreatePage from '../pages/UserCreatePage';
import UserEditPage from '../pages/UserEditPage';
import UserViewPage from '../pages/UserViewPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/users" replace /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'users/new', element: <UserCreatePage /> },
      { path: 'users/:id', element: <UserViewPage /> },
      { path: 'users/:id/edit', element: <UserEditPage /> },
      { path: 'admin', element: <AdminDashboardPage /> },
    ],
  },
]);
