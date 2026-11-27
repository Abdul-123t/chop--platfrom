import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { fieldClass, labelClass } from '../../../components/ui/styles';
import type { OrderStatus } from '../../../utils/orderStatus';

const QUICK_REASONS: Record<'REJECTED' | 'CANCELLED', string[]> = {
  REJECTED: ['Item sold out', 'Too busy right now', 'We are closed', 'Cannot deliver to that area'],
  CANCELLED: ['Customer asked to cancel', 'Item ran out', 'Customer not reachable', 'Delivery not possible'],
};

interface ReasonPickerProps {
  status: OrderStatus;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export function ReasonPicker({ status, busy, onCancel, onConfirm }: ReasonPickerProps) {
  const [reason, setReason] = useState('');
  const options = QUICK_REASONS[status === 'REJECTED' ? 'REJECTED' : 'CANCELLED'];
  const verb = status === 'REJECTED' ? 'Reject order' : 'Cancel order';

  return (
    <div className="space-y-2 pt-3 border-t border-[#0E0D0B]/[0.06] dark:border-white/[0.06]">
      <span className={labelClass}>Why? The customer will see this.</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setReason(option)}
            className={`rounded-full border px-3 py-1 text-[12px] font-semibold cursor-pointer transition-colors ${
              reason === option
                ? 'border-[#E8772E] bg-[#E8772E]/15 text-[#B9441A] dark:text-[#E8772E]'
                : 'border-[#0E0D0B]/15 dark:border-white/15 hover:border-[#E8772E]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <input
        aria-label="Reason"
        value={reason}
        maxLength={200}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Or type a reason"
        className={fieldClass}
      />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          Back
        </Button>
        <Button
          loading={busy}
          disabled={!reason.trim()}
          onClick={() => void onConfirm(reason.trim())}
          className="flex-1 !bg-[#DC2626] hover:!bg-[#B91C1C] !text-white"
        >
          {verb}
        </Button>
      </div>
    </div>
  );
}
