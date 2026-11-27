import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Field } from '../../../components/ui/Field';
import { fieldClass, mutedText } from '../../../components/ui/styles';
import { Link } from '../../../router/Link';
import { VENDOR_PATH } from '../../../services/api/env';
import { vendorApi } from '../../../services/api/vendor';
import { AuthCard } from './AuthCard';

export function VendorForgotView() {
  const [identifier, setIdentifier] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!identifier.trim()) return;
    setPending(true);
    setError(null);
    try {
      await vendorApi.forgot(identifier.trim());
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not send the link.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="We will email you a link to choose a new password."
      onSubmit={handleSubmit}
      footer={
        <Link to={VENDOR_PATH} className="font-semibold text-[#E8772E] hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <Alert tone="success">
          If that account has an email on file, a reset link is on its way. Check your inbox and spam folder.
        </Alert>
      ) : (
        <>
          <Field label="Email or WhatsApp number" htmlFor="forgot-identifier">
            <input
              id="forgot-identifier"
              type="text"
              autoComplete="username"
              autoFocus
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className={fieldClass}
            />
          </Field>
          {error && <Alert tone="error">{error}</Alert>}
          <Button
            type="submit"
            loading={pending}
            disabled={!identifier.trim()}
            icon={<Send className="w-3.5 h-3.5" aria-hidden="true" />}
            className="w-full py-2.5"
          >
            Send reset link
          </Button>
        </>
      )}
      <p className={`text-[12px] ${mutedText}`}>
        No email on your account? Message the CHOP team on WhatsApp and we will send you a new setup link.
      </p>
    </AuthCard>
  );
}
