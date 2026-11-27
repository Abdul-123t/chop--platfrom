import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from '../../../components/ui/Alert';
import { mutedText } from '../../../components/ui/styles';
import { useLiveEvents } from '../../../hooks/useLiveEvents';
import { useTokenQuery } from '../../../hooks/useTokenQuery';
import { navigate } from '../../../router/navigation';
import type { LiveEvent } from '../../../services/api/events';
import { vendorApi } from '../../../services/api/vendor';
import { sectionPath } from '../../navigation';
import type { ProfileState, VendorSection, VendorSession } from '../../types';
import { playOrderChime, unlockAudio } from '../../utils/chime';
import { VendorContext, type VendorContextValue } from '../../VendorContext';
import { VendorSectionView } from './VendorSectionView';
import { VendorShell } from './VendorShell';

const RELOAD_DEBOUNCE_MS = 250;

interface VendorPortalProps {
  session: VendorSession;
  section: VendorSection;
  onLogout: () => void;
  onSessionReplace: (session: VendorSession) => void;
}

export function VendorPortal({ session, section, onLogout, onSessionReplace }: VendorPortalProps) {
  const overview = useTokenQuery(session.token, vendorApi.overview, onLogout);
  const [ordersVersion, setOrdersVersion] = useState(0);
  const [menuVersion, setMenuVersion] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const { reload, setData } = overview;

  const scheduleReload = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(reload, RELOAD_DEBOUNCE_MS);
  }, [reload]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, []);

  const handleEvent = useCallback(
    (event: LiveEvent) => {
      if (event.type === 'order.created') playOrderChime();
      if (event.type === 'order.created' || event.type === 'order.updated') setOrdersVersion((value) => value + 1);
      if (event.type === 'menu.updated') setMenuVersion((value) => value + 1);
      scheduleReload();
    },
    [scheduleReload]
  );

  const liveStatus = useLiveEvents('/api/vendor/events', session.token, handleEvent, onLogout);
  const pending = overview.data?.stats.pending ?? 0;

  useEffect(() => {
    document.title = pending > 0 ? `(${pending}) New orders · CHOP Vendor` : 'CHOP for Vendors';
  }, [pending]);

  const applyProfile = useCallback(
    (profile: ProfileState) => setData((current) => (current ? { ...current, ...profile } : current)),
    [setData]
  );

  const goTo = useCallback((next: VendorSection) => navigate(sectionPath(next)), []);

  const context = useMemo<VendorContextValue | null>(
    () =>
      overview.data
        ? {
            token: session.token,
            logout: onLogout,
            replaceSession: onSessionReplace,
            overview: overview.data,
            reloadOverview: reload,
            applyProfile,
            ordersVersion,
            menuVersion,
            goTo,
          }
        : null,
    [overview.data, session.token, onLogout, onSessionReplace, reload, applyProfile, ordersVersion, menuVersion, goTo]
  );

  return (
    <VendorShell
      section={section}
      onNavigate={goTo}
      businessName={overview.data?.vendor.businessName ?? session.businessName}
      liveStatus={liveStatus}
      pendingOrders={pending}
      onLogout={onLogout}
    >
      {overview.error && !overview.data && <Alert tone="error">{overview.error}</Alert>}
      {!overview.data && !overview.error && (
        <div className={`py-16 text-center text-[13px] ${mutedText}`}>Loading your store…</div>
      )}
      {context && (
        <VendorContext.Provider value={context}>
          <VendorSectionView section={section} />
        </VendorContext.Provider>
      )}
    </VendorShell>
  );
}
