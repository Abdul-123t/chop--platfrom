import { useState, type FormEvent } from 'react';
import { KeyRound } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { ApiError } from '../../../services/api/http';
import { vendorApi } from '../../../services/api/vendor';
import { useVendor } from '../../VendorContext';
import { PasswordInput } from '../auth/PasswordInput';

export function PasswordForm() {
  const { token, logout, replaceSession } = useVendor();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const valid = current.length > 0 && next.length >= 8;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    setPending(true);
    setError(null);
    setDone(false);
    try {
      replaceSession(await vendorApi.changePassword(token, current, next));
      setCurrent('');
      setNext('');
      setDone(true);
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) logout();
      else setError(caught instanceof Error ? caught.message : 'Could not change your password.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Card title="Change password">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Current password" htmlFor="current-password">
          <PasswordInput id="current-password" value={current} onChange={setCurrent} autoComplete="current-password" />
        </Field>
        <Field label="New password" htmlFor="new-password" hint="At least 8 characters. Other devices will be signed out.">
          <PasswordInput id="new-password" value={next} onChange={setNext} autoComplete="new-password" />
        </Field>
        {error && <Alert tone="error">{error}</Alert>}
        {done && <Alert tone="success">Password changed.</Alert>}
        <Button type="submit" loading={pending} disabled={!valid} icon={<KeyRound className="w-3.5 h-3.5" aria-hidden="true" />}>
          Update password
        </Button>
      </form>
    </Card>
  );
}
