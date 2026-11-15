export type SubscriberType = 'customer' | 'vendor';

export interface Subscriber {
  id: string;
  type: SubscriberType;
  name: string;
  businessName: string;
  email: string;
  whatsapp: string;
  area: string;
  interests: string[];
  status: string;
  joinedAt: string;
  subscribed: boolean;
}

export interface SubscriberStats {
  total: number;
  customers: number;
  vendors: number;
  withEmail: number;
  unsubscribed: number;
  reachable: number;
}

export interface SubscribersOverview {
  subscribers: Subscriber[];
  stats: SubscriberStats;
}

export interface NewsletterContent {
  subject: string;
  message: string;
}

export type AudienceKind = 'all' | 'customers' | 'vendors' | 'selected';

export type Audience =
  | { kind: 'all' }
  | { kind: 'customers' }
  | { kind: 'vendors' }
  | { kind: 'selected'; ids: string[] };

export interface NewsletterLogEntry {
  id: string;
  sentAt: string;
  subject: string;
  audience: string;
  recipients: number;
  delivered: number;
  failed: number;
}

export interface PreviewResult {
  subject: string;
  html: string;
  text: string;
}

export interface SessionResult {
  token: string;
  expiresAt: number;
}

export type TypeFilter = 'all' | SubscriberType;

export type AdminTab = 'subscribers' | 'newsletter';
