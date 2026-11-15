import type { Subscriber } from '../types';
import { formatDate } from '../utils/format';
import { displayName } from '../utils/subscribers';
import { Badge } from '../../components/ui/Badge';
import { mutedText } from '../../components/ui/styles';

interface SubscriberTableProps {
  subscribers: Subscriber[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], select: boolean) => void;
}

const th = `px-2.5 py-2 text-left text-[11px] font-bold uppercase tracking-wide ${mutedText}`;
const td = 'px-2.5 py-2 align-top text-[13px]';

export function SubscriberTable({ subscribers, selected, onToggle, onToggleAll }: SubscriberTableProps) {
  const ids = subscribers.map((subscriber) => subscriber.id);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));

  if (subscribers.length === 0) {
    return <div className={`py-8 text-center text-[13px] ${mutedText}`}>No one matches these filters.</div>;
  }

  return (
    <div className="overflow-x-auto -mx-4">
      <table className="w-full min-w-[760px] border-collapse">
        <thead className="border-b border-[#0E0D0B]/10 dark:border-white/[0.08]">
          <tr>
            <th className={`${th} w-8 pl-4`}>
              <input
                type="checkbox"
                aria-label="Select all shown"
                checked={allSelected}
                onChange={(event) => onToggleAll(ids, event.target.checked)}
                className="accent-[#E8772E] w-3.5 h-3.5"
              />
            </th>
            <th className={th}>Name</th>
            <th className={th}>Type</th>
            <th className={th}>Email</th>
            <th className={th}>WhatsApp</th>
            <th className={th}>Area</th>
            <th className={th}>Status</th>
            <th className={`${th} pr-4`}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <tr
              key={subscriber.id}
              className={`border-b border-[#0E0D0B]/[0.06] dark:border-white/[0.05] last:border-0 ${
                selected.has(subscriber.id) ? 'bg-[#E8772E]/[0.06]' : 'hover:bg-[#0E0D0B]/[0.03] dark:hover:bg-white/[0.03]'
              }`}
            >
              <td className={`${td} pl-4`}>
                <input
                  type="checkbox"
                  aria-label={`Select ${displayName(subscriber)}`}
                  checked={selected.has(subscriber.id)}
                  onChange={() => onToggle(subscriber.id)}
                  className="accent-[#E8772E] w-3.5 h-3.5"
                />
              </td>
              <td className={td}>
                <div className="font-semibold leading-tight">{displayName(subscriber) || '—'}</div>
                {subscriber.type === 'vendor' && subscriber.businessName && (
                  <div className={`text-[12px] ${mutedText}`}>{subscriber.name}</div>
                )}
              </td>
              <td className={td}>
                <Badge tone={subscriber.type === 'vendor' ? 'orange' : 'neutral'}>
                  {subscriber.type === 'vendor' ? 'Vendor' : 'Customer'}
                </Badge>
              </td>
              <td className={td}>
                {subscriber.email ? (
                  <div className="flex items-center gap-1.5">
                    <span className="break-all">{subscriber.email}</span>
                    {!subscriber.subscribed && <Badge tone="red">Unsubscribed</Badge>}
                  </div>
                ) : (
                  <span className={mutedText}>—</span>
                )}
              </td>
              <td className={`${td} whitespace-nowrap tabular-nums`}>{subscriber.whatsapp}</td>
              <td className={td}>{subscriber.area}</td>
              <td className={td}>
                <span className={mutedText}>{subscriber.status || '—'}</span>
              </td>
              <td className={`${td} pr-4 whitespace-nowrap ${mutedText}`}>{formatDate(subscriber.joinedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
