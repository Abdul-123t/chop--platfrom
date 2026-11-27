import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Segmented } from '../../components/ui/Segmented';
import { Sheet } from '../../components/ui/Sheet';
import { fieldClass, mutedText } from '../../components/ui/styles';
import { ApiError } from '../../services/api/http';
import { storefrontApi } from '../../services/api/storefront';
import { formatNaira } from '../../utils/money';
import type { Fulfilment } from '../../utils/orderStatus';
import type { CartLine, CheckoutDetails, StoreVendor } from '../types';
import { useCheckoutDetails } from '../hooks/useCheckoutDetails';
import { QuantityStepper } from './QuantityStepper';

interface CheckoutSheetProps {
  vendor: StoreVendor;
  lines: CartLine[];
  subtotal: number;
  onQuantity: (line: CartLine, quantity: number) => void;
  onClose: () => void;
  onPlaced: (orderId: string) => void;
  onMenuChanged: () => void;
}

function errorFor(details: ApiError | null, path: string): string | undefined {
  return details?.details.find((detail) => detail.path === path)?.message;
}

export function CheckoutSheet({ vendor, lines, subtotal, onQuantity, onClose, onPlaced, onMenuChanged }: CheckoutSheetProps) {
  const [details, setDetails] = useCheckoutDetails(vendor.offersDelivery ? 'DELIVERY' : 'PICKUP');
  const [error, setError] = useState<ApiError | null>(null);
  const [pending, setPending] = useState(false);
  const fulfilment: Fulfilment =
    details.fulfilment === 'DELIVERY' && !vendor.offersDelivery ? 'PICKUP' : details.fulfilment === 'PICKUP' && !vendor.offersPickup ? 'DELIVERY' : details.fulfilment;
  const deliveryFee = fulfilment === 'DELIVERY' ? vendor.deliveryFee : 0;
  const belowMinimum = subtotal < vendor.minimumOrder;
  const ready =
    lines.length > 0 &&
    !belowMinimum &&
    details.customerName.trim().length >= 2 &&
    details.customerPhone.replace(/\D/g, '').length >= 10 &&
    (fulfilment === 'PICKUP' || details.address.trim().length >= 5);

  const update = (patch: Partial<CheckoutDetails>) => setDetails({ ...details, ...patch });

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!ready || pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await storefrontApi.placeOrder(vendor.slug, { ...details, fulfilment }, lines);
      if (result.order) onPlaced(result.order.id);
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : new ApiError(0, 'Could not place your order.');
      setError(apiError);
      if (apiError.status === 400 && apiError.details.length === 0) onMenuChanged();
      setPending(false);
    }
  };

  return (
    <Sheet
      title={`Your order · ${vendor.businessName}`}
      onClose={onClose}
      footer={
        <div className="space-y-2">
          {error && <Alert tone="error">{error.message}</Alert>}
          <Button
            loading={pending}
            disabled={!ready}
            onClick={() => void submit()}
            icon={<Send className="w-4 h-4" aria-hidden="true" />}
            className="w-full py-3 text-[15px]"
          >
            Place order · {formatNaira(subtotal + deliveryFee)}
          </Button>
          <p className={`text-center text-[11px] ${mutedText}`}>
            You pay {vendor.businessName} directly. They will confirm your order and share payment details.
          </p>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <ul className="space-y-2">
          {lines.map((line) => (
            <li key={line.itemId} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold truncate">{line.name}</div>
                <div className={`text-[12px] tabular-nums ${mutedText}`}>{formatNaira(line.price * line.quantity)}</div>
              </div>
              <QuantityStepper quantity={line.quantity} label={line.name} onChange={(quantity) => onQuantity(line, quantity)} compact />
            </li>
          ))}
        </ul>

        <dl className="space-y-1 text-[13px] border-t border-[#0E0D0B]/10 dark:border-white/[0.08] pt-3">
          <div className="flex justify-between">
            <dt className={mutedText}>Subtotal</dt>
            <dd className="tabular-nums">{formatNaira(subtotal)}</dd>
          </div>
          {fulfilment === 'DELIVERY' && (
            <div className="flex justify-between">
              <dt className={mutedText}>Delivery</dt>
              <dd className="tabular-nums">{deliveryFee > 0 ? formatNaira(deliveryFee) : 'Free'}</dd>
            </div>
          )}
          <div className="flex justify-between text-[15px] font-extrabold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatNaira(subtotal + deliveryFee)}</dd>
          </div>
        </dl>
        {belowMinimum && <Alert tone="info">Add {formatNaira(vendor.minimumOrder - subtotal)} more to reach the minimum order.</Alert>}

        {vendor.offersDelivery && vendor.offersPickup && (
          <Segmented<Fulfilment>
            label="Delivery or pickup"
            value={fulfilment}
            onChange={(value) => update({ fulfilment: value })}
            options={[
              { value: 'DELIVERY', label: 'Delivery' },
              { value: 'PICKUP', label: 'Pickup' },
            ]}
          />
        )}

        <Field label="Your name" htmlFor="checkout-name" error={errorFor(error, 'customerName')}>
          <input
            id="checkout-name"
            autoComplete="name"
            maxLength={80}
            value={details.customerName}
            onChange={(event) => update({ customerName: event.target.value })}
            className={fieldClass}
          />
        </Field>
        <Field label="WhatsApp number" htmlFor="checkout-phone" hint="The vendor will contact you here." error={errorFor(error, 'customerPhone')}>
          <input
            id="checkout-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={20}
            value={details.customerPhone}
            onChange={(event) => update({ customerPhone: event.target.value })}
            placeholder="0801 234 5678"
            className={fieldClass}
          />
        </Field>
        {fulfilment === 'DELIVERY' ? (
          <Field label="Delivery address" htmlFor="checkout-address" error={errorFor(error, 'address')}>
            <textarea
              id="checkout-address"
              rows={2}
              maxLength={200}
              autoComplete="street-address"
              value={details.address}
              onChange={(event) => update({ address: event.target.value })}
              placeholder="Hostel, street, landmark"
              className={`${fieldClass} resize-y`}
            />
          </Field>
        ) : (
          vendor.address && <Alert tone="info">Pick up at {vendor.address}</Alert>
        )}
        <Field label="Note for the vendor" htmlFor="checkout-note" hint="Optional. Extra pepper, no onions…">
          <input
            id="checkout-note"
            maxLength={300}
            value={details.note}
            onChange={(event) => update({ note: event.target.value })}
            className={fieldClass}
          />
        </Field>
        <Field label="Email" htmlFor="checkout-email" hint="Optional. Get order updates by email." error={errorFor(error, 'customerEmail')}>
          <input
            id="checkout-email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={details.customerEmail}
            onChange={(event) => update({ customerEmail: event.target.value })}
            className={fieldClass}
          />
        </Field>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={details.website}
          onChange={(event) => update({ website: event.target.value })}
          className="hidden"
        />
        <button type="submit" className="hidden" />
      </form>
    </Sheet>
  );
}
