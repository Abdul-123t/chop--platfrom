import type { ReactNode } from 'react';
import { mutedText } from '../../components/ui/styles';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 pb-1">
      <div className="min-w-0">
        <h1 className="text-[22px] font-extrabold tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className={`text-[13px] ${mutedText}`}>{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
