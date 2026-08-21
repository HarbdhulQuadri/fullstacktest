import { useFormContext, Controller } from 'react-hook-form';
import type { UserFormValues } from '../../../features/users/types';
import { Field, inputClassName } from '../../Field';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactStep() {
  const {
    register,
    control,
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
        <Controller
          name="userContact.phoneNumber"
          control={control}
          rules={{ required: 'Phone number is required' }}
          render={({ field }) => (
            <PhoneInput
              {...field}
              className={`${inputClassName} !p-0 [&_input]:border-none [&_input]:bg-transparent [&_input]:p-2.5 [&_input]:outline-none [&_.PhoneInputCountry]:pl-3`}
              defaultCountry="US"
            />
          )}
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
