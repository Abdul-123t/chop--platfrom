import type { ReactNode } from 'react';

type Tone = 'orange' | 'green' | 'neutral' | 'red';

const TONES: Record<Tone, string> = {
  orange: 'bg-[#E8772E]/15 text-[#B9441A] dark:text-[#E8772E]',
  green: 'bg-[#3FA66B]/15 text-[#2E7D50] dark:text-[#3FA66B]',
  neutral: 'bg-[#0E0D0B]/[0.06] dark:bg-white/[0.08] text-[#574F45] dark:text-[#A89F92]',
  red: 'bg-[#DC2626]/12 text-[#B91C1C] dark:text-[#F87171]',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${TONES[tone]}`}>
      {children}
    </span>
  );
}
