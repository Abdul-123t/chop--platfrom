import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from '../../components/ui/Alert';
import { mutedText } from '../../components/ui/styles';
import { useTheme } from '../../hooks/useTheme';
import { adminApi } from '../../services/api/admin';
import type { AdminEvent } from '../../services/api/events';
import { useAdminEvents } from '../hooks/useAdminEvents';
import { useAdminQuery } from '../hooks/useAdminQuery';
import type { AdminTab, AudienceKind, Subscriber } from '../types';
import { AdminHeader } from './AdminHeader';
import { NewsletterView } from './NewsletterView';
import { SubscriberDetailPanel } from './SubscriberDetailPanel';
import { SubscribersView } from './SubscribersView';

const REFRESH_DEBOUNCE_MS = 300;

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<AdminTab>('subscribers');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [audienceKind, setAudienceKind] = useState<AudienceKind>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);
  const overview = useAdminQuery(token, adminApi.subscribers, onLogout);
  const refreshTimer = useRef<number | undefined>(undefined);
  const { reload, setData } = overview;

  const handleEvent = useCallback(
    (event: AdminEvent) => {
      if (event.type === 'newsletter.sent') setHistoryVersion((value) => value + 1);
      window.clearTimeout(refreshTimer.current);
      refreshTimer.current = window.setTimeout(reload, REFRESH_DEBOUNCE_MS);
    },
    [reload]
  );

  useEffect(() => () => window.clearTimeout(refreshTimer.current), []);

  const liveStatus = useAdminEvents(token, handleEvent, onLogout);

  const effectiveAudience: AudienceKind = audienceKind === 'selected' && selected.size === 0 ? 'all' : audienceKind;
  const openSubscriber = overview.data?.subscribers.find((subscriber) => subscriber.id === openId) ?? null;

  const openComposer = (audience: AudienceKind) => {
    setAudienceKind(audience);
    setTab('newsletter');
  };

  const handleUpdated = (updated: Subscriber) => {
    setData((current) =>
      current
        ? {
            ...current,
            subscribers: current.subscribers.map((subscriber) => (subscriber.id === updated.id ? updated : subscriber)),
          }
        : current
    );
  };

  const handleDeleted = (id: string) => {
    setOpenId(null);
    setSelected((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    reload();
  };

  return (
    <>
      <AdminHeader
        tab={tab}
        onTabChange={setTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={onLogout}
        liveStatus={liveStatus}
      />
      <main className="max-w-[1200px] mx-auto px-4 py-4 space-y-3">
        {overview.error && <Alert tone="error">{overview.error}</Alert>}
        {!overview.data && overview.loading && (
          <div className={`py-10 text-center text-[13px] ${mutedText}`}>Loading waitlist…</div>
        )}
        {overview.data && (
          <>
            <div hidden={tab !== 'subscribers'}>
              <SubscribersView
                overview={overview.data}
                loading={overview.loading}
                onReload={reload}
                selected={selected}
                onSelectedChange={setSelected}
                onEmailSelected={() => openComposer('selected')}
                onOpen={setOpenId}
              />
            </div>
            <div hidden={tab !== 'newsletter'}>
              <NewsletterView
                token={token}
                subscribers={overview.data.subscribers}
                selected={selected}
                audienceKind={effectiveAudience}
                onAudienceKindChange={setAudienceKind}
                historyVersion={historyVersion}
                onUnauthorized={onLogout}
              />
            </div>
          </>
        )}
      </main>
      {openSubscriber && (
        <SubscriberDetailPanel
          key={openSubscriber.id}
          token={token}
          subscriber={openSubscriber}
          onClose={() => setOpenId(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
          onUnauthorized={onLogout}
        />
      )}
    </>
  );
}
