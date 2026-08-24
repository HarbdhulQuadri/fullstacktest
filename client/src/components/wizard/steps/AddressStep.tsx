import { useFormContext } from 'react-hook-form';
import type { UserFormValues } from '../../../features/users/types';
import { Field, inputClassName } from '../../Field';

export default function AddressStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserFormValues>();

  const a = errors.userAddress;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Address</h2>

      <Field label="Address" required error={a?.address}>
        <input
          className={inputClassName}
          {...register('userAddress.address', { required: 'Address is required' })}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="City" required error={a?.city}>
          <input
            className={inputClassName}
            {...register('userAddress.city', { required: 'City is required' })}
          />
        </Field>
        <Field label="State" required error={a?.state}>
          <input
            className={inputClassName}
            {...register('userAddress.state', { required: 'State is required' })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Country" required error={a?.country}>
          <select
            className={inputClassName}
            {...register('userAddress.country', { required: 'Country is required' })}
          >
            <option value="">Select country...</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Nigeria">Nigeria</option>
            <option value="South Africa">South Africa</option>
            <option value="India">India</option>
            <option value="Japan">Japan</option>
            <option value="Brazil">Brazil</option>
            <option value="Mexico">Mexico</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Zip Code" required error={a?.zipCode}>
          <input
            className={inputClassName}
            {...register('userAddress.zipCode', { required: 'Zip code is required' })}
          />
        </Field>
      </div>
    </div>
  );
}
