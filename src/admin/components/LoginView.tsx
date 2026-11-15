import { useState, type FormEvent } from 'react';
import { LockKeyhole } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Wordmark } from '../../components/ui/Wordmark';
import { cardClass, fieldClass, labelClass, mutedText } from '../../components/ui/styles';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;
    setPending(true);
    setError(null);
    try {
      await onLogin(email.trim(), password);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not sign in.');
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className={`${cardClass} w-full max-w-sm p-6 space-y-4`}>
        <div className="space-y-1">
          <Wordmark suffix="Admin" />
          <div className={`text-[13px] ${mutedText}`}>Sign in to manage the waitlist and newsletters.</div>
        </div>
        <div>
          <label htmlFor="admin-email" className={labelClass}>
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="admin-password" className={labelClass}>
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
          />
        </div>
        {error && <Alert tone="error">{error}</Alert>}
        <Button
          type="submit"
          loading={pending}
          disabled={!email || !password}
          icon={<LockKeyhole className="w-3.5 h-3.5" aria-hidden="true" />}
          className="w-full py-2.5"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
}
