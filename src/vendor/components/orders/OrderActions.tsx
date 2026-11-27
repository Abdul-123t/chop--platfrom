import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { fieldClass, labelClass } from '../../../components/ui/styles';
import { ACTION_LABELS, type OrderStatus } from '../../../utils/orderStatus';
import type { StatusChange, VendorOrder } from '../../types';
import { ReasonPicker } from './ReasonPicker';

const PREP_TIMES = [10, 15, 20, 30, 45, 60, 90];

interface OrderActionsProps {
  order: VendorOrder;
  defaultPrepTime: number;
  busy: boolean;
  onChange: (change: StatusChange) => Promise<boolean>;
}

export function OrderActions({ order, defaultPrepTime, busy, onChange }: OrderActionsProps) {
  const [closing, setClosing] = useState<OrderStatus | null>(null);
  const [prepTime, setPrepTime] = useState(PREP_TIMES.includes(defaultPrepTime) ? defaultPrepTime : 30);
  const closeStatus = order.nextStatuses.find((status) => status === 'REJECTED' || status === 'CANCELLED');
  const forward = order.nextStatuses.filter((status) => status !== 'REJECTED' && status !== 'CANCELLED');

  if (closing) {
    return (
      <ReasonPicker
        status={closing}
        busy={busy}
        onCancel={() => setClosing(null)}
        onConfirm={async (reason) => {
          if (await onChange({ status: closing, reason })) setClosing(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-2 pt-1 border-t border-[#0E0D0B]/[0.06] dark:border-white/[0.06]">
      {order.status === 'PENDING' && (
        <div className="pt-2">
          <label htmlFor={`prep-${order.id}`} className={labelClass}>
            Ready in
          </label>
          <select
            id={`prep-${order.id}`}
            value={prepTime}
            onChange={(event) => setPrepTime(Number(event.target.value))}
            className={`${fieldClass} py-2`}
          >
            {PREP_TIMES.map((minutes) => (
              <option key={minutes} value={minutes}>
                About {minutes} minutes
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-wrap gap-2 pt-1">
        {forward.map((status, index) => (
          <Button
            key={status}
            variant={index === 0 ? 'primary' : 'secondary'}
            loading={busy}
            icon={<Check className="w-3.5 h-3.5" aria-hidden="true" />}
            onClick={() => void onChange(status === 'ACCEPTED' ? { status, prepTimeMinutes: prepTime } : { status })}
            className="flex-1 min-w-[130px]"
          >
            {ACTION_LABELS[status]}
          </Button>
        ))}
        {closeStatus && (
          <Button
            variant="ghost"
            disabled={busy}
            icon={<X className="w-3.5 h-3.5" aria-hidden="true" />}
            onClick={() => setClosing(closeStatus)}
            className="hover:!text-[#DC2626]"
          >
            {ACTION_LABELS[closeStatus]}
          </Button>
        )}
      </div>
    </div>
  );
}
