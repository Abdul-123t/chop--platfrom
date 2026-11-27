import type { ReactNode } from 'react';
import { labelClass, mutedText } from './styles';

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <div className="mt-1 text-[12px] font-medium text-[#B91C1C] dark:text-[#F87171]">{error}</div>
      ) : (
        hint && <div className={`mt-1 text-[12px] ${mutedText}`}>{hint}</div>
      )}
    </div>
  );
}
