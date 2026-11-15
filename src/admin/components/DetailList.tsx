import type { ReactNode } from 'react';
import { mutedText } from '../../components/ui/styles';

export type DetailRow = [label: string, value: ReactNode];

function isEmpty(value: ReactNode): boolean {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
}

export function DetailList({ rows }: { rows: DetailRow[] }) {
  const filled = rows.filter(([, value]) => !isEmpty(value));
  return (
    <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[13px]">
      {filled.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className={mutedText}>{label}</dt>
          <dd className="font-medium break-words whitespace-pre-line">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
