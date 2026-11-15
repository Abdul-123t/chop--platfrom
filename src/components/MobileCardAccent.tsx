import { LucideIcon } from 'lucide-react';
import { CHOP_CONFIG } from '../config';

interface MobileCardAccentProps {
  icon: LucideIcon;
}

export function MobileCardAccent({ icon: Icon }: MobileCardAccentProps) {
  return (
    <div className="mobile-card-accent" aria-hidden="true">
      <span className="font-display text-sm font-semibold tracking-[0.3em] text-[#F7F1E8]/55">
        {CHOP_CONFIG.brandName}
      </span>
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8772E]/40 bg-[#E8772E]/10 text-[#E8772E]">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}
