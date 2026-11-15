import { useEffect, useState } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Segmented } from '../../components/ui/Segmented';
import { fieldClass, labelClass, mutedText } from '../../components/ui/styles';
import { adminApi } from '../../services/api/admin';
import { useAuthorizedAction } from '../hooks/useAuthorizedAction';
import type { Subscriber, SubscriberStatus } from '../types';
import { formatDateTime } from '../utils/format';
import { STATUS_META, statusOptions } from '../utils/status';
import { displayName } from '../utils/subscribers';
import { DetailList, type DetailRow } from './DetailList';

interface SubscriberDetailPanelProps {
  token: string;
  subscriber: Subscriber;
  onClose: () => void;
  onUpdated: (subscriber: Subscriber) => void;
  onDeleted: (id: string) => void;
  onUnauthorized: () => void;
}

function contactRows(subscriber: Subscriber): DetailRow[] {
  return [
    ['Name', subscriber.name],
    ['Email', subscriber.email ? `${subscriber.email}${subscriber.subscribed ? '' : ' (unsubscribed)'}` : ''],
    [
      'WhatsApp',
      <a
        key="wa"
        href={`https://wa.me/${subscriber.whatsapp.replace(/\D/g, '')}`}
        target="_blank"
        rel="noreferrer"
        className="text-[#E8772E] hover:underline"
      >
        {subscriber.whatsapp}
      </a>,
    ],
    ['Area', subscriber.area],
    ['Student', subscriber.student],
    [subscriber.type === 'vendor' ? 'Food categories' : 'Cravings', subscriber.interests.join(', ')],
    ['Joined', formatDateTime(subscriber.joinedAt)],
    ['Reviewed', subscriber.reviewedAt ? formatDateTime(subscriber.reviewedAt) : ''],
    ['ID', <span key="id" className="text-[12px] break-all">{subscriber.id}</span>],
  ];
}

function vendorRows(subscriber: Subscriber): DetailRow[] {
  const vendor = subscriber.vendor;
  if (!vendor) return [];
  const link = vendor.socialMediaLink;
  return [
    ['Category', vendor.otherCategory ? `${vendor.category} (${vendor.otherCategory})` : vendor.category],
    ['Delivers', vendor.delivers],
    ['Fulfilment', vendor.fulfilmentOptions.join(', ')],
    ['Model', vendor.operatingModel],
    ['Locations', vendor.operatingLocations.join(', ')],
    ['Address', vendor.address],
    ['Description', vendor.businessDescription],
    [
      'Social',
      link ? (
        <a key="social" href={link} target="_blank" rel="noreferrer" className="text-[#E8772E] hover:underline break-all">
          {link}
        </a>
      ) : (
        ''
      ),
    ],
    ['Comments', vendor.additionalComments],
  ];
}

export function SubscriberDetailPanel({
  token,
  subscriber,
  onClose,
  onUpdated,
  onDeleted,
  onUnauthorized,
}: SubscriberDetailPanelProps) {
  const [status, setStatus] = useState<SubscriberStatus>(subscriber.status);
  const [notes, setNotes] = useState(subscriber.adminNotes);
  const [saved, setSaved] = useState(false);
  const action = useAuthorizedAction(onUnauthorized);
  const dirty = status !== subscriber.status || notes.trim() !== subscriber.adminNotes;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const save = async () => {
    const result = await action.run(() =>
      adminApi.updateSubscriber(token, subscriber.id, {
        ...(status !== subscriber.status ? { status } : {}),
        adminNotes: notes.trim(),
      })
    );
    if (!result) return;
    onUpdated(result.subscriber);
    setSaved(true);
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${displayName(subscriber)} from the waitlist? This cannot be undone.`)) return;
    const result = await action.run(() => adminApi.deleteSubscriber(token, subscriber.id));
    if (result) onDeleted(subscriber.id);
  };

  const options = statusOptions(subscriber.type);
  if (!options.includes(subscriber.status)) options.unshift(subscriber.status);

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-label="Entry details">
      <button type="button" aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-[#0E0D0B]/50" />
      <aside className="relative w-full max-w-md h-full overflow-y-auto bg-[#F7F1E8] dark:bg-[#141210] border-l border-[#0E0D0B]/10 dark:border-white/[0.08] shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-3 px-4 py-3 bg-[#F7F1E8]/95 dark:bg-[#141210]/95 backdrop-blur border-b border-[#0E0D0B]/10 dark:border-white/[0.08]">
          <div className="min-w-0">
            <div className="text-[16px] font-extrabold leading-tight truncate">{displayName(subscriber)}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge tone={subscriber.type === 'vendor' ? 'orange' : 'neutral'}>
                {subscriber.type === 'vendor' ? 'Vendor' : 'Customer'}
              </Badge>
              <Badge tone={STATUS_META[subscriber.status].tone}>{STATUS_META[subscriber.status].label}</Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`p-1.5 rounded-full hover:text-[#E8772E] cursor-pointer ${mutedText}`}
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="px-4 py-4 space-y-5">
          <section className="space-y-2">
            <h3 className={`text-[11px] font-bold uppercase tracking-wide ${mutedText}`}>Contact</h3>
            <DetailList rows={contactRows(subscriber)} />
          </section>

          {subscriber.vendor && (
            <section className="space-y-2">
              <h3 className={`text-[11px] font-bold uppercase tracking-wide ${mutedText}`}>Business</h3>
              <DetailList rows={vendorRows(subscriber)} />
            </section>
          )}

          <section className="space-y-3">
            <h3 className={`text-[11px] font-bold uppercase tracking-wide ${mutedText}`}>Review</h3>
            <div>
              <span className={labelClass}>Status</span>
              <Segmented<SubscriberStatus>
                label="Status"
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setSaved(false);
                }}
                options={options.map((value) => ({ value, label: STATUS_META[value].label }))}
              />
            </div>
            <div>
              <label htmlFor="admin-notes" className={labelClass}>
                Notes
              </label>
              <textarea
                id="admin-notes"
                rows={4}
                maxLength={5000}
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setSaved(false);
                }}
                placeholder="Only visible to admins"
                className={`${fieldClass} resize-y`}
              />
            </div>
            {action.error && <Alert tone="error">{action.error}</Alert>}
            {saved && !dirty && <Alert tone="success">Saved.</Alert>}
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                onClick={remove}
                disabled={action.pending}
                icon={<Trash2 className="w-3.5 h-3.5" aria-hidden="true" />}
                className="hover:!text-[#DC2626] px-0"
              >
                Delete entry
              </Button>
              <Button
                onClick={save}
                loading={action.pending}
                disabled={!dirty}
                icon={<Save className="w-3.5 h-3.5" aria-hidden="true" />}
              >
                Save
              </Button>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
