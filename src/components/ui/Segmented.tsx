interface Option<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex flex-wrap gap-1 p-1 rounded-full bg-[#0E0D0B]/8 dark:bg-white/[0.06] border border-[#0E0D0B]/8 dark:border-white/[0.06]"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              active
                ? 'bg-[#E8772E] text-[#0E0D0B] shadow-sm'
                : 'text-[#574F45] dark:text-[#A89F92] hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
