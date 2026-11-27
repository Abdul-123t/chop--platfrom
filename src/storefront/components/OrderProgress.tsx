import { Check, X } from 'lucide-react';
import { mutedText } from '../../components/ui/styles';
import { formatTime } from '../../utils/hours';
import { ORDER_STATUS_META, trackingSteps, type OrderStatus } from '../../utils/orderStatus';
import type { TrackedOrder } from '../types';

const STEP_LABELS: Partial<Record<OrderStatus, string>> = {
  PENDING: 'Order sent',
  ACCEPTED: 'Accepted and preparing',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'On the way',
  COMPLETED: 'Completed',
};

function readyBy(order: TrackedOrder): string {
  if (!order.acceptedAt || !order.prepTimeMinutes) return '';
  const ready = new Date(new Date(order.acceptedAt).getTime() + order.prepTimeMinutes * 60_000 + 60 * 60_000);
  return formatTime(`${String(ready.getUTCHours()).padStart(2, '0')}:${String(ready.getUTCMinutes()).padStart(2, '0')}`);
}

export function OrderProgress({ order }: { order: TrackedOrder }) {
  if (order.status === 'REJECTED' || order.status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 pb-1">
        <span className="w-8 h-8 rounded-full bg-[#DC2626] text-white inline-flex items-center justify-center">
          <X className="w-4 h-4" aria-hidden="true" />
        </span>
        <span className="text-[15px] font-bold">{ORDER_STATUS_META[order.status].label}</span>
      </div>
    );
  }

  const steps = trackingSteps(order.fulfilment);
  const current = steps.indexOf(order.status);
  const eta = readyBy(order);

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const done = index < current || order.status === 'COMPLETED';
        const active = index === current && order.status !== 'COMPLETED';
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[12px] font-bold ${
                  done
                    ? 'bg-[#3FA66B] text-white'
                    : active
                      ? 'bg-[#E8772E] text-[#0E0D0B] ring-4 ring-[#E8772E]/25'
                      : 'border-2 border-[#0E0D0B]/15 dark:border-white/15'
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : index + 1}
              </span>
              {index < steps.length - 1 && (
                <span className={`w-0.5 flex-1 min-h-5 ${done ? 'bg-[#3FA66B]' : 'bg-[#0E0D0B]/10 dark:bg-white/10'}`} />
              )}
            </div>
            <div className="pb-4 pt-1">
              <div className={`text-[14px] ${active ? 'font-extrabold' : done ? 'font-semibold' : mutedText}`}>
                {STEP_LABELS[step]}
              </div>
              {active && step === 'ACCEPTED' && eta && <div className={`text-[12px] ${mutedText}`}>Expected ready around {eta}</div>}
              {active && step === 'PENDING' && (
                <div className={`text-[12px] ${mutedText}`}>The vendor will accept or decline shortly.</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
