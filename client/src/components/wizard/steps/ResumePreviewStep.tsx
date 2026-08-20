import { useFormContext } from 'react-hook-form';
import ResumeTemplate from '../ResumeTemplate';
import type { UserFormValues } from '../../../features/users/types';

export default function ResumePreviewStep() {
  const { getValues } = useFormContext<UserFormValues>();
  const values = getValues();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Resume Preview</h2>
      <ResumeTemplate values={values} />
    </div>
  );
}
