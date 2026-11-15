import type { Audience, Subscriber, SubscriberStatus, TypeFilter } from '../types';

export interface SubscriberFilters {
  query: string;
  type: TypeFilter;
  status: 'all' | SubscriberStatus;
  emailOnly: boolean;
}

export function isReachable(subscriber: Subscriber): boolean {
  return Boolean(subscriber.email) && subscriber.subscribed;
}

export function filterSubscribers(subscribers: Subscriber[], filters: SubscriberFilters): Subscriber[] {
  const query = filters.query.trim().toLowerCase();
  return subscribers.filter((subscriber) => {
    if (filters.type !== 'all' && subscriber.type !== filters.type) return false;
    if (filters.status !== 'all' && subscriber.status !== filters.status) return false;
    if (filters.emailOnly && !isReachable(subscriber)) return false;
    if (!query) return true;
    return [subscriber.name, subscriber.businessName, subscriber.email, subscriber.whatsapp, subscriber.area]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
}

export function countRecipients(subscribers: Subscriber[], audience: Audience): number {
  const selected = new Set(audience.kind === 'selected' ? audience.ids : []);
  const emails = new Set<string>();
  for (const subscriber of subscribers) {
    if (!isReachable(subscriber)) continue;
    if (audience.kind === 'customers' && subscriber.type !== 'customer') continue;
    if (audience.kind === 'vendors' && subscriber.type !== 'vendor') continue;
    if (audience.kind === 'selected' && !selected.has(subscriber.id)) continue;
    emails.add(subscriber.email.trim().toLowerCase());
  }
  return emails.size;
}

export function displayName(subscriber: Subscriber): string {
  return subscriber.type === 'vendor' && subscriber.businessName ? subscriber.businessName : subscriber.name;
}
