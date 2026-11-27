import { Store } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { cardClass, mutedText } from '../../components/ui/styles';
import { Link } from '../../router/Link';
import type { VendorSummary } from '../types';

export function VendorCard({ vendor }: { vendor: VendorSummary }) {
  return (
    <Link
      to={`/v/${vendor.slug}`}
      className={`${cardClass} block overflow-hidden hover:border-[#E8772E] transition-colors group`}
    >
      <div className="relative aspect-[16/7] bg-gradient-to-br from-[#E8772E]/25 to-[#B9441A]/20">
        {vendor.coverUrl && <img src={vendor.coverUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute left-3 bottom-0 translate-y-1/2 w-12 h-12 rounded-full border-2 border-[#F7F1E8] dark:border-[#0E0D0B] bg-[#F7F1E8] dark:bg-[#141210] overflow-hidden flex items-center justify-center">
          {vendor.logoUrl ? (
            <img src={vendor.logoUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <Store className="w-5 h-5 text-[#E8772E]" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="px-3 pt-8 pb-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-[15px] font-bold leading-tight group-hover:text-[#E8772E] truncate">{vendor.businessName}</h2>
          <Badge tone={vendor.isOpen ? 'green' : 'neutral'}>{vendor.isOpen ? 'Open' : 'Closed'}</Badge>
        </div>
        <div className={`text-[12px] truncate ${mutedText}`}>
          {[vendor.category, vendor.area].filter(Boolean).join(' · ')}
        </div>
        {vendor.tagline && <div className={`text-[13px] line-clamp-2 ${mutedText}`}>{vendor.tagline}</div>}
        <div className="flex flex-wrap gap-1 pt-1">
          {vendor.offersDelivery && <Badge tone="orange">Delivery</Badge>}
          {vendor.offersPickup && <Badge>Pickup</Badge>}
          {!vendor.acceptingOrders && <Badge tone="red">Not taking orders</Badge>}
        </div>
      </div>
    </Link>
  );
}
