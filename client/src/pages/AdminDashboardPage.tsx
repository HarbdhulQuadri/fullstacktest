import { useEffect, useState } from 'react';
import { FileText, FileType, FileDown, Users, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { deleteUser, fetchUsers } from '../features/users/usersSlice';
import { exportUserPdf } from '../features/export/pdf';
import { exportUserDocx } from '../features/export/docx';
import { useToast } from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';
import ResumeTemplate from '../components/wizard/ResumeTemplate';
import { userToFormValues } from '../features/users/types';
import type { User } from '../features/users/types';

function TableSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-52 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          <div className="ml-auto flex gap-2">
            <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Users className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-slate-500">No users found</p>
      <p className="text-xs text-slate-400">Submitted resumes will appear here.</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error, page, total, limit } = useAppSelector((s) => s.users);
  const { notify } = useToast();
  const [selected, setSelected] = useState<User | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    void dispatch(fetchUsers({ page: newPage, limit: 10 }));
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    setDeleting(true);
    void dispatch(deleteUser(pendingDelete.id))
      .then(() => {
        notify(`${pendingDelete.firstName} ${pendingDelete.lastName} deleted`);
        if (selected?.id === pendingDelete.id) setSelected(null);
      })
      .catch(() => notify('Failed to delete user', 'error'))
      .finally(() => {
        setDeleting(false);
        setPendingDelete(null);
      });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Review submissions and export records</p>
      </div>

      {error && (
        <div className="card mb-4 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      )}

      <div className="card overflow-x-auto">
        {loading ? (
          <TableSkeleton />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto min-w-[800px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Country</th>
                    <th className="px-5 py-3 text-right font-medium">Export / Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelected(u)}
                      className={`cursor-pointer transition hover:bg-slate-50/60 ${
                        selected?.id === u.id ? 'bg-indigo-50/60' : ''
                      }`}
                    >
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{u.contact.email}</td>
                      <td className="px-5 py-3 text-slate-600">{u.address.country}</td>
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              void exportUserPdf(u)
                                .then(() => notify('PDF exported'))
                                .catch((err: unknown) =>
                                  notify(err instanceof Error ? err.message : 'PDF export failed', 'error'),
                                )
                            }
                            className="btn-ghost px-3 py-1.5 text-rose-600 hover:bg-rose-50"
                          >
                            <FileText className="h-4 w-4" />
                            PDF
                          </button>
                          <button
                            onClick={() =>
                              void exportUserDocx(u)
                                .then(() => notify('DOCX exported'))
                                .catch((err: unknown) =>
                                  notify(err instanceof Error ? err.message : 'DOCX export failed', 'error'),
                                )
                            }
                            className="btn-ghost px-3 py-1.5 text-blue-600 hover:bg-blue-50"
                          >
                            <FileType className="h-4 w-4" />
                            DOCX
                          </button>
                          <button
                            onClick={() => setPendingDelete(u)}
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
            
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {items.map((u) => (
                <div 
                  key={u.id} 
                  onClick={() => setSelected(u)} 
                  className={`flex flex-col gap-3 cursor-pointer rounded-xl border p-4 transition-all ${
                    selected?.id === u.id ? 'border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-300' : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{u.firstName} {u.lastName}</h3>
                      <p className="text-sm text-slate-500">{u.contact.email}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md text-slate-600">{u.address.country}</span>
                  </div>
                  <div className="flex gap-2 justify-end border-t border-slate-100 pt-3 mt-1">
                    <button onClick={(e) => { e.stopPropagation(); void exportUserPdf(u).catch(() => {}); }} className="btn-ghost px-2 py-1 text-xs text-rose-600 hover:bg-rose-50">
                      <FileText className="h-4 w-4 mr-1"/> PDF
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); void exportUserDocx(u).catch(() => {}); }} className="btn-ghost px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
                      <FileType className="h-4 w-4 mr-1"/> DOCX
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setPendingDelete(u); }} className="icon-btn ml-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600">
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && items.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <span className="text-sm text-slate-500">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} users
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="btn-ghost disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => handlePageChange(page + 1)}
                className="btn-ghost disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Preview: {selected.firstName} {selected.lastName}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  void exportUserPdf(selected)
                    .then(() => notify('PDF exported'))
                    .catch((err: unknown) =>
                      notify(err instanceof Error ? err.message : 'PDF export failed', 'error'),
                    )
                }
                className="btn-ghost text-rose-600 hover:bg-rose-50"
              >
                <FileDown className="h-4 w-4" />
                Download PDF
              </button>
              <button
                onClick={() =>
                  void exportUserDocx(selected)
                    .then(() => notify('DOCX exported'))
                    .catch((err: unknown) =>
                      notify(err instanceof Error ? err.message : 'DOCX export failed', 'error'),
                    )
                }
                className="btn-ghost text-blue-600 hover:bg-blue-50"
              >
                <FileDown className="h-4 w-4" />
                Download DOCX
              </button>
            </div>
          </div>
          <ResumeTemplate values={userToFormValues(selected)} />
        </div>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete user"
        message="Are you sure? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
