import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCurrent, fetchUser } from '../features/users/usersSlice';
import { userToFormValues } from '../features/users/types';
import ResumeTemplate from '../components/wizard/ResumeTemplate';

export default function UserViewPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">User Resume</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/admin/users/${current.id}/edit`)}
            className="px-3 py-2 rounded bg-indigo-600 text-white text-sm"
          >
            Edit
          </button>
          <Link
            to="/admin/users"
            className="px-3 py-2 rounded bg-gray-200 text-sm"
          >
            Back to list
          </Link>
        </div>
      </div>
      <ResumeTemplate values={userToFormValues(current)} />
    </div>
  );
}
