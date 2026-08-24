import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAppDispatch } from '../app/hooks';
import { createUser } from '../features/users/usersSlice';
import { useToast } from '../components/ui/Toast';
import WizardForm from '../components/wizard/WizardForm';
import type { UserFormValues } from '../features/users/types';

export default function UserCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notify } = useToast();

  const onSubmit = (data: UserFormValues) => {
    return dispatch(createUser(data))
      .unwrap()
      .then(() => {
        notify('User created');
        navigate('/success');
      })
      .catch((error: any) => {
        notify(error?.message || 'Failed to create user', 'error');
        throw error;
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col">
      <div className="flex justify-end p-4 sm:absolute sm:top-4 sm:right-4 z-50">
        <Link to="/admin" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200 transition-all">
          <Shield className="h-4 w-4 text-indigo-500" />
          <span className="hidden sm:inline">Admin Dashboard</span>
          <span className="sm:hidden">Admin</span>
        </Link>
      </div>
      <div className="flex-1 px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Submit Your Resume
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Please fill out the details below to submit your application.
            </p>
          </div>
        <WizardForm
          storageKey="user-create-wizard"
          submitLabel="Submit Application"
          onSubmit={onSubmit}
        />
        </div>
      </div>
    </div>
  );
}
