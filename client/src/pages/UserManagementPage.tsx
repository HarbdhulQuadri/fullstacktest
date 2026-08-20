import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, UserPlus, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { deleteUser, fetchUsers } from '../features/users/usersSlice';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export default function UserManagementPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.users);
  const navigate = useNavigate();
  const { notify } = useToast();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(
    null,
  );

  useEffect(() => {
    void dispatch(fetchUsers({ page: 1, limit: 50 }));
  }, [dispatch]);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const name = pendingDelete.name;
    void dispatch(deleteUser(pendingDelete.id)).then(() => {
      notify(`${name} deleted`);
      setPendingDelete(null);
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Manage all user records</p>
        </div>
        <Link to="/users/new" className="btn-primary">
          <UserPlus className="h-4 w-4" />
          New User
        </Link>
      </div>

      {error && (
        <div className="card mb-4 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-sm text-slate-500">No users yet. Create your first record.</p>
            <Link to="/users/new" className="btn-primary">
              <UserPlus className="h-4 w-4" />
              New User
            </Link>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards */}
            <div className="block md:hidden divide-y divide-slate-100">
              {items.map((u) => (
                <div key={u.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-900">{u.firstName} {u.lastName}</p>
                      <p className="text-sm text-slate-600">{u.contact.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Country: {u.address.country}</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <button onClick={() => navigate(`/admin/users/${u.id}`)} className="btn-ghost flex-1 text-xs py-1.5">
                      <Eye className="h-4 w-4" /> View
                    </button>
                    <button onClick={() => navigate(`/admin/users/${u.id}/edit`)} className="btn-ghost flex-1 text-xs py-1.5">
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button onClick={() => setPendingDelete({ id: u.id, name: `${u.firstName} ${u.lastName}` })} className="btn-danger flex-1 text-xs py-1.5">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <table className="hidden md:table w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Country</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((u) => (
                <tr key={u.id} className="transition hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{u.contact.email}</td>
                  <td className="px-5 py-3 text-slate-600">{u.address.country}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        className="icon-btn"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                        className="icon-btn"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          setPendingDelete({ id: u.id, name: `${u.firstName} ${u.lastName}` })
                        }
                        className="icon-btn hover:bg-rose-50 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete user"
        message={
          pendingDelete
            ? `Are you sure you want to delete ${pendingDelete.name}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
