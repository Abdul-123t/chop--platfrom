import { Card } from '../../../components/ui/Card';
import { SignOutButton } from '../../../components/ui/SignOutButton';
import { mutedText } from '../../../components/ui/styles';
import { confirmVendorSignOut } from '../../navigation';
import { useVendor } from '../../VendorContext';
import { PageHeader } from '../PageHeader';
import { PasswordForm } from './PasswordForm';

export function SettingsPage() {
  const { overview, logout } = useVendor();
  const { vendor } = overview;
  const rows: Array<[string, string]> = [
    ['Owner', vendor.ownerName],
    ['WhatsApp', vendor.phone],
    ['Email', vendor.email || 'Not set. Add one in Store profile to get order emails.'],
    ['Store link', vendor.publicUrl],
  ];

  return (
    <div className="space-y-3">
      <PageHeader title="Settings" />
      <div className="grid gap-3 lg:grid-cols-2 [&>*]:min-w-0 items-start">
        <Card title="Account">
          <dl className="grid grid-cols-[90px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[13px]">
            {rows.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className={mutedText}>{label}</dt>
                <dd className="font-medium break-words">{value}</dd>
              </div>
            ))}
          </dl>
          <p className={`mt-3 text-[12px] ${mutedText}`}>
            To change your WhatsApp number, contact the CHOP team. You sign in with your email or this number.
          </p>
          <div className="mt-3 pt-3 border-t border-[#0E0D0B]/10 dark:border-white/[0.08]">
            <SignOutButton onClick={() => confirmVendorSignOut(logout)} />
          </div>
        </Card>
        <PasswordForm />
      </div>
    </div>
  );
}
