import { createContext, useContext } from 'react';
import type { OverviewState, ProfileState, VendorSection, VendorSession } from './types';

export interface VendorContextValue {
  token: string;
  logout: () => void;
  replaceSession: (session: VendorSession) => void;
  overview: OverviewState;
  reloadOverview: () => void;
  applyProfile: (profile: ProfileState) => void;
  ordersVersion: number;
  menuVersion: number;
  goTo: (section: VendorSection) => void;
}

export const VendorContext = createContext<VendorContextValue | null>(null);

export function useVendor(): VendorContextValue {
  const value = useContext(VendorContext);
  if (!value) throw new Error('useVendor must be used inside the vendor portal.');
  return value;
}
