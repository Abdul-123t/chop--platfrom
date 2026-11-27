function normalizePath(path: string): string {
  const trimmed = path.trim().replace(/\/+$/, '');
  if (!trimmed) return '/admin';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');

export const ADMIN_PATH = normalizePath(import.meta.env.VITE_ADMIN_PATH ?? '/admin');

export const UNSUBSCRIBE_PATH = '/unsubscribe';

export const VENDOR_PATH = '/vendor';

export const DIRECTORY_PATH = '/vendors';

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export const WAITLIST_ENDPOINT = apiUrl('/api/waitlist');
