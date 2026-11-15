import type { NewsletterLogEntry } from '../types';
import { formatDateTime } from '../utils/format';
import { Badge } from '../../components/ui/Badge';
import { mutedText } from '../../components/ui/styles';

interface NewsletterHistoryProps {
  entries: NewsletterLogEntry[];
  loading: boolean;
  error: string | null;
}

export function NewsletterHistory({ entries, loading, error }: NewsletterHistoryProps) {
  if (error) return <div className="text-[13px] text-[#B91C1C] dark:text-[#F87171]">{error}</div>;
  if (loading && entries.length === 0) return <div className={`text-[13px] ${mutedText}`}>Loading…</div>;
  if (entries.length === 0) return <div className={`text-[13px] ${mutedText}`}>No newsletters sent yet.</div>;

  return (
    <ul className="divide-y divide-[#0E0D0B]/[0.06] dark:divide-white/[0.05]">
      {entries.map((entry) => (
        <li key={entry.id} className="py-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">{entry.subject}</div>
            <div className={`text-[12px] ${mutedText}`}>
              {formatDateTime(entry.sentAt)} · {entry.audience}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Badge tone="green">{entry.delivered} sent</Badge>
            {entry.failed > 0 && <Badge tone="red">{entry.failed} failed</Badge>}
          </div>
        </li>
      ))}
    </ul>
  );
}
