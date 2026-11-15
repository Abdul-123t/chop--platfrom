import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../services/api/admin';
import type { SessionResult } from '../types';

const STORAGE_KEY = 'chop-admin-session';

function readStored(): SessionResult | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionResult;
    return typeof parsed.token === 'string' && parsed.expiresAt > Date.now() ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(session: SessionResult | null): void {
  try {
    if (session) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}

export function useAdminSession() {
  const [session, setSession] = useState<SessionResult | null>(readStored);
  const [verifying, setVerifying] = useState(() => readStored() !== null);

  const logout = useCallback(() => {
    writeStored(null);
    setSession(null);
  }, []);

  const login = useCallback(async (password: string) => {
    const next = await adminApi.login(password);
    const stored = { token: next.token, expiresAt: next.expiresAt };
    writeStored(stored);
    setSession(stored);
  }, []);

  useEffect(() => {
    const stored = readStored();
    if (!stored) return;
    adminApi
      .checkSession(stored.token)
      .catch(() => logout())
      .finally(() => setVerifying(false));
  }, [logout]);

  useEffect(() => {
    if (!session) return;
    const timer = window.setTimeout(logout, Math.max(0, session.expiresAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [session, logout]);

  return { token: session?.token ?? null, verifying, login, logout };
}
