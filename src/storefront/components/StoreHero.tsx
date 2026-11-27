import { Bike, Clock, MapPin, ShoppingBag, Store } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { mutedText } from '../../components/ui/styles';
import { describeDay, todayHours } from '../../utils/hours';
import { formatNaira } from '../../utils/money';
import type { StoreVendor } from '../types';

function Fact({ icon: Icon, children }: { icon: typeof Clock; children: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] ${mutedText}`}>
      <Icon className="w-4 h-4 text-[#E8772E]" aria-hidden="true" />
      {children}
    </span>
  );
}

export function StoreHero({ vendor }: { vendor: StoreVendor }) {
  const today = describeDay(todayHours(vendor.hours));

  return (
    <section className="space-y-3">
      <div className="relative aspect-[16/7] sm:aspect-[3/1] rounded-3xl overflow-hidden bg-gradient-to-br from-[#E8772E]/30 to-[#341307]">
        {vendor.coverUrl && <img src={vendor.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      </div>
      <div className="flex items-start gap-3 -mt-10 sm:-mt-12 px-2 relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full border-4 border-[#F7F1E8] dark:border-[#0E0D0B] bg-[#F7F1E8] dark:bg-[#141210] overflow-hidden flex items-center justify-center shadow-lg">
          {vendor.logoUrl ? (
            <img src={vendor.logoUrl} alt={`${vendor.businessName} logo`} className="w-full h-full object-cover" />
          ) : (
            <Store className="w-8 h-8 text-[#E8772E]" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="px-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight leading-tight">{vendor.businessName}</h1>
          <Badge tone={vendor.isOpen ? 'green' : 'neutral'}>{vendor.isOpen ? 'Open now' : 'Closed now'}</Badge>
        </div>
        {vendor.tagline && <p className="text-[15px]">{vendor.tagline}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <Fact icon={Clock}>{`Today: ${today}`}</Fact>
          {vendor.area && <Fact icon={MapPin}>{vendor.area}</Fact>}
          {vendor.offersDelivery && (
            <Fact icon={Bike}>{vendor.deliveryFee > 0 ? `Delivery ${formatNaira(vendor.deliveryFee)}` : 'Free delivery'}</Fact>
          )}
          {vendor.offersPickup && <Fact icon={ShoppingBag}>Pickup</Fact>}
        </div>
        {vendor.minimumOrder > 0 && (
          <p className={`text-[12px] ${mutedText}`}>Minimum order {formatNaira(vendor.minimumOrder)}</p>
        )}
      </div>
    </section>
  );
}
