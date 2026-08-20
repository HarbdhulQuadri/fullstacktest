import { useFormContext } from 'react-hook-form';
import ResumeTemplate from '../ResumeTemplate';
import type { UserFormValues } from '../../../features/users/types';

export default function ConfirmStep() {
  const { getValues } = useFormContext<UserFormValues>();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Confirm &amp; Submit</h2>
      <p className="text-sm text-gray-600 mb-4">
        Please review the resume below, then click <span className="font-semibold">Save</span> to
        submit the record.
      </p>
      <ResumeTemplate values={getValues()} />
    </div>
  );
}
