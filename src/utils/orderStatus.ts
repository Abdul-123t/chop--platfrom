export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'READY' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export type Fulfilment = 'DELIVERY' | 'PICKUP';

type Tone = 'orange' | 'green' | 'neutral' | 'red';

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: Tone }> = {
  PENDING: { label: 'New', tone: 'orange' },
  ACCEPTED: { label: 'Preparing', tone: 'orange' },
  READY: { label: 'Ready', tone: 'green' },
  OUT_FOR_DELIVERY: { label: 'On the way', tone: 'green' },
  COMPLETED: { label: 'Completed', tone: 'neutral' },
  REJECTED: { label: 'Rejected', tone: 'red' },
  CANCELLED: { label: 'Cancelled', tone: 'red' },
};

export const ACTION_LABELS: Record<OrderStatus, string> = {
  PENDING: 'New',
  ACCEPTED: 'Accept',
  READY: 'Mark ready',
  OUT_FOR_DELIVERY: 'Out for delivery',
  COMPLETED: 'Complete',
  REJECTED: 'Reject',
  CANCELLED: 'Cancel order',
};

export function trackingSteps(fulfilment: Fulfilment): OrderStatus[] {
  return fulfilment === 'DELIVERY'
    ? ['PENDING', 'ACCEPTED', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED']
    : ['PENDING', 'ACCEPTED', 'READY', 'COMPLETED'];
}

export function isClosedStatus(status: OrderStatus): boolean {
  return status === 'COMPLETED' || status === 'REJECTED' || status === 'CANCELLED';
}

export function timeAgo(iso: string, now = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}
