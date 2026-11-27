import { LogOut } from 'lucide-react';
import { mutedText } from './styles';

export function SignOutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold hover:text-[#DC2626] cursor-pointer ${mutedText}`}
    >
      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
      Sign out
    </button>
  );
}
