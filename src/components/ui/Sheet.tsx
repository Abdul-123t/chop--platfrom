import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { mutedText } from './styles';

interface SheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sheet({ title, onClose, children, footer }: SheetProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#0E0D0B]/55" />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#F7F1E8] dark:bg-[#141210] border border-[#0E0D0B]/10 dark:border-white/[0.08] shadow-2xl">
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#0E0D0B]/10 dark:border-white/[0.08]">
          <h2 className="text-[16px] font-extrabold tracking-tight truncate">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`p-1.5 rounded-full hover:text-[#E8772E] cursor-pointer ${mutedText}`}
          >
            <X className="w-4 h-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer && (
          <footer className="px-4 py-3 border-t border-[#0E0D0B]/10 dark:border-white/[0.08] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
