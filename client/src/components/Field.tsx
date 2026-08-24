import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

export const inputClassName = 'input';

export function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: FieldError;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-rose-600">{error.message}</p>}
    </div>
  );
}
