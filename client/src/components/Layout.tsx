import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, UserPlus, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuth } from '../features/auth/authSlice';
import { setToken } from '../lib/http';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector((s) => s.auth.email);

  const handleLogout = () => {
    setToken(null);
    dispatch(clearAuth());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Users className="h-4 w-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                Admin Panel
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <NavLink to="/admin" className={navLinkClass} end>
                Dashboard
              </NavLink>
              <NavLink to="/admin/users" className={navLinkClass}>
                Manage Users
              </NavLink>
              <Link to="/" className="btn-primary ml-2 border-transparent bg-slate-800 text-white hover:bg-slate-900">
                View Public Form
              </Link>
              {email && (
                <span className="ml-3 hidden text-sm text-slate-500 sm:inline">
                  {email}
                </span>
              )}
              <button onClick={handleLogout} className="icon-btn ml-2" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </main>
      </div>
  );
}
