import type { SubscriberStats } from '../types';
import { cardClass, mutedText } from '../../components/ui/styles';

const TILES: Array<{ key: keyof SubscriberStats; label: string; accent?: boolean }> = [
  { key: 'total', label: 'Total' },
  { key: 'customers', label: 'Customers' },
  { key: 'vendors', label: 'Vendors' },
  { key: 'withEmail', label: 'With email' },
  { key: 'reachable', label: 'Reachable', accent: true },
  { key: 'unsubscribed', label: 'Unsubscribed' },
];

export function StatsBar({ stats }: { stats: SubscriberStats }) {
  return (
    <dl className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {TILES.map((tile) => (
        <div key={tile.key} className={`${cardClass} px-3 py-2`}>
          <dt className={`text-[11px] font-semibold uppercase tracking-wide ${mutedText}`}>{tile.label}</dt>
          <dd className={`text-xl font-extrabold tabular-nums ${tile.accent ? 'text-[#E8772E]' : ''}`}>
            {stats[tile.key].toLocaleString()}
          </dd>
        </div>
      ))}
    </dl>
  );
}
