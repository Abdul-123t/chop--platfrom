import { useSyncExternalStore } from 'react';

const NAVIGATE_EVENT = 'chop:navigate';

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  if (options.replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
  window.scrollTo({ top: 0 });
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('popstate', callback);
  window.addEventListener(NAVIGATE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(NAVIGATE_EVENT, callback);
  };
}

function snapshot(): string {
  return `${window.location.pathname}${window.location.search}`;
}

export interface LocationState {
  path: string;
  query: URLSearchParams;
}

export function useLocation(): LocationState {
  const value = useSyncExternalStore(subscribe, snapshot);
  const url = new URL(value, window.location.origin);
  return { path: normalizePath(url.pathname), query: url.searchParams };
}

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index] ?? '';
    const actual = pathParts[index] ?? '';
    if (expected.startsWith(':')) params[expected.slice(1)] = decodeURIComponent(actual);
    else if (expected !== actual) return null;
  }
  return params;
}
