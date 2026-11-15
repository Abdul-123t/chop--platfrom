import type { SubscriberStatus, SubscriberType } from '../types';

type Tone = 'orange' | 'green' | 'neutral' | 'red';

export const STATUS_META: Record<SubscriberStatus, { label: string; tone: Tone }> = {
  REGISTERED: { label: 'Registered', tone: 'neutral' },
  PENDING_REVIEW: { label: 'Pending review', tone: 'orange' },
  APPROVED: { label: 'Approved', tone: 'green' },
  REJECTED: { label: 'Rejected', tone: 'red' },
};

export function statusOptions(type: SubscriberType): SubscriberStatus[] {
  return type === 'vendor' ? ['PENDING_REVIEW', 'APPROVED', 'REJECTED'] : ['REGISTERED', 'APPROVED', 'REJECTED'];
}
