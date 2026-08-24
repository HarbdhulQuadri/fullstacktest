import { useFormContext } from 'react-hook-form';
import type { UserFormValues } from '../../../features/users/types';
import { Field, inputClassName } from '../../Field';

export default function PersonalInfoStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<UserFormValues>();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

      <Field label="Profile Photo URL" error={errors.userInfo?.profilePhoto}>
        <div className="flex items-center gap-4">
          <input
            type="url"
            className={`${inputClassName} flex-1`}
            placeholder="https://example.com/photo.jpg"
            {...register('userInfo.profilePhoto')}
          />
          {watch('userInfo.profilePhoto') && (
            <img 
              src={watch('userInfo.profilePhoto') || undefined} 
              alt="Preview" 
              className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
            />
          )}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" required error={errors.userInfo?.firstName}>
          <input
            className={inputClassName}
            {...register('userInfo.firstName', {
              required: 'First name is required',
              maxLength: { value: 100, message: 'Max 100 characters' },
            })}
          />
        </Field>
        <Field label="Last Name" required error={errors.userInfo?.lastName}>
          <input
            className={inputClassName}
            {...register('userInfo.lastName', {
              required: 'Last name is required',
              maxLength: { value: 100, message: 'Max 100 characters' },
            })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date of Birth" required error={errors.userInfo?.dob}>
          <input
            type="date"
            className={inputClassName}
            {...register('userInfo.dob', { required: 'Date of birth is required' })}
          />
        </Field>
        <Field label="Gender" required error={errors.userInfo?.gender}>
          <select
            className={inputClassName}
            {...register('userInfo.gender', { required: 'Gender is required' })}
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </Field>
      </div>

      <Field label="Occupation" error={errors.userInfo?.occupation}>
        <input
          className={inputClassName}
          {...register('userInfo.occupation', {
            maxLength: { value: 100, message: 'Max 100 characters' },
          })}
        />
      </Field>
    </div>
  );
}
