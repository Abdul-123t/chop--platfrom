import { useState, type FormEvent } from 'react';
import { LogIn } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Field } from '../../../components/ui/Field';
import { fieldClass } from '../../../components/ui/styles';
import { Link } from '../../../router/Link';
import { VENDOR_PATH } from '../../../services/api/env';
import { AuthCard } from './AuthCard';
import { PasswordInput } from './PasswordInput';

interface VendorLoginViewProps {
  onLogin: (identifier: string, password: string) => Promise<void>;
}

export function VendorLoginView({ onLogin }: VendorLoginViewProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!identifier.trim() || !password) return;
    setPending(true);
    setError(null);
    try {
      await onLogin(identifier.trim(), password);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not sign in.');
      setPending(false);
    }
  };

  return (
    <AuthCard
      title="Sign in to your store"
      subtitle="Manage your menu, orders and store page."
      onSubmit={handleSubmit}
      footer={
        <>
          Not on CHOP yet?{' '}
          <Link to="/waitlist#waitlist" className="font-semibold text-[#E8772E] hover:underline">
            Apply as a vendor
          </Link>
        </>
      }
    >
      <Field label="Email or WhatsApp number" htmlFor="vendor-identifier">
        <input
          id="vendor-identifier"
          type="text"
          inputMode="email"
          autoComplete="username"
          autoFocus
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="you@example.com or 0801 234 5678"
          className={fieldClass}
        />
      </Field>
      <Field label="Password" htmlFor="vendor-password">
        <PasswordInput id="vendor-password" value={password} onChange={setPassword} autoComplete="current-password" />
      </Field>
      {error && <Alert tone="error">{error}</Alert>}
      <Button
        type="submit"
        loading={pending}
        disabled={!identifier.trim() || !password}
        icon={<LogIn className="w-3.5 h-3.5" aria-hidden="true" />}
        className="w-full py-2.5"
      >
        Sign in
      </Button>
      <div className="text-center">
        <Link to={`${VENDOR_PATH}/forgot`} className="text-[13px] font-semibold text-[#E8772E] hover:underline">
          Forgot password?
        </Link>
      </div>
    </AuthCard>
  );
}
