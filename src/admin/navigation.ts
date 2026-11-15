import { Mail, Users, type LucideIcon } from 'lucide-react';
import type { AdminTab } from './types';

export interface AdminNavItem {
  value: AdminTab;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { value: 'subscribers', label: 'Waitlist', icon: Users },
  { value: 'newsletter', label: 'Newsletter', icon: Mail },
];

export function confirmSignOut(onLogout: () => void): void {
  if (window.confirm('Sign out of CHOP Admin?')) onLogout();
}
