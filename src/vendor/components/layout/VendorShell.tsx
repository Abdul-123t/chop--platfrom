import { useCallback, useState, type ReactNode } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { LiveIndicator } from '../../../components/ui/LiveIndicator';
import { NavDrawer } from '../../../components/ui/NavDrawer';
import { SignOutButton } from '../../../components/ui/SignOutButton';
import { Wordmark } from '../../../components/ui/Wordmark';
import type { LiveStatus } from '../../../hooks/useLiveEvents';
import { useTheme } from '../../../hooks/useTheme';
import { confirmVendorSignOut, VENDOR_NAV } from '../../navigation';
import type { VendorSection } from '../../types';
import { VendorSidebar } from './VendorSidebar';

interface VendorShellProps {
  section: VendorSection;
  onNavigate: (section: VendorSection) => void;
  businessName: string;
  liveStatus: LiveStatus;
  pendingOrders: number;
  onLogout: () => void;
  children: ReactNode;
}

const iconButton =
  'inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#0E0D0B]/12 dark:border-white/12 text-[#574F45] dark:text-[#A89F92] hover:text-[#E8772E] hover:border-[#E8772E] transition-colors cursor-pointer';

export function VendorShell({
  section,
  onNavigate,
  businessName,
  liveStatus,
  pendingOrders,
  onLogout,
  children,
}: VendorShellProps) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const items = VENDOR_NAV.map((item) => (item.value === 'orders' ? { ...item, badge: pendingOrders } : item));
  const signOut = () => confirmVendorSignOut(onLogout);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#F7F1E8]/90 dark:bg-[#0E0D0B]/90 backdrop-blur-xl border-b border-[#0E0D0B]/10 dark:border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`${iconButton} md:hidden relative`}
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
              {pendingOrders > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#DC2626] ring-2 ring-[#F7F1E8] dark:ring-[#0E0D0B]" />
              )}
            </button>
            <Wordmark suffix="Vendor" />
            <span className="hidden sm:block text-[13px] font-semibold text-[#574F45] dark:text-[#A89F92] truncate">
              {businessName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <LiveIndicator status={liveStatus} className="hidden md:inline-flex" />
            <button
              type="button"
              onClick={toggleTheme}
              className={iconButton}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <NavDrawer
        open={menuOpen}
        onClose={closeMenu}
        title="Store sections"
        items={items}
        active={section}
        onSelect={onNavigate}
        footer={
          <div className="flex items-center justify-between gap-2">
            <LiveIndicator status={liveStatus} className="inline-flex" />
            <SignOutButton onClick={signOut} />
          </div>
        }
      />

      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-4 md:grid md:grid-cols-[210px_minmax(0,1fr)] md:gap-6">
        <VendorSidebar items={items} active={section} onSelect={onNavigate} onSignOut={signOut} />
        <main className="min-w-0 space-y-3">{children}</main>
      </div>
    </>
  );
}
