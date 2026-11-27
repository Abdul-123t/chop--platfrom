import type { DayHours } from '../../utils/hours';
import type { Fulfilment, OrderStatus as BackendOrderStatus } from '../../utils/orderStatus';

export interface MarketplaceItemDto {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  foodType: string | null;
  available: boolean;
}

export interface MarketplaceVendorDto {
  slug: string;
  businessName: string;
  tagline: string;
  category: string;
  area: string;
  areas: string[];
  logoUrl: string;
  coverUrl: string;
  isOpen: boolean;
  acceptingOrders: boolean;
  offersDelivery: boolean;
  offersPickup: boolean;
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
  menu: Array<{ id: string; name: string; items: MarketplaceItemDto[] }>;
}

export interface OrderLineDto {
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDto {
  id: string;
  code: string;
  status: BackendOrderStatus;
  fulfilment: Fulfilment;
  customerName: string;
  customerPhone?: string;
  address?: string;
  note?: string;
  items: OrderLineDto[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  prepTimeMinutes: number | null;
  reason: string;
  paymentNote: string;
  createdAt: string;
  acceptedAt: string;
  vendor: { slug: string; businessName: string; phone: string; logoUrl: string; address: string };
}

export interface CustomerDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredArea: string;
  createdAt: string;
}

export interface CustomerSessionDto {
  token: string;
  expiresAt: number;
  customer: CustomerDto;
}

export interface CustomerAddressDto {
  id: string;
  label: string;
  area: string;
  street: string;
  building: string;
  landmark: string;
  directions: string;
  isDefault: boolean;
}

export interface ApplicationStatusDto {
  reference: string;
  businessName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  accountReady: boolean;
}

export interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfilment: Fulfilment;
  address: string;
  note: string;
  items: Array<{ itemId: string; quantity: number }>;
}
