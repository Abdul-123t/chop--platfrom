import { useState, type FormEvent } from 'react';
import { Copy } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { fieldClass, mutedText } from '../../../components/ui/styles';
import { DAY_NAMES, type DayHours } from '../../../utils/hours';
import { useProfileSaver } from '../../hooks/useProfileSaver';
import type { VendorProfile } from '../../types';
import { SaveRow } from './SaveRow';

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function HoursSection({ vendor }: { vendor: VendorProfile }) {
  const { save, pending, error, savedAt } = useProfileSaver();
  const [hours, setHours] = useState<DayHours[]>(vendor.hours);
  const [baseline, setBaseline] = useState(() => JSON.stringify(vendor.hours));
  const dirty = JSON.stringify(hours) !== baseline;

  const update = (day: number, patch: Partial<DayHours>) =>
    setHours((current) => current.map((entry) => (entry.day === day ? { ...entry, ...patch } : entry)));

  const copyMondayToAll = () => {
    const monday = hours.find((entry) => entry.day === 1);
    if (!monday) return;
    setHours((current) => current.map((entry) => ({ ...entry, open: monday.open, close: monday.close, closed: monday.closed })));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await save({ hours })) setBaseline(JSON.stringify(hours));
  };

  return (
    <Card
      title="Opening hours"
      actions={
        <button
          type="button"
          onClick={copyMondayToAll}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#E8772E] hover:bg-[#E8772E]/10 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          Copy Monday to all
        </button>
      }
    >
      <form onSubmit={submit} className="space-y-2">
        <p className={`text-[12px] ${mutedText}`}>Lagos time. If you close after midnight, set the closing time on the next day, e.g. 6pm to 2am.</p>
        <ul className="space-y-1.5">
          {WEEK_ORDER.map((day) => {
            const entry = hours.find((value) => value.day === day);
            if (!entry) return null;
            return (
              <li key={day} className="flex flex-wrap items-center gap-2 rounded-xl px-2 py-1.5 bg-[#0E0D0B]/[0.03] dark:bg-white/[0.03]">
                <span className="w-24 text-[13px] font-semibold">{DAY_NAMES[day]}</span>
                <label className={`inline-flex items-center gap-1.5 text-[12px] font-semibold cursor-pointer ${mutedText}`}>
                  <input
                    type="checkbox"
                    checked={!entry.closed}
                    onChange={(event) => update(day, { closed: !event.target.checked })}
                    className="accent-[#E8772E] w-4 h-4"
                  />
                  Open
                </label>
                {entry.closed ? (
                  <span className={`text-[13px] ${mutedText}`}>Closed</span>
                ) : (
                  <span className="flex items-center gap-1.5 ml-auto">
                    <input
                      type="time"
                      aria-label={`${DAY_NAMES[day]} opens`}
                      value={entry.open}
                      onChange={(event) => update(day, { open: event.target.value })}
                      className={`${fieldClass} w-auto py-1.5 tabular-nums`}
                    />
                    <span className={mutedText}>to</span>
                    <input
                      type="time"
                      aria-label={`${DAY_NAMES[day]} closes`}
                      value={entry.close}
                      onChange={(event) => update(day, { close: event.target.value })}
                      className={`${fieldClass} w-auto py-1.5 tabular-nums`}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <SaveRow dirty={dirty} pending={pending} error={error} saved={savedAt !== null} />
      </form>
    </Card>
  );
}
