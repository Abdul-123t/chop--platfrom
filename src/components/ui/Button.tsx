import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-[#E8772E] hover:bg-[#B9441A] text-[#0E0D0B] active:scale-[0.98]',
  secondary:
    'border border-[#0E0D0B]/15 dark:border-white/15 hover:border-[#E8772E] text-[#0E0D0B] dark:text-[#F7F1E8]',
  ghost: 'text-[#574F45] dark:text-[#A89F92] hover:text-[#E8772E] dark:hover:text-[#E8772E]',
};

export function Button({
  variant = 'primary',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
}
