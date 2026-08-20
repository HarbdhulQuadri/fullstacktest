import { useFieldArray, useFormContext } from 'react-hook-form';
import type { UserAcademic, UserFormValues } from '../../../features/users/types';
import { Field, inputClassName } from '../../Field';

export default function AcademicsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UserFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'userAcademics',
  });

  const name = (key: keyof UserAcademic, i: number) =>
    `userAcademics.${i}.${key}` as const;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Academic Background</h2>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 mb-3">No schools added yet.</p>
      )}

      {fields.map((field, index) => {
        const itemErr = errors.userAcademics?.[index];
        return (
          <div key={field.id} className="border border-gray-200 rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">School #{index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-sm text-red-600"
              >
                Remove
              </button>
            </div>

            <Field label="School Name" required error={itemErr?.schoolName}>
              <input
                className={inputClassName}
                {...register(name('schoolName', index), {
                  required: 'School name is required',
                })}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Degree" error={itemErr?.degree}>
                <input
                  className={inputClassName}
                  {...register(name('degree', index))}
                />
              </Field>
              <Field label="Field of Study" error={itemErr?.fieldOfStudy}>
                <input
                  className={inputClassName}
                  {...register(name('fieldOfStudy', index))}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date" error={itemErr?.startDate}>
                <input
                  type="date"
                  className={inputClassName}
                  {...register(name('startDate', index))}
                />
              </Field>
              <Field label="End Date" error={itemErr?.endDate}>
                <input
                  type="date"
                  className={inputClassName}
                  {...register(name('endDate', index))}
                />
              </Field>
            </div>

            <Field label="Description" error={itemErr?.description}>
              <textarea
                className={inputClassName}
                rows={2}
                {...register(name('description', index))}
              />
            </Field>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          append({
            schoolName: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            description: '',
          })
        }
        className="px-4 py-2 rounded bg-indigo-100 text-indigo-700 text-sm"
      >
        + Add School
      </button>
    </div>
  );
}
