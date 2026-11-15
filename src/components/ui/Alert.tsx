import type { ReactNode } from 'react';

type Tone = 'error' | 'success' | 'info';

const TONES: Record<Tone, string> = {
  error: 'border-[#DC2626]/30 bg-[#DC2626]/[0.08] text-[#B91C1C] dark:text-[#F87171]',
  success: 'border-[#3FA66B]/30 bg-[#3FA66B]/[0.1] text-[#2E7D50] dark:text-[#3FA66B]',
  info: 'border-[#E8772E]/30 bg-[#E8772E]/[0.08] text-[#B9441A] dark:text-[#E8772E]',
};

export function Alert({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border px-3 py-2 text-[13px] font-medium ${TONES[tone]}`}
    >
      {children}
    </div>
  );
}
