export type SubscriberType = 'customer' | 'vendor';

export type SubscriberStatus = 'REGISTERED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface VendorDetails {
  category: string;
  otherCategory: string;
  delivers: string;
  operatingModel: string;
  operatingLocations: string[];
  address: string;
  businessDescription: string;
  fulfilmentOptions: string[];
  socialMediaLink: string;
  additionalComments: string;
}

export interface Subscriber {
  id: string;
  type: SubscriberType;
  name: string;
  businessName: string;
  email: string;
  whatsapp: string;
  area: string;
  student: string;
  interests: string[];
  status: SubscriberStatus;
  adminNotes: string;
  joinedAt: string;
  reviewedAt: string;
  subscribed: boolean;
  vendor: VendorDetails | null;
}

export interface SubscriberUpdate {
  status?: SubscriberStatus;
  adminNotes?: string;
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
