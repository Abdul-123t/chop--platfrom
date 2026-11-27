import { useVendor } from '../../VendorContext';
import { PageHeader } from '../PageHeader';
import { BrandingSection } from './BrandingSection';
import { DetailsSection } from './DetailsSection';
import { HoursSection } from './HoursSection';
import { OrderingSection } from './OrderingSection';

export function ProfilePage() {
  const { overview } = useVendor();
  const { vendor } = overview;

  return (
    <div className="space-y-3">
      <PageHeader title="Store profile" subtitle="This is what customers see on your CHOP page." />
      <div className="grid gap-3 lg:grid-cols-2 [&>*]:min-w-0 items-start">
        <div className="space-y-3">
          <BrandingSection vendor={vendor} />
          <DetailsSection key={`details-${vendor.id}`} vendor={vendor} />
        </div>
        <div className="space-y-3">
          <OrderingSection key={`ordering-${vendor.id}`} vendor={vendor} />
          <HoursSection key={`hours-${vendor.id}`} vendor={vendor} />
        </div>
      </div>
    </div>
  );
}
