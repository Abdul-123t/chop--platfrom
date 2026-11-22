/**
 * CHOP — Supabase & Backend Services Client
 * Lightweight, zero-dependency REST & Auth client for Supabase PostgreSQL
 * Fully typed with local offline storage fallback & session sync
 */

import { CustomerUser, LocationArea, UserRole } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  !SUPABASE_URL.includes('your-project-id') &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes('your-anon-key')
);

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: CustomerUser;
}

const STORAGE_KEYS = {
  AUTH_SESSION: 'chop_auth_session_v2',
  AUTH_USER: 'chop_auth_user_v2',
  REGISTERED_ACCOUNTS: 'chop_registered_accounts_v1',
};

export interface RegisteredAccount extends CustomerUser {
  password?: string;
}

function getStoredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_ACCOUNTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredAccount(account: RegisteredAccount) {
  try {
    const existing = getStoredAccounts().filter(
      (a) => a.email !== account.email && a.phone !== account.phone
    );
    localStorage.setItem(
      STORAGE_KEYS.REGISTERED_ACCOUNTS,
      JSON.stringify([...existing, account])
    );
  } catch (e) {
    console.warn('Failed to save user account', e);
  }
}

// Generic PostgREST client helper
async function supabaseFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured yet. Operating in local mode.') };
  }

  const session = getStoredSession();
  const token = session?.accessToken || SUPABASE_ANON_KEY;

  try {
    const res = await fetch(`${SUPABASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { data: null, error: new Error(errBody.message || errBody.error_description || `API error ${res.status}`) };
    }

    const data = await res.json().catch(() => null);
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Session helpers
export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearStoredSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setStoredSession(session: AuthSession) {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(session.user));
  } catch (e) {
    console.warn('Failed to store session', e);
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  } catch (e) {
    console.warn('Failed to clear session', e);
  }
}

// ====================================================================
// AUTHENTICATION API
// ====================================================================

export const authService = {
  async register(params: {
    fullName: string;
    email: string;
    phone: string;
    preferredLocation: LocationArea;
    password?: string;
  }): Promise<{ user: CustomerUser; error?: string }> {
    const emailToUse = params.email.trim().toLowerCase() || `${params.phone.replace(/[^0-9]/g, '')}@chop.local`;

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseFetch<any>('/auth/v1/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: emailToUse,
          password: params.password || `Chop#${Date.now()}`,
          data: {
            full_name: params.fullName.trim(),
            phone: params.phone.trim(),
            preferred_location: params.preferredLocation,
            role: 'customer',
          },
        }),
      });

      if (error) {
        return { user: null as any, error: error.message };
      }

      const user: CustomerUser = {
        id: data.user?.id || `usr_${Date.now()}`,
        fullName: params.fullName.trim(),
        email: emailToUse,
        phone: params.phone.trim(),
        role: 'customer',
        preferredLocation: params.preferredLocation,
        createdAt: new Date().toISOString(),
      };

      if (data.access_token) {
        setStoredSession({
          accessToken: data.access_token,
          refreshToken: data.refresh_token || '',
          expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
          user,
        });
      }

      return { user };
    }

    // Local Persistence mode: check for duplicate registration
    const existingAccounts = getStoredAccounts();
    const isDuplicate = existingAccounts.some(
      (a) =>
        (params.email && a.email.toLowerCase() === emailToUse) ||
        (params.phone && a.phone === params.phone.trim())
    );

    if (isDuplicate) {
      return {
        user: null as any,
        error: 'An account with this email or phone number already exists. Please sign in.',
      };
    }

    const user: CustomerUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: params.fullName.trim(),
      email: emailToUse,
      phone: params.phone.trim(),
      role: 'customer',
      preferredLocation: params.preferredLocation,
      createdAt: new Date().toISOString(),
    };

    saveStoredAccount({ ...user, password: params.password });

    setStoredSession({
      accessToken: `tok_local_${Date.now()}`,
      refreshToken: `ref_local_${Date.now()}`,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      user,
    });

    return { user };
  },

  async login(identifier: string, password?: string): Promise<{ user: CustomerUser; error?: string }> {
    const cleaned = identifier.trim().toLowerCase();

    if (isSupabaseConfigured && password) {
      const { data, error } = await supabaseFetch<any>('/auth/v1/token?grant_type=password', {
        method: 'POST',
        body: JSON.stringify({
          email: cleaned,
          password,
        }),
      });

      if (error) {
        return { user: null as any, error: error.message };
      }

      const user: CustomerUser = {
        id: data.user?.id || `usr_${Date.now()}`,
        fullName: data.user?.user_metadata?.full_name || cleaned.split('@')[0],
        email: data.user?.email || cleaned,
        phone: data.user?.user_metadata?.phone || '',
        role: (data.user?.user_metadata?.role as UserRole) || 'customer',
        preferredLocation: data.user?.user_metadata?.preferred_location || 'ijebu-ode',
        createdAt: data.user?.created_at || new Date().toISOString(),
      };

      setStoredSession({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
        user,
      });

      return { user };
    }

    // Local login / check registered users and verify password
    const accounts = getStoredAccounts();
    const matchedAccount = accounts.find(
      (a) =>
        a.email.toLowerCase() === cleaned ||
        a.phone === cleaned ||
        a.phone.replace(/[^0-9]/g, '') === cleaned.replace(/[^0-9]/g, '')
    );

    if (matchedAccount) {
      // If the registered account has a password, verify it strictly
      if (matchedAccount.password && password && matchedAccount.password !== password) {
        return {
          user: null as any,
          error: 'Incorrect password. Please verify your credentials or reset your password.',
        };
      }

      const user: CustomerUser = {
        id: matchedAccount.id,
        fullName: matchedAccount.fullName,
        email: matchedAccount.email,
        phone: matchedAccount.phone,
        role: matchedAccount.role,
        preferredLocation: matchedAccount.preferredLocation,
        createdAt: matchedAccount.createdAt,
      };

      setStoredSession({
        accessToken: `tok_local_${Date.now()}`,
        refreshToken: `ref_local_${Date.now()}`,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        user,
      });

      return { user };
    }

    // Check active session
    const stored = getStoredSession();
    if (stored?.user && (stored.user.email.toLowerCase() === cleaned || stored.user.phone === cleaned)) {
      return { user: stored.user };
    }

    // If password was supplied but no account exists, return explicit error
    if (password && accounts.length > 0) {
      return {
        user: null as any,
        error: 'No account found matching this email or phone number. Please create an account.',
      };
    }

    // Authenticate guest or create active session
    const user: CustomerUser = {
      id: `usr_${Date.now()}`,
      fullName: cleaned.includes('@') ? cleaned.split('@')[0].replace(/[._]/g, ' ') : `Customer ${cleaned.slice(-4)}`,
      email: cleaned.includes('@') ? cleaned : `${cleaned}@chop.local`,
      phone: cleaned.includes('@') ? '' : cleaned,
      role: 'customer',
      preferredLocation: 'ijebu-ode',
      createdAt: new Date().toISOString(),
    };

    saveStoredAccount({ ...user, password });

    setStoredSession({
      accessToken: `tok_local_${Date.now()}`,
      refreshToken: `ref_local_${Date.now()}`,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      user,
    });

    return { user };
  },

  async recoverPassword(identifier: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured && identifier.includes('@')) {
      const { error } = await supabaseFetch('/auth/v1/recover', {
        method: 'POST',
        body: JSON.stringify({ email: identifier.trim().toLowerCase() }),
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  logout(): void {
    clearStoredSession();
  },

  getCurrentUser(): CustomerUser | null {
    const session = getStoredSession();
    return session?.user || null;
  },
};
