import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  label: string;
  onChange: (quantity: number) => void;
  compact?: boolean;
}

export function QuantityStepper({ quantity, label, onChange, compact }: QuantityStepperProps) {
  const size = compact ? 'w-7 h-7' : 'w-8 h-8';
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[#E8772E]/12 p-0.5">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`Remove one ${label}`}
        className={`${size} rounded-full inline-flex items-center justify-center text-[#B9441A] dark:text-[#E8772E] hover:bg-[#E8772E]/20 cursor-pointer`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="min-w-6 text-center text-[14px] font-bold tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label={`Add one ${label}`}
        className={`${size} rounded-full inline-flex items-center justify-center bg-[#E8772E] text-[#0E0D0B] hover:bg-[#B9441A] cursor-pointer`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
