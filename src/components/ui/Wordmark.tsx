import { CHOP_CONFIG } from '../../config';

export function Wordmark({ suffix }: { suffix?: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-display text-lg font-extrabold tracking-tight whitespace-nowrap">
      <span>{CHOP_CONFIG.brandName}</span>
      <span className="inline-block w-2 h-2 rounded-full bg-[#E8772E] translate-y-[-1px]" aria-hidden="true" />
      {suffix && (
        <span className="ml-1 hidden min-[420px]:inline-flex rounded-full border border-[#0E0D0B]/12 dark:border-white/12 bg-[#0E0D0B]/[0.05] dark:bg-white/[0.06] px-2 py-0.5 text-[12px] font-semibold text-[#574F45] dark:text-[#A89F92]">
          {suffix}
        </span>
      )}
    </span>
  );
}
