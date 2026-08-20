import { useFormContext } from 'react-hook-form';
import type { UserFormValues } from '../../../features/users/types';
import { Field, inputClassName } from '../../Field';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserFormValues>();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

      <Field label="Email" required error={errors.userContact?.email}>
        <input
          type="email"
          className={inputClassName}
          {...register('userContact.email', {
            required: 'Email is required',
            pattern: { value: EMAIL_RE, message: 'Enter a valid email address' },
          })}
        />
      </Field>

      <Field label="Phone Number" required error={errors.userContact?.phoneNumber}>
        <input
          className={inputClassName}
          {...register('userContact.phoneNumber', {
            required: 'Phone number is required',
          })}
        />
      </Field>

      <Field label="Fax (optional)" error={errors.userContact?.fax}>
        <input className={inputClassName} {...register('userContact.fax')} />
      </Field>

      <Field label="LinkedIn URL (optional)" error={errors.userContact?.linkedInUrl}>
        <input className={inputClassName} {...register('userContact.linkedInUrl')} />
      </Field>
    </div>
  );
}
