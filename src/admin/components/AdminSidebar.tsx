import { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';
import { Wordmark } from '../../components/ui/Wordmark';
import { mutedText } from '../../components/ui/styles';
import type { LiveStatus } from '../hooks/useAdminEvents';
import { ADMIN_NAV, confirmSignOut } from '../navigation';
import type { AdminTab } from '../types';
import { LiveIndicator } from './LiveIndicator';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  liveStatus: LiveStatus;
  onLogout: () => void;
}

export function AdminSidebar({ open, onClose, tab, onTabChange, liveStatus, onLogout }: AdminSidebarProps) {
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
    <div
      className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-[#0E0D0B]/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <nav
        aria-label="Admin sections"
        className={`absolute inset-y-0 left-0 w-[260px] max-w-[80vw] flex flex-col bg-[#F7F1E8] dark:bg-[#141210] border-r border-[#0E0D0B]/10 dark:border-white/[0.08] shadow-2xl transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#0E0D0B]/10 dark:border-white/[0.08]">
          <Wordmark suffix="Admin" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={`p-1.5 rounded-full hover:text-[#E8772E] cursor-pointer ${mutedText}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="flex-1 p-2 space-y-1">
          {ADMIN_NAV.map(({ value, label, icon: Icon }) => {
            const active = value === tab;
            return (
              <li key={value}>
                <button
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => {
                    onTabChange(value);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#E8772E] text-[#0E0D0B]'
                      : 'text-[#574F45] dark:text-[#A89F92] hover:bg-[#0E0D0B]/[0.05] dark:hover:bg-white/[0.05] hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="p-3 flex items-center justify-between gap-2 border-t border-[#0E0D0B]/10 dark:border-white/[0.08]">
          <LiveIndicator status={liveStatus} className="inline-flex" />
          <button
            type="button"
            onClick={() => confirmSignOut(onLogout)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold hover:text-[#DC2626] cursor-pointer ${mutedText}`}
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </nav>
    </div>
  );
}
