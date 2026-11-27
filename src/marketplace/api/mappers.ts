import { describeDay, todayHours } from '../../utils/hours';
import type { OrderStatus as BackendOrderStatus } from '../../utils/orderStatus';
import type { CartItem, CustomerAddress, CustomerUser, LocationArea, MenuItem, Order, OrderStatus, Vendor } from '../types';
import type { CustomerAddressDto, CustomerDto, MarketplaceVendorDto, OrderDto } from './types';

const STATUS: Record<BackendOrderStatus, OrderStatus> = {
  PENDING: 'pending_acceptance',
  ACCEPTED: 'preparing',
  READY: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  REJECTED: 'cancelled',
  CANCELLED: 'cancelled',
};

export function toArea(value: string): LocationArea {
  return value === 'ijagun' ? 'ijagun' : 'ijebu-ode';
}

export function servesArea(vendor: MarketplaceVendorDto, area: LocationArea): boolean {
  return vendor.areas.includes(area);
}

export function toVendor(dto: MarketplaceVendorDto, area: LocationArea): Vendor {
  const items = dto.menu.flatMap((section) => section.items);
  const foodTypes = [...new Set(items.map((item) => item.foodType).filter((value): value is string => Boolean(value)))];
  return {
    id: dto.slug,
    applicationId: dto.slug,
    businessName: dto.businessName,
    slug: dto.slug,
    vendorType: dto.category,
    description: dto.description || dto.tagline,
    locationArea: servesArea(dto, area) ? area : toArea(dto.areas[0] ?? ''),
    address: dto.address,
    landmark: '',
    phone: dto.phone,
    email: '',
    isVerified: true,
    isActivated: true,
    isOpen: dto.isOpen,
    isPaused: !dto.canOrder,
    openingHours: describeDay(todayHours(dto.hours)),
    preparationMinutes: dto.prepTimeMinutes,
    deliveryAvailable: dto.offersDelivery,
    pickupAvailable: dto.offersPickup,
    rating: 0,
    reviewsCount: 0,
    foodCategories: foodTypes,
    createdAt: '',
  };
}

export function toMenuItems(dto: MarketplaceVendorDto): MenuItem[] {
  return dto.menu.flatMap((section) =>
    section.items.map((item) => ({
      id: item.id,
      vendorId: dto.slug,
      name: item.name,
      description: item.description,
      price: item.price,
      categorySlug: item.foodType ?? '',
      imageUrl: item.imageUrl || undefined,
      isAvailable: item.available,
      preparationMinutes: dto.prepTimeMinutes,
      options: [],
    }))
  );
}

function toCartItems(dto: OrderDto): CartItem[] {
  return dto.items.map((line, index) => ({
    cartItemId: `${dto.id}-${index}`,
    menuItemId: line.menuItemId ?? '',
    vendorId: dto.vendor.slug,
    vendorName: dto.vendor.businessName,
    name: line.name,
    unitPrice: line.price,
    quantity: line.quantity,
    selectedOptions: [],
    itemTotal: line.lineTotal,
  }));
}

export function toOrder(dto: OrderDto, area: LocationArea): Order {
  return {
    id: dto.id,
    orderNumber: dto.code,
    customerId: '',
    customerName: dto.customerName,
    customerPhone: dto.customerPhone ?? '',
    customerEmail: '',
    vendorId: dto.vendor.slug,
    vendorName: dto.vendor.businessName,
    locationArea: area,
    fulfillmentType: dto.fulfilment === 'DELIVERY' ? 'delivery' : 'pickup',
    deliveryDetails:
      dto.fulfilment === 'DELIVERY' && dto.address
        ? { street: dto.address, landmark: '', recipientName: dto.customerName, recipientPhone: dto.customerPhone ?? '' }
        : undefined,
    items: toCartItems(dto),
    subtotal: dto.subtotal,
    deliveryFee: dto.deliveryFee,
    total: dto.total,
    status: STATUS[dto.status],
    rejectionReason: dto.reason || undefined,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'unpaid',
    createdAt: dto.createdAt,
    updatedAt: dto.acceptedAt || dto.createdAt,
    vendorPhone: dto.vendor.phone,
    paymentNote: dto.paymentNote,
    note: dto.note ?? '',
    prepTimeMinutes: dto.prepTimeMinutes,
    deliveryAddress: dto.address ?? '',
    pickupAddress: dto.vendor.address,
  };
}

export function isActiveOrder(order: Order): boolean {
  return order.status !== 'completed' && order.status !== 'cancelled';
}

export function toCustomerUser(dto: CustomerDto): CustomerUser {
  return {
    id: dto.id,
    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phone,
    role: 'customer',
    preferredLocation: toArea(dto.preferredArea),
    createdAt: dto.createdAt,
  };
}

export function toAddress(dto: CustomerAddressDto): CustomerAddress {
  return {
    id: dto.id,
    label: dto.label,
    locationArea: toArea(dto.area),
    street: dto.street,
    hostelOrBuilding: dto.building || undefined,
    landmark: dto.landmark,
    directions: dto.directions || undefined,
    isDefault: dto.isDefault,
  };
}

export function fromAddress(address: Omit<CustomerAddress, 'id'>): Omit<CustomerAddressDto, 'id'> {
  return {
    label: address.label,
    area: address.locationArea,
    street: address.street,
    building: address.hostelOrBuilding ?? '',
    landmark: address.landmark,
    directions: address.directions ?? '',
    isDefault: address.isDefault,
  };
}

export function deliveryAddressText(details: {
  street: string;
  hostelOrBuilding?: string;
  landmark: string;
  directions?: string;
}): string {
  return [details.hostelOrBuilding, details.street, details.landmark && `near ${details.landmark}`, details.directions]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(', ')
    .slice(0, 200);
}
