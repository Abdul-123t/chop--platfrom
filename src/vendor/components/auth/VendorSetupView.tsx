import { useCallback, useState, type FormEvent } from 'react';
import { KeyRound } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Field } from '../../../components/ui/Field';
import { mutedText } from '../../../components/ui/styles';
import { usePublicQuery } from '../../../hooks/usePublicQuery';
import { Link } from '../../../router/Link';
import { navigate } from '../../../router/navigation';
import { VENDOR_PATH } from '../../../services/api/env';
import { vendorApi } from '../../../services/api/vendor';
import type { VendorSession } from '../../types';
import { AuthCard } from './AuthCard';
import { PasswordInput } from './PasswordInput';

interface VendorSetupViewProps {
  token: string;
  onComplete: (session: VendorSession) => void;
}

export function VendorSetupView({ token, onComplete }: VendorSetupViewProps) {
  const loader = useCallback(() => vendorApi.inspectSetup(token), [token]);
  const check = usePublicQuery(loader);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const account = check.data?.account;
  const mismatch = confirm.length > 0 && confirm !== password;
  const tooShort = password.length > 0 && password.length < 8;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8 || password !== confirm) return;
    setPending(true);
    setError(null);
    try {
      onComplete(await vendorApi.completeSetup(token, password));
      navigate(VENDOR_PATH, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save your password.');
      setPending(false);
    }
  };

  if (check.loading && !account) {
    return <div className={`min-h-screen flex items-center justify-center text-[13px] ${mutedText}`}>Checking your link…</div>;
  }

  if (!account) {
    return (
      <AuthCard title="This link has expired" subtitle="Setup links work for 7 days and only once.">
        <Alert tone="error">{check.error?.message ?? 'This setup link is not valid.'}</Alert>
        <p className={`text-[13px] ${mutedText}`}>
          Ask the CHOP team for a new link, or reset your password if you already set one up.
        </p>
        <div className="flex flex-col gap-2">
          <Link to={`${VENDOR_PATH}/forgot`} className="text-[13px] font-semibold text-[#E8772E] hover:underline">
            Reset my password
          </Link>
          <Link to={VENDOR_PATH} className="text-[13px] font-semibold text-[#E8772E] hover:underline">
            Go to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  const firstName = account.ownerName.split(/\s+/)[0] || 'there';

  return (
    <AuthCard
      title={account.activated ? 'Choose a new password' : `Welcome, ${firstName}`}
      subtitle={
        account.activated
          ? `Set a new password for ${account.businessName}.`
          : `Create a password to set up ${account.businessName} on CHOP.`
      }
      onSubmit={handleSubmit}
    >
      <div className={`rounded-xl border border-[#0E0D0B]/10 dark:border-white/[0.08] px-3 py-2 text-[13px] ${mutedText}`}>
        You will sign in with <strong className="text-[#0E0D0B] dark:text-[#F7F1E8]">{account.email || account.phone}</strong>
        {account.email && account.phone ? ' or your WhatsApp number' : ''}.
      </div>
      <Field label="New password" htmlFor="setup-password" error={tooShort ? 'Use at least 8 characters.' : undefined}>
        <PasswordInput id="setup-password" value={password} onChange={setPassword} autoComplete="new-password" autoFocus />
      </Field>
      <Field label="Confirm password" htmlFor="setup-confirm" error={mismatch ? 'Passwords do not match.' : undefined}>
        <PasswordInput id="setup-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
      </Field>
      {error && <Alert tone="error">{error}</Alert>}
      <Button
        type="submit"
        loading={pending}
        disabled={password.length < 8 || password !== confirm}
        icon={<KeyRound className="w-3.5 h-3.5" aria-hidden="true" />}
        className="w-full py-2.5"
      >
        {account.activated ? 'Save new password' : 'Create password and continue'}
      </Button>
    </AuthCard>
  );
}
