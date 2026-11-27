import { useEffect, useState, type FormEvent } from 'react';
import '../index.css';
import { marketplaceApi } from '../api/client';
import { writeCustomerSession } from '../api/customerSession';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E2DA] text-sm text-[#191919] focus:outline-none focus:border-[#141414]';

export default function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    document.title = 'Reset password · CHOP';
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setError('Choose a password with at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setPending(true);
    setError('');
    try {
      writeCustomerSession(await marketplaceApi.reset(token, password));
      window.location.assign('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not reset your password.');
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#191919] flex items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl border border-[#E6E2DA] p-6 space-y-4">
        <a href="/" className="font-display text-2xl font-extrabold text-[#141414]">
          CHOP<span className="text-[#C45B3A]">.</span>
        </a>
        <div>
          <h1 className="font-display text-lg font-bold text-[#141414]">Choose a new password</h1>
          <p className="text-xs text-[#77736C] mt-1">Use at least 8 characters.</p>
        </div>
        {!token ? (
          <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
            This reset link is incomplete. Request a new one from the sign in screen.
          </p>
        ) : (
          <>
            <label className="block text-xs font-bold text-[#141414]">
              New password
              <input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} mt-1.5`} />
            </label>
            <label className="block text-xs font-bold text-[#141414]">
              Confirm password
              <input type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className={`${inputClass} mt-1.5`} />
            </label>
            {error && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 rounded-xl bg-[#141414] text-white text-sm font-semibold hover:bg-black disabled:opacity-50"
            >
              {pending ? 'Saving…' : 'Save password and sign in'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
