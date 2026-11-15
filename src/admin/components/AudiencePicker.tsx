import type { AudienceKind } from '../types';
import { Segmented } from '../../components/ui/Segmented';
import { labelClass, mutedText } from '../../components/ui/styles';

interface AudiencePickerProps {
  value: AudienceKind;
  onChange: (value: AudienceKind) => void;
  selectedCount: number;
  recipientCount: number;
}

export function AudiencePicker({ value, onChange, selectedCount, recipientCount }: AudiencePickerProps) {
  return (
    <div>
      <span className={labelClass}>Send to</span>
      <div className="flex flex-wrap items-center gap-2">
        <Segmented<AudienceKind>
          label="Audience"
          value={value}
          onChange={onChange}
          options={[
            { value: 'all', label: 'Everyone' },
            { value: 'customers', label: 'Customers' },
            { value: 'vendors', label: 'Vendors' },
            { value: 'selected', label: `Selected (${selectedCount})`, disabled: selectedCount === 0 },
          ]}
        />
        <span className={`text-[12px] font-semibold ${mutedText}`}>
          <span className="text-[#E8772E]">{recipientCount.toLocaleString()}</span> will receive it
        </span>
      </div>
    </div>
  );
}
