import { Search } from 'lucide-react';
import type { SubscriberStatus, TypeFilter } from '../types';
import { STATUS_META } from '../utils/status';
import type { SubscriberFilters } from '../utils/subscribers';
import { Segmented } from '../../components/ui/Segmented';
import { fieldClass, mutedText } from '../../components/ui/styles';

interface SubscriberFiltersBarProps {
  filters: SubscriberFilters;
  onChange: (filters: SubscriberFilters) => void;
}

export function SubscriberFiltersBar({ filters, onChange }: SubscriberFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 basis-full sm:basis-[220px] min-w-0">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${mutedText}`} aria-hidden="true" />
        <input
          type="search"
          aria-label="Search waitlist"
          placeholder="Search name, email, phone, area"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          className={`${fieldClass} pl-8`}
        />
      </div>
      <Segmented<TypeFilter>
        label="Filter by type"
        value={filters.type}
        onChange={(type) => onChange({ ...filters, type })}
        options={[
          { value: 'all', label: 'All' },
          { value: 'customer', label: 'Customers' },
          { value: 'vendor', label: 'Vendors' },
        ]}
      />
      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value as 'all' | SubscriberStatus })}
        className={`${fieldClass} sm:max-w-max py-1.5 text-[12px] font-semibold`}
      >
        <option value="all">All statuses</option>
        {(Object.keys(STATUS_META) as SubscriberStatus[]).map((status) => (
          <option key={status} value={status}>
            {STATUS_META[status].label}
          </option>
        ))}
      </select>
      <label className={`inline-flex items-center gap-1.5 text-[12px] font-semibold cursor-pointer ${mutedText}`}>
        <input
          type="checkbox"
          checked={filters.emailOnly}
          onChange={(event) => onChange({ ...filters, emailOnly: event.target.checked })}
          className="accent-[#E8772E] w-3.5 h-3.5"
        />
        Reachable by email
      </label>
    </div>
  );
}
