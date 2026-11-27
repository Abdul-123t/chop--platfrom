import type { FormEvent, ReactNode } from 'react';
import { Wordmark } from '../../../components/ui/Wordmark';
import { cardClass, mutedText } from '../../../components/ui/styles';

interface AuthCardProps {
  title: string;
  subtitle: string;
  onSubmit?: (event: FormEvent) => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, onSubmit, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 gap-4">
      <form onSubmit={onSubmit} className={`${cardClass} w-full max-w-sm p-6 space-y-4`} noValidate>
        <div className="space-y-1.5">
          <a href="/" className="inline-block" aria-label="CHOP home">
            <Wordmark suffix="Vendor" />
          </a>
          <h1 className="text-[20px] font-extrabold tracking-tight pt-2">{title}</h1>
          <p className={`text-[13px] ${mutedText}`}>{subtitle}</p>
        </div>
        {children}
      </form>
      {footer && <div className={`text-[13px] text-center ${mutedText}`}>{footer}</div>}
    </div>
  );
}
