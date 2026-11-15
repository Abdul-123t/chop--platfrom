import { useMemo, useState } from 'react';
import { Download, Mail, RefreshCw } from 'lucide-react';
import type { SubscribersOverview } from '../types';
import { downloadCsv } from '../utils/csv';
import { plural } from '../utils/format';
import { filterSubscribers, type SubscriberFilters } from '../utils/subscribers';
import { StatsBar } from './StatsBar';
import { SubscriberFiltersBar } from './SubscriberFiltersBar';
import { SubscriberTable } from './SubscriberTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { mutedText } from '../../components/ui/styles';

const PAGE_SIZE = 50;

interface SubscribersViewProps {
  overview: SubscribersOverview;
  loading: boolean;
  onReload: () => void;
  selected: Set<string>;
  onSelectedChange: (selected: Set<string>) => void;
  onEmailSelected: () => void;
}

export function SubscribersView({
  overview,
  loading,
  onReload,
  selected,
  onSelectedChange,
  onEmailSelected,
}: SubscribersViewProps) {
  const [filters, setFilters] = useState<SubscriberFilters>({ query: '', type: 'all', emailOnly: false });
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => filterSubscribers(overview.subscribers, filters), [overview.subscribers, filters]);
  const shown = filtered.slice(0, limit);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedChange(next);
  };

  const toggleAll = (ids: string[], select: boolean) => {
    const next = new Set(selected);
    for (const id of ids) {
      if (select) next.add(id);
      else next.delete(id);
    }
    onSelectedChange(next);
  };

  const exportRows = selected.size > 0 ? overview.subscribers.filter((s) => selected.has(s.id)) : filtered;

  return (
    <div className="space-y-3">
      <StatsBar stats={overview.stats} />
      <Card
        title="Waitlist"
        actions={
          <>
            {selected.size > 0 && (
              <>
                <span className={`text-[12px] font-semibold ${mutedText}`}>{selected.size} selected</span>
                <Button variant="ghost" onClick={() => onSelectedChange(new Set())}>
                  Clear
                </Button>
                <Button icon={<Mail className="w-3.5 h-3.5" aria-hidden="true" />} onClick={onEmailSelected}>
                  Email selected
                </Button>
              </>
            )}
            <Button
              variant="secondary"
              icon={<Download className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={() => downloadCsv(exportRows, `chop-waitlist-${new Date().toISOString().slice(0, 10)}.csv`)}
              disabled={exportRows.length === 0}
            >
              Export CSV
            </Button>
            <Button
              variant="secondary"
              loading={loading}
              icon={<RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={onReload}
            >
              Refresh
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <SubscriberFiltersBar
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setLimit(PAGE_SIZE);
            }}
          />
          <div className={`text-[12px] ${mutedText}`}>
            Showing {plural(shown.length, 'person')} of {filtered.length.toLocaleString()}
          </div>
          <SubscriberTable subscribers={shown} selected={selected} onToggle={toggle} onToggleAll={toggleAll} />
          {filtered.length > shown.length && (
            <div className="flex justify-center">
              <Button variant="secondary" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
                Show more
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
