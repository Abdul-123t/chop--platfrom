import { LogOut, Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../../types';
import type { LiveStatus } from '../hooks/useAdminEvents';
import type { AdminTab } from '../types';
import { LiveIndicator } from './LiveIndicator';
import { Segmented } from '../../components/ui/Segmented';
import { Wordmark } from '../../components/ui/Wordmark';

interface AdminHeaderProps {
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogout: () => void;
  liveStatus: LiveStatus;
}

const iconButton =
  'inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#0E0D0B]/12 dark:border-white/12 text-[#574F45] dark:text-[#A89F92] hover:text-[#E8772E] hover:border-[#E8772E] transition-colors cursor-pointer';

export function AdminHeader({ tab, onTabChange, theme, onToggleTheme, onLogout, liveStatus }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F1E8]/90 dark:bg-[#0E0D0B]/90 backdrop-blur-xl border-b border-[#0E0D0B]/10 dark:border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Wordmark suffix="Admin" />
        <Segmented
          label="Admin sections"
          value={tab}
          onChange={onTabChange}
          options={[
            { value: 'subscribers', label: 'Waitlist' },
            { value: 'newsletter', label: 'Newsletter' },
          ]}
        />
        <div className="flex items-center gap-1.5">
          <LiveIndicator status={liveStatus} />
          <button
            type="button"
            onClick={onToggleTheme}
            className={iconButton}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Sign out of CHOP Admin?')) onLogout();
            }}
            className={iconButton}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
