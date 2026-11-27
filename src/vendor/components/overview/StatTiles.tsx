import { cardClass, mutedText } from '../../../components/ui/styles';
import { formatNaira } from '../../../utils/money';
import type { VendorStats } from '../../types';

export function StatTiles({ stats }: { stats: VendorStats }) {
  const tiles = [
    { label: 'Orders today', value: stats.today.orders.toLocaleString() },
    { label: 'Sales today', value: formatNaira(stats.today.sales), accent: true },
    { label: 'In progress', value: stats.active.toLocaleString() },
    { label: 'Sales, 7 days', value: formatNaira(stats.week.sales) },
  ];

  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {tiles.map((tile) => (
        <div key={tile.label} className={`${cardClass} px-3 py-2.5 min-w-0`}>
          <dt className={`text-[11px] font-semibold uppercase tracking-wide truncate ${mutedText}`}>{tile.label}</dt>
          <dd className={`text-xl font-extrabold tabular-nums truncate ${tile.accent ? 'text-[#E8772E]' : ''}`}>{tile.value}</dd>
        </div>
      ))}
    </dl>
  );
}
