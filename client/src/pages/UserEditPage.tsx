import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCurrent, fetchUser, updateUser } from '../features/users/usersSlice';
import { userToFormValues } from '../features/users/types';
import { useToast } from '../components/ui/Toast';
import WizardForm from '../components/wizard/WizardForm';
import type { UserFormValues } from '../features/users/types';

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { current, loading, error } = useAppSelector((s) => s.users);

  useEffect(() => {
    if (id) void dispatch(fetchUser(id));
    return () => {
      dispatch(clearCurrent());
    };
  }, [id, dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!current) return <p className="text-gray-500">User not found.</p>;

  const onSubmit = (data: UserFormValues) => {
    if (!id) return Promise.resolve();
    return dispatch(updateUser({ id, data }))
      .then(() => {
        notify('User updated');
        navigate(`/users/${id}`);
      })
      .catch(() => notify('Failed to update user', 'error'));
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
        Edit User
      </h1>
      <WizardForm
        submitLabel="Update User"
        defaultValues={userToFormValues(current)}
        onSubmit={onSubmit}
      />
    </div>
  );
}
