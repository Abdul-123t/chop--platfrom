import type { CustomerSessionDto } from './types';

const SESSION_KEY = 'chop-customer-session';
const LEGACY_KEYS = ['chop_current_user_v1', 'chop_registered_accounts_v1', 'chop_auth_session_v2', 'chop_auth_user_v2'];

export function readCustomerSession(): CustomerSessionDto | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CustomerSessionDto;
    return typeof parsed.token === 'string' && parsed.expiresAt > Date.now() ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCustomerSession(session: CustomerSessionDto | null): void {
  try {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    return;
  }
}

export function clearLegacyAccountData(): void {
  try {
    for (const key of LEGACY_KEYS) window.localStorage.removeItem(key);
  } catch {
    return;
  }
}
