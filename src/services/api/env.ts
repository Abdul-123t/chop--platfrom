import { CHOP_CONFIG } from '../../config';

function normalizePath(path: string): string {
  const trimmed = path.trim().replace(/\/+$/, '');
  if (!trimmed) return '/admin';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');

export const ADMIN_PATH = normalizePath(import.meta.env.VITE_ADMIN_PATH ?? '/admin');

export const UNSUBSCRIBE_PATH = '/unsubscribe';

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

export const WAITLIST_ENDPOINT = API_BASE_URL ? apiUrl('/api/waitlist') : CHOP_CONFIG.formEndpoint;
