import { mutedText } from './styles';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <label className={`flex items-start justify-between gap-3 ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold">{label}</span>
        {description && <span className={`block text-[12px] ${mutedText}`}>{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed ${
          checked ? 'bg-[#3FA66B]' : 'bg-[#0E0D0B]/20 dark:bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  );
}
