import { useNavigate } from 'react-router-dom';
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
      .then(() => {
        notify('User created');
        navigate('/users');
      })
      .catch(() => notify('Failed to create user', 'error'));
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
        Create User
      </h1>
      <WizardForm
        storageKey="user-create-wizard"
        submitLabel="Save User"
        onSubmit={onSubmit}
      />
    </div>
  );
}
