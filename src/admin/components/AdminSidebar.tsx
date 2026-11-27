import { LiveIndicator } from '../../components/ui/LiveIndicator';
import { NavDrawer } from '../../components/ui/NavDrawer';
import { SignOutButton } from '../../components/ui/SignOutButton';
import type { LiveStatus } from '../../hooks/useLiveEvents';
import { ADMIN_NAV, confirmSignOut } from '../navigation';
import type { AdminTab } from '../types';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  liveStatus: LiveStatus;
  onLogout: () => void;
}

export function AdminSidebar({ open, onClose, tab, onTabChange, liveStatus, onLogout }: AdminSidebarProps) {
  return (
    <NavDrawer
      open={open}
      onClose={onClose}
      title="Admin sections"
      items={ADMIN_NAV}
      active={tab}
      onSelect={onTabChange}
      footer={
        <div className="flex items-center justify-between gap-2">
          <LiveIndicator status={liveStatus} className="inline-flex" />
          <SignOutButton onClick={() => confirmSignOut(onLogout)} />
        </div>
      }
    />
  );
}
