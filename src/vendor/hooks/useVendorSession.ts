import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../services/api/http';
import { vendorApi } from '../../services/api/vendor';
import type { VendorSession } from '../types';

const STORAGE_KEY = 'chop-vendor-session';

function readStored(): VendorSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VendorSession;
    return typeof parsed.token === 'string' && parsed.expiresAt > Date.now() ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(session: VendorSession | null): void {
  try {
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}

export function useVendorSession() {
  const [session, setSession] = useState<VendorSession | null>(readStored);
  const [verifying, setVerifying] = useState(() => readStored() !== null);

  const start = useCallback((next: VendorSession) => {
    writeStored(next);
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    writeStored(null);
    setSession(null);
  }, []);

  useEffect(() => {
    const stored = readStored();
    if (!stored) return;
    vendorApi
      .checkSession(stored.token)
      .then((result) => start({ ...stored, businessName: result.businessName, slug: result.slug }))
      .catch((error: unknown) => {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) logout();
      })
      .finally(() => setVerifying(false));
  }, [start, logout]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      start(await vendorApi.login(identifier, password));
    },
    [start]
  );

  return { session, verifying, login, start, logout };
}
