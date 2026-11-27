import { useCallback, useEffect, useState } from 'react';
import { MessageCircle, ReceiptText, Store } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { mutedText } from '../../components/ui/styles';
import { usePublicQuery } from '../../hooks/usePublicQuery';
import { Link } from '../../router/Link';
import { storefrontApi } from '../../services/api/storefront';
import { formatNaira } from '../../utils/money';
import { isClosedStatus, ORDER_STATUS_META } from '../../utils/orderStatus';
import { whatsappLink } from '../../utils/whatsapp';
import { OrderProgress } from '../components/OrderProgress';
import { StoreLayout } from '../components/StoreLayout';

const POLL_MS = 10_000;

export default function OrderTrackingPage({ orderId }: { orderId: string }) {
  const loader = useCallback((signal: AbortSignal) => storefrontApi.order(orderId, signal), [orderId]);
  const query = usePublicQuery(loader);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const order = query.data?.order;
  const { reload, setData } = query;
  const closed = order ? isClosedStatus(order.status) : false;

  useEffect(() => {
    document.title = order ? `Order ${order.code} · CHOP` : 'Your order · CHOP';
  }, [order]);

  useEffect(() => {
    if (!order || closed) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') reload();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [order, closed, reload]);

  if (!order) {
    return (
      <StoreLayout>
        {query.loading ? (
          <div className={`py-20 text-center text-[13px] ${mutedText}`}>Loading your order…</div>
        ) : (
          <EmptyState icon={ReceiptText} title="Order not found">
            {query.error?.message}
          </EmptyState>
        )}
      </StoreLayout>
    );
  }

  const cancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    setCancelError(null);
    try {
      setData(await storefrontApi.cancelOrder(order.id));
    } catch (caught) {
      setCancelError(caught instanceof Error ? caught.message : 'Could not cancel the order.');
      reload();
    } finally {
      setCancelling(false);
    }
  };

  const meta = ORDER_STATUS_META[order.status];

  return (
    <StoreLayout>
      <div className="max-w-[640px] mx-auto space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className={`text-[12px] font-semibold uppercase tracking-wide ${mutedText}`}>Order {order.code}</div>
            <h1 className="text-[24px] font-extrabold tracking-tight leading-tight">
              {order.status === 'PENDING' ? 'Waiting for the vendor' : meta.label}
            </h1>
          </div>
          <Badge tone={meta.tone}>{meta.label}</Badge>
        </div>

        <Card>
          <div className="pt-3">
            <OrderProgress order={order} />
          </div>
        </Card>

        {order.paymentNote && !closed && (
          <Alert tone="info">
            <strong>How to pay:</strong> {order.paymentNote}
          </Alert>
        )}
        {order.reason && closed && order.status !== 'COMPLETED' && <Alert tone="error">{order.reason}</Alert>}
        {cancelError && <Alert tone="error">{cancelError}</Alert>}

        <Card title={order.vendor.businessName} actions={
          <Link to={`/v/${order.vendor.slug}`} className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#E8772E] hover:underline">
            <Store className="w-3.5 h-3.5" aria-hidden="true" />
            Menu
          </Link>
        }>
          <ul className="space-y-1 text-[14px]">
            {order.items.map((item, index) => (
              <li key={`${item.name}-${index}`} className="flex justify-between gap-3">
                <span>
                  <span className="font-bold text-[#E8772E]">{item.quantity}×</span> {item.name}
                </span>
                <span className="tabular-nums">{formatNaira(item.lineTotal)}</span>
              </li>
            ))}
            {order.deliveryFee > 0 && (
              <li className={`flex justify-between gap-3 text-[13px] ${mutedText}`}>
                <span>Delivery</span>
                <span className="tabular-nums">{formatNaira(order.deliveryFee)}</span>
              </li>
            )}
            <li className="flex justify-between gap-3 pt-2 mt-1 border-t border-[#0E0D0B]/10 dark:border-white/[0.08] font-extrabold">
              <span>Total</span>
              <span className="tabular-nums">{formatNaira(order.total)}</span>
            </li>
          </ul>
          {order.vendor.address && order.fulfilment === 'PICKUP' && (
            <p className={`mt-3 text-[13px] ${mutedText}`}>Pickup at {order.vendor.address}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={whatsappLink(order.vendor.phone, `Hi, I'm checking on my CHOP order ${order.code}.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-[#0E0D0B] px-3.5 py-2 text-[13px] font-bold hover:opacity-90"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Message vendor
            </a>
            {order.status === 'PENDING' && (
              <Button variant="ghost" loading={cancelling} onClick={() => void cancel()} className="hover:!text-[#DC2626]">
                Cancel order
              </Button>
            )}
          </div>
        </Card>

        <p className={`text-center text-[12px] ${mutedText}`}>
          {closed ? 'Thanks for ordering with CHOP.' : 'This page updates automatically. Keep it open or bookmark it.'}
        </p>
      </div>
    </StoreLayout>
  );
}
