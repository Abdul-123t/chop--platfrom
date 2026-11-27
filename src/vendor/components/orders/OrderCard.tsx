import { Bike, MapPin, MessageCircle, Phone, ShoppingBag, StickyNote } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { cardClass, mutedText } from '../../../components/ui/styles';
import { formatNaira } from '../../../utils/money';
import { ORDER_STATUS_META, timeAgo } from '../../../utils/orderStatus';
import { whatsappLink } from '../../../utils/whatsapp';
import type { StatusChange, VendorOrder } from '../../types';
import { OrderActions } from './OrderActions';

interface OrderCardProps {
  order: VendorOrder;
  defaultPrepTime: number;
  busy: boolean;
  onChange: (change: StatusChange) => Promise<boolean>;
}

const contactButton =
  'inline-flex items-center gap-1.5 rounded-full border border-[#0E0D0B]/15 dark:border-white/15 px-3 py-1.5 text-[12px] font-semibold hover:border-[#E8772E] hover:text-[#E8772E] transition-colors';

export function OrderCard({ order, defaultPrepTime, busy, onChange }: OrderCardProps) {
  const meta = ORDER_STATUS_META[order.status];
  const isNew = order.status === 'PENDING';
  const firstName = order.customerName.split(/\s+/)[0] ?? '';

  return (
    <article
      className={`${cardClass} p-4 space-y-3 ${isNew ? 'ring-2 ring-[#E8772E] border-transparent' : ''}`}
      aria-label={`Order ${order.code}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-extrabold tracking-tight">{order.code}</span>
            <Badge tone={meta.tone}>{meta.label}</Badge>
          </div>
          <div className={`text-[12px] ${mutedText}`}>
            {timeAgo(order.createdAt)}
            {order.prepTimeMinutes && order.status === 'ACCEPTED' ? ` · ready in ~${order.prepTimeMinutes} min` : ''}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[17px] font-extrabold tabular-nums">{formatNaira(order.total)}</div>
          <div className={`inline-flex items-center gap-1 text-[12px] font-semibold ${mutedText}`}>
            {order.fulfilment === 'DELIVERY' ? <Bike className="w-3.5 h-3.5" aria-hidden="true" /> : <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />}
            {order.fulfilment === 'DELIVERY' ? 'Delivery' : 'Pickup'}
          </div>
        </div>
      </header>

      <ul className="space-y-1 text-[14px]">
        {order.items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex justify-between gap-3">
            <span className="min-w-0">
              <span className="font-bold text-[#E8772E]">{item.quantity}×</span> {item.name}
            </span>
            <span className={`tabular-nums shrink-0 ${mutedText}`}>{formatNaira(item.lineTotal)}</span>
          </li>
        ))}
        {order.deliveryFee > 0 && (
          <li className={`flex justify-between gap-3 text-[13px] ${mutedText}`}>
            <span>Delivery fee</span>
            <span className="tabular-nums">{formatNaira(order.deliveryFee)}</span>
          </li>
        )}
      </ul>

      {(order.note || order.address) && (
        <div className="space-y-1.5 rounded-xl bg-[#0E0D0B]/[0.04] dark:bg-white/[0.04] px-3 py-2 text-[13px]">
          {order.address && (
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#E8772E]" aria-hidden="true" />
              <span className="break-words">{order.address}</span>
            </div>
          )}
          {order.note && (
            <div className="flex gap-2">
              <StickyNote className="w-4 h-4 shrink-0 mt-0.5 text-[#E8772E]" aria-hidden="true" />
              <span className="break-words">{order.note}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[14px] font-semibold truncate">{order.customerName}</div>
          <div className={`text-[12px] tabular-nums ${mutedText}`}>{order.customerPhone}</div>
        </div>
        <div className="flex gap-1.5">
          <a
            href={whatsappLink(order.customerPhone, `Hi ${firstName}, this is about your CHOP order ${order.code}.`)}
            target="_blank"
            rel="noreferrer"
            className={contactButton}
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
            WhatsApp
          </a>
          <a href={`tel:${order.customerPhone.replace(/\s/g, '')}`} className={contactButton}>
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            Call
          </a>
        </div>
      </div>

      {order.reason && (order.status === 'REJECTED' || order.status === 'CANCELLED') && (
        <div className={`text-[12px] ${mutedText}`}>Reason: {order.reason}</div>
      )}

      {order.nextStatuses.length > 0 && (
        <OrderActions order={order} defaultPrepTime={defaultPrepTime} busy={busy} onChange={onChange} />
      )}
    </article>
  );
}
