import React, { useState } from 'react';
import { KeyRound, LogOut, Save } from 'lucide-react';
import { useStore } from '../../lib/store';
import type { LocationArea } from '../../types';
import { card, errorBox, errorText, input, label, primaryButton, secondaryButton, successBox } from './accountStyles';

function ProfileForm() {
  const { currentUser, updateProfile } = useStore();
  const [fullName, setFullName] = useState(currentUser?.fullName ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [area, setArea] = useState<LocationArea>(currentUser?.preferredLocation ?? 'ijebu-ode');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError('');
    setSaved(false);
    try {
      await updateProfile({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), preferredLocation: area });
      setSaved(true);
    } catch (caught) {
      setError(errorText(caught, 'Could not save your details.'));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${card} p-4 space-y-3`}>
      <h2 className="font-display text-sm font-bold text-[#141414]">Your details</h2>
      <label className={label}>
        Full name
        <input value={fullName} maxLength={80} onChange={(event) => setFullName(event.target.value)} autoComplete="name" className={`${input} mt-1.5`} />
      </label>
      <label className={label}>
        Phone number
        <input value={phone} maxLength={20} onChange={(event) => setPhone(event.target.value)} type="tel" autoComplete="tel" className={`${input} mt-1.5`} />
      </label>
      <label className={label}>
        Email (optional, for receipts and password resets)
        <input value={email} maxLength={254} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" className={`${input} mt-1.5`} />
      </label>
      <label className={label}>
        Usual area
        <select value={area} onChange={(event) => setArea(event.target.value as LocationArea)} className={`${input} mt-1.5`}>
          <option value="ijebu-ode">Ijebu Ode</option>
          <option value="ijagun">Ijagun (TASUED)</option>
        </select>
      </label>
      {error && <p className={errorBox}>{error}</p>}
      {saved && <p className={successBox}>Saved.</p>}
      <button type="submit" disabled={pending} className={primaryButton}>
        <Save className="w-3.5 h-3.5" />
        {pending ? 'Saving…' : 'Save details'}
      </button>
    </form>
  );
}

function PasswordForm() {
  const { changePassword } = useStore();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setDone(false);
    if (next.length < 8) {
      setError('Use at least 8 characters for your new password.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    setPending(true);
    try {
      await changePassword(current, next);
      setCurrent('');
      setNext('');
      setConfirm('');
      setDone(true);
    } catch (caught) {
      setError(errorText(caught, 'Could not change your password.'));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${card} p-4 space-y-3`}>
      <h2 className="font-display text-sm font-bold text-[#141414]">Change password</h2>
      <label className={label}>
        Current password
        <input type="password" value={current} onChange={(event) => setCurrent(event.target.value)} autoComplete="current-password" className={`${input} mt-1.5`} />
      </label>
      <label className={label}>
        New password
        <input type="password" value={next} onChange={(event) => setNext(event.target.value)} autoComplete="new-password" className={`${input} mt-1.5`} />
      </label>
      <label className={label}>
        Confirm new password
        <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" className={`${input} mt-1.5`} />
      </label>
      {error && <p className={errorBox}>{error}</p>}
      {done && <p className={successBox}>Password changed. Other devices have been signed out.</p>}
      <button type="submit" disabled={pending || !current || !next} className={primaryButton}>
        <KeyRound className="w-3.5 h-3.5" />
        {pending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}

export const AccountProfile: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => (
  <div className="grid gap-3 md:grid-cols-2 items-start">
    <ProfileForm />
    <div className="space-y-3">
      <PasswordForm />
      <button type="button" onClick={onSignOut} className={`${secondaryButton} w-full hover:!text-red-600`}>
        <LogOut className="w-3.5 h-3.5" />
        Sign out
      </button>
    </div>
  </div>
);
