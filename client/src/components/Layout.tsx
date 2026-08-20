import { Link, NavLink, Outlet } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';
import { ToastProvider } from './ui/Toast';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Layout() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/users" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Users className="h-4 w-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                UserManager
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <NavLink to="/users" className={navLinkClass} end>
                Users
              </NavLink>
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
              <Link to="/users/new" className="btn-primary ml-2">
                <UserPlus className="h-4 w-4" />
                New User
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}
