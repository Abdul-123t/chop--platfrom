import { useState } from 'react';
import { Check, Copy, ExternalLink, Share2 } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Toggle } from '../../../components/ui/Toggle';
import { mutedText } from '../../../components/ui/styles';
import { useProfileSaver } from '../../hooks/useProfileSaver';
import type { VendorProfile } from '../../types';

interface StoreStatusCardProps {
  vendor: VendorProfile;
  readyToPublish: boolean;
}

export function StoreStatusCard({ vendor, readyToPublish }: StoreStatusCardProps) {
  const { save, pending, error } = useProfileSaver();
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(vendor.publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy your store link', vendor.publicUrl);
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({ title: vendor.businessName, text: `Order from ${vendor.businessName} on CHOP`, url: vendor.publicUrl }).catch(() => undefined);
    } else {
      await copyLink();
    }
  };

  return (
    <Card
      title="Your store"
      actions={
        <div className="flex flex-wrap gap-1">
          <Badge tone={vendor.published ? 'green' : 'neutral'}>{vendor.published ? 'Live on CHOP' : 'Not live yet'}</Badge>
          <Badge tone={vendor.isOpen ? 'green' : 'neutral'}>{vendor.isOpen ? 'Open now' : 'Closed now'}</Badge>
        </div>
      }
    >
      <div className="space-y-4">
        <Toggle
          label="Show my store on CHOP"
          description={
            vendor.published
              ? 'Customers can find your page and menu.'
              : readyToPublish
                ? 'You are ready. Turn this on to go live.'
                : 'Finish the checklist below first.'
          }
          checked={vendor.published}
          disabled={pending || (!vendor.published && !readyToPublish)}
          onChange={(published) => void save({ published })}
        />
        <Toggle
          label="Accepting orders"
          description={
            vendor.acceptingOrders
              ? 'Customers can place orders right now.'
              : 'Turn this off when you are busy or closed. Your menu stays visible.'
          }
          checked={vendor.acceptingOrders}
          disabled={pending}
          onChange={(acceptingOrders) => void save({ acceptingOrders })}
        />
        {error && <Alert tone="error">{error}</Alert>}

        <div className="rounded-xl border border-[#0E0D0B]/10 dark:border-white/[0.08] p-3 space-y-2">
          <div className={`text-[12px] font-semibold uppercase tracking-wide ${mutedText}`}>Store link</div>
          <div className="text-[13px] font-semibold break-all">{vendor.publicUrl}</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              icon={copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={() => void copyLink()}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="secondary" icon={<Share2 className="w-3.5 h-3.5" aria-hidden="true" />} onClick={() => void shareLink()}>
              Share
            </Button>
            {vendor.published && (
              <a
                href={vendor.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold text-[#E8772E] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                View page
              </a>
            )}
          </div>
          {!vendor.published && (
            <p className={`text-[12px] ${mutedText}`}>The link starts working once your store is live.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
