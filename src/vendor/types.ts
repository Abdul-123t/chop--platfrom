import type { DayHours } from '../utils/hours';
import type { Fulfilment, OrderStatus } from '../utils/orderStatus';

export type VendorSection = 'overview' | 'orders' | 'menu' | 'profile' | 'settings';

export interface VendorSession {
  token: string;
  expiresAt: number;
  businessName: string;
  slug: string;
}

export interface SetupAccount {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  activated: boolean;
}

export interface VendorProfile {
  id: string;
  slug: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  category: string;
  tagline: string;
  description: string;
  area: string;
  address: string;
  locations: string[];
  socialLink: string;
  logoUrl: string;
  coverUrl: string;
  hours: DayHours[];
  offersDelivery: boolean;
  offersPickup: boolean;
  deliveryFee: number;
  minimumOrder: number;
  prepTimeMinutes: number;
  paymentNote: string;
  acceptingOrders: boolean;
  published: boolean;
  suspended: boolean;
  isOpen: boolean;
  publicUrl: string;
}

export type ProfileUpdate = Partial<
  Omit<VendorProfile, 'id' | 'slug' | 'ownerName' | 'phone' | 'suspended' | 'isOpen' | 'publicUrl' | 'logoUrl' | 'coverUrl'>
> & { logoUrl?: null; coverUrl?: null };

export interface ReadinessItem {
  key: string;
  label: string;
  done: boolean;
}

export interface ProfileState {
  vendor: VendorProfile;
  checklist: ReadinessItem[];
  readyToPublish: boolean;
}

export interface VendorStats {
  today: { orders: number; sales: number };
  week: { orders: number; sales: number };
  pending: number;
  active: number;
}

export interface OverviewState extends ProfileState {
  stats: VendorStats;
}

export interface MenuCategory {
  id: string;
  name: string;
  position: number;
}

export interface MenuItem {
  id: string;
  categoryId: string | null;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  foodType: string | null;
  available: boolean;
  position: number;
}

export interface MenuItemInput {
  name: string;
  description: string;
  price: number;
  categoryId: string | null;
  available: boolean;
  imageUrl: string | null;
  foodType: string | null;
}

export interface VendorMenu {
  categories: MenuCategory[];
  items: MenuItem[];
}

export interface OrderLine {
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface VendorOrder {
  id: string;
  code: string;
  status: OrderStatus;
  nextStatuses: OrderStatus[];
  fulfilment: Fulfilment;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  note: string;
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  prepTimeMinutes: number | null;
  reason: string;
  createdAt: string;
  acceptedAt: string;
  closedAt: string;
}

export type OrderScope = 'active' | 'history';

export interface StatusChange {
  status: OrderStatus;
  reason?: string;
  prepTimeMinutes?: number;
}

export type UploadKind = 'logo' | 'cover' | 'item';
