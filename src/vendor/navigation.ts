import { ClipboardList, LayoutDashboard, Settings, Store, UtensilsCrossed } from 'lucide-react';
import type { DrawerNavItem } from '../components/ui/NavDrawer';
import { VENDOR_PATH } from '../services/api/env';
import type { VendorSection } from './types';

export const VENDOR_NAV: DrawerNavItem<VendorSection>[] = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'orders', label: 'Orders', icon: ClipboardList },
  { value: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { value: 'profile', label: 'Store profile', icon: Store },
  { value: 'settings', label: 'Settings', icon: Settings },
];

const SECTIONS = new Set<VendorSection>(VENDOR_NAV.map((item) => item.value));

export function sectionPath(section: VendorSection): string {
  return section === 'overview' ? VENDOR_PATH : `${VENDOR_PATH}/${section}`;
}

export function sectionFromPath(subPath: string): VendorSection {
  const segment = subPath.split('/').filter(Boolean)[0] as VendorSection | undefined;
  return segment && SECTIONS.has(segment) ? segment : 'overview';
}

export function confirmVendorSignOut(onLogout: () => void): void {
  if (window.confirm('Sign out of your CHOP vendor account?')) onLogout();
}
