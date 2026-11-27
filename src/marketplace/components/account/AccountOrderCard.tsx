import React, { useState } from 'react';
import { ChevronDown, MessageCircle, RotateCcw, Truck, X } from 'lucide-react';
import { whatsappLink } from '../../../utils/whatsapp';
import { formatNaira } from '../../lib/constants';
import { useStore } from '../../lib/store';
import type { Order } from '../../types';
import { card, errorBox, errorText, isOpenOrder, ORDER_STATUS, primaryButton, secondaryButton } from './accountStyles';

export const AccountOrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const { setActiveOrderToTrack, setIsOrderTrackerOpen, cancelOrder, reorder } = useStore();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const status = ORDER_STATUS[order.status];
  const placed = new Date(order.createdAt);

  const track = () => {
    setActiveOrderToTrack(order);
    setIsOrderTrackerOpen(true);
  };

  const cancel = async () => {
    if (!window.confirm(`Cancel order ${order.orderNumber}?`)) return;
    setBusy(true);
    setMessage('');
    try {
      await cancelOrder(order.id);
    } catch (error) {
      setMessage(errorText(error, 'Could not cancel this order.'));
    } finally {
      setBusy(false);
    }
  };

  const orderAgain = () => {
    const result = reorder(order);
    if (result.added === 0) setMessage('These dishes are not available right now.');
    else if (result.skipped > 0) window.alert(`${result.skipped} item(s) are sold out and were left out.`);
  };

  return (
    <article className={`${card} p-4 space-y-3`}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="w-full flex items-start justify-between gap-3 text-left">
        <div className="min-w-0">
          <p className="font-display font-bold text-sm text-[#141414] truncate">{order.vendorName}</p>
          <p className="text-[11px] text-[#77736C]">
            #{order.orderNumber} · {placed.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })},{' '}
            {placed.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full ${status.tone}`}>{status.label}</span>
          <ChevronDown className={`w-4 h-4 text-[#77736C] transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <div className="flex items-center justify-between text-xs">
        <span className="text-[#77736C]">
          {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) · {order.fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}
        </span>
        <span className="font-bold text-[#C45B3A]">{formatNaira(order.total)}</span>
      </div>

      {open && (
        <div className="space-y-3 pt-3 border-t border-[#E6E2DA] text-xs">
          <ul className="space-y-1">
            {order.items.map((item) => (
              <li key={item.cartItemId} className="flex justify-between gap-3">
                <span className="text-[#191919]">
                  <span className="font-bold text-[#C45B3A]">{item.quantity}×</span> {item.name}
                </span>
                <span className="text-[#77736C] shrink-0">{formatNaira(item.itemTotal)}</span>
              </li>
            ))}
            {order.deliveryFee > 0 && (
              <li className="flex justify-between gap-3 text-[#77736C]">
                <span>Delivery</span>
                <span>{formatNaira(order.deliveryFee)}</span>
              </li>
            )}
          </ul>
          {order.deliveryAddress && <p className="text-[#77736C]">Deliver to: {order.deliveryAddress}</p>}
          {order.fulfillmentType === 'pickup' && order.pickupAddress && <p className="text-[#77736C]">Pick up at: {order.pickupAddress}</p>}
          {order.note && <p className="text-[#77736C]">Note: {order.note}</p>}
          {order.paymentNote && isOpenOrder(order.status) && (
            <p className="p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-[#191919]">
              <span className="font-bold">How to pay:</span> {order.paymentNote}
            </p>
          )}
          {order.rejectionReason && order.status === 'cancelled' && <p className="text-red-700">Reason: {order.rejectionReason}</p>}
        </div>
      )}

      {message && <p className={errorBox}>{message}</p>}

      <div className="flex flex-wrap gap-2">
        {isOpenOrder(order.status) && (
          <button type="button" onClick={track} className={primaryButton}>
            <Truck className="w-3.5 h-3.5" />
            Track
          </button>
        )}
        {order.vendorPhone && (
          <a
            href={whatsappLink(order.vendorPhone, `Hi, I'm checking on my CHOP order ${order.orderNumber}.`)}
            target="_blank"
            rel="noreferrer"
            className={secondaryButton}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp vendor
          </a>
        )}
        {!isOpenOrder(order.status) && (
          <button type="button" onClick={orderAgain} className={secondaryButton}>
            <RotateCcw className="w-3.5 h-3.5" />
            Order again
          </button>
        )}
        {order.status === 'pending_acceptance' && (
          <button type="button" onClick={() => void cancel()} disabled={busy} className={`${secondaryButton} hover:!text-red-600`}>
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}
      </div>
    </article>
  );
};
