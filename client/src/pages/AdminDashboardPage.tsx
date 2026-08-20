import { useEffect, useState } from 'react';
import { FileText, FileType, FileDown, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUsers } from '../features/users/usersSlice';
import { exportUserPdf } from '../features/export/pdf';
import { exportUserDocx } from '../features/export/docx';
import { useToast } from '../components/ui/Toast';
import ResumeTemplate from '../components/wizard/ResumeTemplate';
import { userToFormValues } from '../features/users/types';
import type { User } from '../features/users/types';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.users);
  const { notify } = useToast();
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">Review submissions and export records</p>
      </div>

      {error && (
        <div className="card mb-4 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
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
            <p className="text-sm text-slate-500">No submissions yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Country</th>
                <th className="px-5 py-3 text-right font-medium">Export</th>
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
                         onClick={() => {
                           void exportUserPdf(u)
                             .then(() => notify('PDF exported'))
                             .catch(() => notify('PDF export failed'));
                         }}
                         className="btn-ghost px-3 py-1.5 text-rose-600 hover:bg-rose-50"
                       >
                         <FileText className="h-4 w-4" />
                         PDF
                       </button>
                       <button
                         onClick={() => {
                           void exportUserDocx(u)
                             .then(() => notify('DOCX exported'))
                             .catch(() => notify('DOCX export failed'));
                         }}
                         className="btn-ghost px-3 py-1.5 text-blue-600 hover:bg-blue-50"
                       >
                        <FileType className="h-4 w-4" />
                        DOCX
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                onClick={() => {
                  void exportUserPdf(selected)
                    .then(() => notify('PDF exported'))
                    .catch(() => notify('PDF export failed'));
                }}
                className="btn-ghost text-rose-600 hover:bg-rose-50"
              >
                <FileDown className="h-4 w-4" />
                Download PDF
              </button>
              <button
                onClick={() => {
                  void exportUserDocx(selected)
                    .then(() => notify('DOCX exported'))
                    .catch(() => notify('DOCX export failed'));
                }}
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
    </div>
  );
}
