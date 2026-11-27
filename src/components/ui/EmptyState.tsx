import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { mutedText } from './styles';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, children, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-10 px-4">
      <span className="w-11 h-11 rounded-full bg-[#E8772E]/12 text-[#E8772E] inline-flex items-center justify-center">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <div className="text-[15px] font-bold">{title}</div>
      {children && <div className={`max-w-sm text-[13px] ${mutedText}`}>{children}</div>}
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
