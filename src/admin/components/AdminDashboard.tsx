import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { adminApi } from '../../services/api/admin';
import { useAdminQuery } from '../hooks/useAdminQuery';
import type { AdminTab, AudienceKind } from '../types';
import { AdminHeader } from './AdminHeader';
import { NewsletterView } from './NewsletterView';
import { SubscribersView } from './SubscribersView';
import { Alert } from '../../components/ui/Alert';
import { mutedText } from '../../components/ui/styles';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<AdminTab>('subscribers');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [audienceKind, setAudienceKind] = useState<AudienceKind>('all');
  const overview = useAdminQuery(token, adminApi.subscribers, onLogout);

  const effectiveAudience: AudienceKind = audienceKind === 'selected' && selected.size === 0 ? 'all' : audienceKind;

  const openComposer = (audience: AudienceKind) => {
    setAudienceKind(audience);
    setTab('newsletter');
  };

  return (
    <>
      <AdminHeader
        tab={tab}
        onTabChange={setTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={onLogout}
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
                onReload={overview.reload}
                selected={selected}
                onSelectedChange={setSelected}
                onEmailSelected={() => openComposer('selected')}
              />
            </div>
            <div hidden={tab !== 'newsletter'}>
              <NewsletterView
                token={token}
                subscribers={overview.data.subscribers}
                selected={selected}
                audienceKind={effectiveAudience}
                onAudienceKindChange={setAudienceKind}
                onUnauthorized={onLogout}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}
