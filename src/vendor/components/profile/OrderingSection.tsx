import { useState, type FormEvent } from 'react';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Toggle } from '../../../components/ui/Toggle';
import { fieldClass, mutedText } from '../../../components/ui/styles';
import { parseNaira } from '../../../utils/money';
import { useProfileSaver } from '../../hooks/useProfileSaver';
import type { VendorProfile } from '../../types';
import { SaveRow } from './SaveRow';

interface OrderingDraft {
  offersDelivery: boolean;
  offersPickup: boolean;
  deliveryFee: string;
  minimumOrder: string;
  prepTimeMinutes: string;
  paymentNote: string;
}

function toDraft(vendor: VendorProfile): OrderingDraft {
  return {
    offersDelivery: vendor.offersDelivery,
    offersPickup: vendor.offersPickup,
    deliveryFee: String(vendor.deliveryFee),
    minimumOrder: String(vendor.minimumOrder),
    prepTimeMinutes: String(vendor.prepTimeMinutes),
    paymentNote: vendor.paymentNote,
  };
}

function MoneyInput({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold ${mutedText}`}>₦</span>
      <input
        id={id}
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ''))}
        className={`${fieldClass} pl-7 tabular-nums`}
      />
    </div>
  );
}

export function OrderingSection({ vendor }: { vendor: VendorProfile }) {
  const { save, pending, error, savedAt } = useProfileSaver();
  const [draft, setDraft] = useState<OrderingDraft>(() => toDraft(vendor));
  const [baseline, setBaseline] = useState(() => JSON.stringify(toDraft(vendor)));
  const dirty = JSON.stringify(draft) !== baseline;

  const update = (patch: Partial<OrderingDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const prep = Math.min(240, Math.max(5, Number(draft.prepTimeMinutes) || 30));
    const saved = await save({
      offersDelivery: draft.offersDelivery,
      offersPickup: draft.offersPickup,
      deliveryFee: parseNaira(draft.deliveryFee),
      minimumOrder: parseNaira(draft.minimumOrder),
      prepTimeMinutes: prep,
      paymentNote: draft.paymentNote.trim(),
    });
    if (saved) {
      const next = { ...draft, prepTimeMinutes: String(prep) };
      setDraft(next);
      setBaseline(JSON.stringify(next));
    }
  };

  return (
    <Card title="Ordering">
      <form onSubmit={submit} className="space-y-4">
        <Toggle
          label="Delivery"
          description="You deliver orders to customers."
          checked={draft.offersDelivery}
          onChange={(offersDelivery) => update({ offersDelivery })}
        />
        <Toggle
          label="Pickup"
          description="Customers can collect orders from you."
          checked={draft.offersPickup}
          onChange={(offersPickup) => update({ offersPickup })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {draft.offersDelivery && (
            <Field label="Delivery fee" htmlFor="ordering-fee" hint="Use 0 for free delivery.">
              <MoneyInput id="ordering-fee" value={draft.deliveryFee} onChange={(deliveryFee) => update({ deliveryFee })} />
            </Field>
          )}
          <Field label="Minimum order" htmlFor="ordering-minimum" hint="Use 0 for no minimum.">
            <MoneyInput id="ordering-minimum" value={draft.minimumOrder} onChange={(minimumOrder) => update({ minimumOrder })} />
          </Field>
          <Field label="Usual prep time (minutes)" htmlFor="ordering-prep">
            <input
              id="ordering-prep"
              inputMode="numeric"
              value={draft.prepTimeMinutes}
              onChange={(event) => update({ prepTimeMinutes: event.target.value.replace(/[^\d]/g, '') })}
              className={`${fieldClass} tabular-nums`}
            />
          </Field>
        </div>
        <Field
          label="How customers pay you"
          htmlFor="ordering-payment"
          hint="Shown after you accept an order. For example your bank details, or pay on delivery."
        >
          <textarea
            id="ordering-payment"
            rows={3}
            maxLength={400}
            value={draft.paymentNote}
            onChange={(event) => update({ paymentNote: event.target.value })}
            placeholder="Transfer to 0123456789, GTBank, Mama Funke Kitchen. Or pay cash on delivery."
            className={`${fieldClass} resize-y`}
          />
        </Field>
        <SaveRow dirty={dirty} pending={pending} error={error} saved={savedAt !== null} />
      </form>
    </Card>
  );
}
