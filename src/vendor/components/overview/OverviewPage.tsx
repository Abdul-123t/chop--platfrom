import { ArrowRight, BellRing } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useVendor } from '../../VendorContext';
import { PageHeader } from '../PageHeader';
import { SetupChecklist } from './SetupChecklist';
import { StatTiles } from './StatTiles';
import { StoreStatusCard } from './StoreStatusCard';

function greeting(now = new Date()): string {
  const hour = new Date(now.getTime() + 60 * 60_000).getUTCHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function OverviewPage() {
  const { overview, goTo } = useVendor();
  const { vendor, stats, checklist, readyToPublish } = overview;
  const firstName = vendor.ownerName.split(/\s+/)[0] ?? '';

  return (
    <div className="space-y-3">
      <PageHeader title={`${greeting()}${firstName ? `, ${firstName}` : ''}`} subtitle={vendor.businessName} />

      {stats.pending > 0 && (
        <button
          type="button"
          onClick={() => goTo('orders')}
          className="w-full flex items-center gap-3 rounded-2xl bg-[#E8772E] text-[#0E0D0B] px-4 py-3 text-left cursor-pointer hover:bg-[#B9441A] transition-colors"
        >
          <BellRing className="w-5 h-5 shrink-0 animate-pulse" aria-hidden="true" />
          <span className="flex-1 font-bold">
            {stats.pending === 1 ? '1 new order is waiting' : `${stats.pending} new orders are waiting`}
          </span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      )}

      <StoreStatusCard vendor={vendor} readyToPublish={readyToPublish} />
      <StatTiles stats={stats} />
      {!vendor.published && <SetupChecklist checklist={checklist} onNavigate={goTo} />}

      {vendor.published && (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => goTo('menu')}>
            Update menu
          </Button>
          <Button variant="secondary" onClick={() => goTo('profile')}>
            Edit store profile
          </Button>
        </div>
      )}
    </div>
  );
}
