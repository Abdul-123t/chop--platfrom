import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Wordmark } from './Wordmark';
import { mutedText } from './styles';

export interface DrawerNavItem<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface NavDrawerProps<T extends string> {
  open: boolean;
  onClose: () => void;
  title: string;
  items: DrawerNavItem<T>[];
  active: T;
  onSelect: (value: T) => void;
  footer?: ReactNode;
}

const line = 'border-[#0E0D0B]/10 dark:border-white/[0.08]';

export function NavItemBadge({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <span className="ml-auto min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-[#DC2626] text-white text-[11px] font-bold">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function NavDrawer<T extends string>({ open, onClose, title, items, active, onSelect, footer }: NavDrawerProps<T>) {
  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open} inert={!open}>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-[#0E0D0B]/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <nav
        aria-label={title}
        className={`absolute inset-y-0 left-0 w-[260px] max-w-[80vw] flex flex-col bg-[#F7F1E8] dark:bg-[#141210] border-r ${line} shadow-2xl transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`h-14 px-4 flex items-center justify-between border-b ${line}`}>
          <Wordmark />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={`p-1.5 rounded-full hover:text-[#E8772E] cursor-pointer ${mutedText}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="flex-1 p-2 space-y-1 overflow-y-auto">
          {items.map(({ value, label, icon: Icon, badge }) => {
            const selected = value === active;
            return (
              <li key={value}>
                <button
                  type="button"
                  aria-current={selected ? 'page' : undefined}
                  onClick={() => {
                    onSelect(value);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#E8772E] text-[#0E0D0B]'
                      : 'text-[#574F45] dark:text-[#A89F92] hover:bg-[#0E0D0B]/[0.05] dark:hover:bg-white/[0.05] hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                  <NavItemBadge count={badge} />
                </button>
              </li>
            );
          })}
        </ul>

        {footer && <div className={`p-3 border-t ${line}`}>{footer}</div>}
      </nav>
    </div>
  );
}
