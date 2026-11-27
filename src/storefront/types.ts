import type { DayHours } from '../utils/hours';
import type { Fulfilment, OrderStatus } from '../utils/orderStatus';

export interface VendorSummary {
  slug: string;
  businessName: string;
  tagline: string;
  category: string;
  area: string;
  logoUrl: string;
  coverUrl: string;
  isOpen: boolean;
  acceptingOrders: boolean;
  offersDelivery: boolean;
  offersPickup: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
}

export interface StoreSection {
  id: string;
  name: string;
  items: StoreItem[];
}

export interface StoreVendor extends VendorSummary {
  description: string;
  address: string;
  locations: string[];
  socialLink: string;
  phone: string;
  hours: DayHours[];
  deliveryFee: number;
  minimumOrder: number;
  prepTimeMinutes: number;
  canOrder: boolean;
  menu: StoreSection[];
}

export interface CartLine {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfilment: Fulfilment;
  address: string;
  note: string;
  website: string;
}

export interface TrackedOrder {
  id: string;
  code: string;
  status: OrderStatus;
  fulfilment: Fulfilment;
  customerName: string;
  items: Array<{ name: string; price: number; quantity: number; lineTotal: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  prepTimeMinutes: number | null;
  reason: string;
  paymentNote: string;
  createdAt: string;
  acceptedAt: string;
  vendor: {
    slug: string;
    businessName: string;
    phone: string;
    logoUrl: string;
    address: string;
  };
}
