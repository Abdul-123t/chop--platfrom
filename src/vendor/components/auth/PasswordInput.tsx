import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { fieldClass, mutedText } from '../../../components/ui/styles';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  autoFocus?: boolean;
}

export function PasswordInput({ id, value, onChange, autoComplete, autoFocus }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:text-[#E8772E] cursor-pointer ${mutedText}`}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
