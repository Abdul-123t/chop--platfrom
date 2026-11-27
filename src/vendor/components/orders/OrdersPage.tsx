import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardList, History, RefreshCw } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Segmented } from '../../../components/ui/Segmented';
import { mutedText } from '../../../components/ui/styles';
import { useAuthorizedAction } from '../../../hooks/useAuthorizedAction';
import { useTokenQuery } from '../../../hooks/useTokenQuery';
import { vendorApi } from '../../../services/api/vendor';
import { isClosedStatus } from '../../../utils/orderStatus';
import type { OrderScope, StatusChange, VendorOrder } from '../../types';
import { useVendor } from '../../VendorContext';
import { PageHeader } from '../PageHeader';
import { OrderCard } from './OrderCard';

function sortActive(orders: VendorOrder[]): VendorOrder[] {
  const pending = orders.filter((order) => order.status === 'PENDING');
  const rest = orders
    .filter((order) => order.status !== 'PENDING')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return [...pending, ...rest];
}

export function OrdersPage() {
  const { token, logout, ordersVersion, reloadOverview, overview } = useVendor();
  const [scope, setScope] = useState<OrderScope>('active');
  const loader = useCallback((authToken: string, signal: AbortSignal) => vendorApi.orders(authToken, scope, signal), [scope]);
  const query = useTokenQuery(token, loader, logout);
  const action = useAuthorizedAction(logout);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { reload, setData } = query;

  useEffect(() => {
    if (ordersVersion > 0) reload();
  }, [ordersVersion, reload]);

  const orders = useMemo(() => {
    const list = query.data?.orders ?? [];
    return scope === 'active' ? sortActive(list) : list;
  }, [query.data, scope]);

  const change = async (order: VendorOrder, next: StatusChange) => {
    setBusyId(order.id);
    const result = await action.run(() => vendorApi.updateOrder(token, order.id, next));
    setBusyId(null);
    if (!result) {
      reload();
      return false;
    }
    setData((current) => {
      if (!current) return current;
      const updated = result.order;
      const leavesScope = scope === 'active' && isClosedStatus(updated.status);
      return {
        orders: leavesScope
          ? current.orders.filter((entry) => entry.id !== updated.id)
          : current.orders.map((entry) => (entry.id === updated.id ? updated : entry)),
      };
    });
    reloadOverview();
    return true;
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Orders"
        subtitle={overview.vendor.acceptingOrders ? 'New orders appear here instantly.' : 'You are not accepting orders right now.'}
        actions={
          <Button
            variant="secondary"
            loading={query.loading}
            icon={<RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />}
            onClick={reload}
          >
            Refresh
          </Button>
        }
      />
      <Segmented<OrderScope>
        label="Order list"
        value={scope}
        onChange={setScope}
        options={[
          { value: 'active', label: `In progress${overview.stats.active ? ` (${overview.stats.active})` : ''}` },
          { value: 'history', label: 'Past orders' },
        ]}
      />

      {action.error && <Alert tone="error">{action.error}</Alert>}
      {query.error && <Alert tone="error">{query.error}</Alert>}

      {!query.data && query.loading && <div className={`py-10 text-center text-[13px] ${mutedText}`}>Loading orders…</div>}

      {query.data && orders.length === 0 && (
        <EmptyState icon={scope === 'active' ? ClipboardList : History} title={scope === 'active' ? 'No orders in progress' : 'No past orders yet'}>
          {scope === 'active'
            ? 'When a customer orders from your page, it shows up here with a sound. Keep this page open during business hours.'
            : 'Completed, rejected and cancelled orders will be listed here.'}
        </EmptyState>
      )}

      <div className="grid gap-3 lg:grid-cols-2 [&>*]:min-w-0">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            defaultPrepTime={overview.vendor.prepTimeMinutes}
            busy={busyId === order.id}
            onChange={(next) => change(order, next)}
          />
        ))}
      </div>
    </div>
  );
}
