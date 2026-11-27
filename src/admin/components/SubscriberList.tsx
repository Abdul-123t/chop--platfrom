import type { Subscriber } from '../types';
import { formatDate } from '../utils/format';
import { STATUS_META } from '../utils/status';
import { displayName } from '../utils/subscribers';
import { Badge } from '../../components/ui/Badge';
import { mutedText } from '../../components/ui/styles';

interface SubscriberListProps {
  subscribers: Subscriber[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], select: boolean) => void;
  onOpen: (id: string) => void;
}

const checkbox = 'accent-[#E8772E] w-4 h-4 shrink-0';

export function SubscriberList({ subscribers, selected, onToggle, onToggleAll, onOpen }: SubscriberListProps) {
  const ids = subscribers.map((subscriber) => subscriber.id);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));

  return (
    <div className="space-y-2">
      <label className={`flex items-center gap-2 text-[12px] font-semibold cursor-pointer ${mutedText}`}>
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(event) => onToggleAll(ids, event.target.checked)}
          className={checkbox}
        />
        Select all shown
      </label>
      <ul className="space-y-2">
        {subscribers.map((subscriber) => {
          const isSelected = selected.has(subscriber.id);
          return (
            <li
              key={subscriber.id}
              className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 ${
                isSelected
                  ? 'border-[#E8772E]/40 bg-[#E8772E]/[0.06]'
                  : 'border-[#0E0D0B]/[0.08] dark:border-white/[0.06]'
              }`}
            >
              <input
                type="checkbox"
                aria-label={`Select ${displayName(subscriber)}`}
                checked={isSelected}
                onChange={() => onToggle(subscriber.id)}
                className={`${checkbox} mt-0.5`}
              />
              <button
                type="button"
                onClick={() => onOpen(subscriber.id)}
                className="flex-1 min-w-0 text-left cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold leading-tight truncate">
                      {displayName(subscriber) || '—'}
                    </div>
                    {subscriber.type === 'vendor' && subscriber.businessName && (
                      <div className={`text-[12px] truncate ${mutedText}`}>{subscriber.name}</div>
                    )}
                  </div>
                  <span className={`text-[11px] whitespace-nowrap ${mutedText}`}>{formatDate(subscriber.joinedAt)}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Badge tone={subscriber.type === 'vendor' ? 'orange' : 'neutral'}>
                    {subscriber.type === 'vendor' ? 'Vendor' : 'Customer'}
                  </Badge>
                  <Badge tone={STATUS_META[subscriber.status].tone}>{STATUS_META[subscriber.status].label}</Badge>
                  {subscriber.email && !subscriber.subscribed && <Badge tone="red">Unsubscribed</Badge>}
                </div>
                <div className={`mt-1.5 text-[12px] space-y-0.5 ${mutedText}`}>
                  {subscriber.email && <div className="break-all">{subscriber.email}</div>}
                  <div className="tabular-nums">
                    {subscriber.whatsapp}
                    {subscriber.area && ` · ${subscriber.area}`}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
