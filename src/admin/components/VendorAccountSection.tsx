import { useState } from 'react';
import { Check, Copy, ExternalLink, Mail, Store } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mutedText } from '../../components/ui/styles';
import { useAuthorizedAction } from '../../hooks/useAuthorizedAction';
import { adminApi } from '../../services/api/admin';
import { whatsappLink } from '../../utils/whatsapp';
import type { Subscriber, VendorAccountResult } from '../types';

interface VendorAccountSectionProps {
  token: string;
  subscriber: Subscriber;
  onUnauthorized: () => void;
}

export function VendorAccountSection({ token, subscriber, onUnauthorized }: VendorAccountSectionProps) {
  const action = useAuthorizedAction(onUnauthorized);
  const [link, setLink] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const account = subscriber.account;

  const apply = (result: VendorAccountResult | null) => {
    if (result?.setupLink) setLink(result.setupLink.url);
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy the setup link', value);
    }
  };

  const create = async () => apply(await action.run(() => adminApi.createVendorAccount(token, subscriber.id)));

  const generate = async () => {
    if (!account) return;
    apply(await action.run(() => adminApi.vendorSetupLink(token, account.id)));
  };

  const email = async () => {
    if (!account) return;
    const result = await action.run(() => adminApi.emailVendorLink(token, account.id));
    if (result) setNotice(`Link emailed to ${result.sentTo}.`);
  };

  const toggleSuspended = async () => {
    if (!account) return;
    const suspend = !account.suspended;
    if (suspend && !window.confirm(`Pause ${subscriber.businessName}? Their page goes offline and they cannot sign in.`)) return;
    await action.run(() => adminApi.setVendorSuspended(token, account.id, suspend));
  };

  const whatsappMessage = link
    ? `Hi ${subscriber.name.split(/\s+/)[0] ?? ''}, ${subscriber.businessName} is approved on CHOP. Set up your store here (link works for 7 days): ${link}`
    : '';

  return (
    <section className="space-y-2">
      <h3 className={`text-[11px] font-bold uppercase tracking-wide ${mutedText}`}>Vendor account</h3>

      {!account ? (
        <div className="space-y-2">
          <p className={`text-[13px] ${mutedText}`}>
            {subscriber.status === 'APPROVED'
              ? 'Create their store account, then send them the setup link.'
              : 'Approve this application first, then create their store account.'}
          </p>
          <Button
            icon={<Store className="w-3.5 h-3.5" aria-hidden="true" />}
            loading={action.pending}
            disabled={subscriber.status !== 'APPROVED'}
            onClick={() => void create()}
          >
            Create vendor account
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge tone={account.activated ? 'green' : 'orange'}>{account.activated ? 'Signed up' : 'Invite pending'}</Badge>
            <Badge tone={account.published ? 'green' : 'neutral'}>{account.published ? 'Live' : 'Not live'}</Badge>
            {account.suspended && <Badge tone="red">Paused</Badge>}
          </div>
          <a
            href={account.publicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#E8772E] hover:underline break-all"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {account.publicUrl.replace(/^https?:\/\//, '')}
          </a>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" loading={action.pending} onClick={() => void generate()}>
              {account.activated ? 'Password reset link' : 'Setup link'}
            </Button>
            {subscriber.email && (
              <Button
                variant="secondary"
                disabled={action.pending}
                icon={<Mail className="w-3.5 h-3.5" aria-hidden="true" />}
                onClick={() => void email()}
              >
                Email link
              </Button>
            )}
            <Button variant="ghost" disabled={action.pending} onClick={() => void toggleSuspended()}>
              {account.suspended ? 'Unpause store' : 'Pause store'}
            </Button>
          </div>
        </div>
      )}

      {link && (
        <div className="rounded-xl border border-[#0E0D0B]/10 dark:border-white/[0.08] p-3 space-y-2">
          <div className={`text-[12px] ${mutedText}`}>Setup link (works for 7 days, once):</div>
          <div className="text-[12px] font-mono break-all">{link}</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              icon={copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={() => void copy(link)}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <a
              href={whatsappLink(subscriber.whatsapp, whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#25D366] text-[#0E0D0B] px-3.5 py-2 text-[13px] font-bold hover:opacity-90"
            >
              Send on WhatsApp
            </a>
          </div>
        </div>
      )}

      {notice && <Alert tone="success">{notice}</Alert>}
      {action.error && <Alert tone="error">{action.error}</Alert>}
    </section>
  );
}
