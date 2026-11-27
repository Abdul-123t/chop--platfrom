const STORAGE_KEY = 'chop-recent-orders';
const LIMIT = 10;

export function recentOrders(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown;
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export function rememberOrder(orderId: string): void {
  try {
    const next = [orderId, ...recentOrders().filter((value) => value !== orderId)].slice(0, LIMIT);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return;
  }
}
