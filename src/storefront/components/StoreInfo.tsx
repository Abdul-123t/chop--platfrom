import { ExternalLink, MapPin, MessageCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { mutedText } from '../../components/ui/styles';
import { DAY_NAMES, describeDay, lagosDay } from '../../utils/hours';
import { whatsappLink } from '../../utils/whatsapp';
import type { StoreVendor } from '../types';

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function StoreInfo({ vendor }: { vendor: StoreVendor }) {
  const today = lagosDay();

  return (
    <aside className="space-y-3 lg:sticky lg:top-20 min-w-0">
      <Card title="About">
        <div className="space-y-3 text-[13px]">
          {vendor.description && <p className="whitespace-pre-line">{vendor.description}</p>}
          {vendor.address && (
            <p className="flex gap-2">
              <MapPin className="w-4 h-4 shrink-0 text-[#E8772E] mt-0.5" aria-hidden="true" />
              <span>{vendor.address}</span>
            </p>
          )}
          {vendor.locations.length > 0 && (
            <p className={mutedText}>Serves {vendor.locations.join(', ')}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsappLink(vendor.phone, `Hi ${vendor.businessName}, I found you on CHOP.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-[#0E0D0B] px-3 py-1.5 text-[13px] font-bold hover:opacity-90"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp
            </a>
            {vendor.socialLink && (
              <a
                href={vendor.socialLink}
                target="_blank"
                rel="noreferrer nofollow"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#0E0D0B]/15 dark:border-white/15 px-3 py-1.5 text-[13px] font-semibold hover:border-[#E8772E]"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                Social
              </a>
            )}
          </div>
        </div>
      </Card>
      <Card title="Opening hours">
        <ul className="space-y-1 text-[13px]">
          {WEEK_ORDER.map((day) => (
            <li key={day} className={`flex justify-between gap-3 ${day === today ? 'font-bold' : ''}`}>
              <span>{DAY_NAMES[day]}</span>
              <span className={day === today ? '' : mutedText}>{describeDay(vendor.hours.find((entry) => entry.day === day))}</span>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}
