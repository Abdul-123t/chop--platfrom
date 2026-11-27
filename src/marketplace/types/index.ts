export type LocationArea = 'ijebu-ode' | 'ijagun';

export type UserRole = 'customer' | 'vendor' | 'admin';

export interface FoodCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  iconName: string;
  popularItems: string[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface EditorialFoodStory {
  id: string;
  number: string;
  title: string;
  editorialCategory: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  culturalNote?: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';

export interface VendorApplication {
  id: string;
  referenceNumber: string; // e.g. 'CHP-APP-928410'
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  businessCategory: string; // e.g. 'Restaurant', 'Bukka / Local Kitchen', 'Street-Food Seller'
  vendorType?: string;
  locationArea: LocationArea;
  specificAddress: string;
  landmark: string;
  description: string;
  foodCategories: string[];
  fulfillmentOptions: 'pickup' | 'delivery' | 'both';
  openingHours: string;
  status: ApplicationStatus;
  adminFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  applicationId: string;
  referenceNumber?: string;
  userId?: string;
  businessName: string;
  slug: string;
  vendorType?: string;
  description: string;
  locationArea: LocationArea;
  address: string;
  landmark: string;
  phone: string;
  email: string;
  isVerified: boolean;
  isActivated: boolean; // Must complete menu & storefront setup to be publicly discoverable
  isOpen: boolean;
  isPaused: boolean; // Vendor pause store feature
  openingHours: string;
  preparationMinutes: number;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  rating: number; // Stored honestly (0 if no reviews)
  reviewsCount: number;
  foodCategories?: string[];
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  commissionRate?: number;
  createdAt: string;
}

export interface MenuItemOptionChoice {
  id: string;
  name: string;
  priceDelta: number; // Naira ₦ addition
}

export interface MenuItemOption {
  id: string;
  name: string; // e.g. "Protein Choice", "Spice Level", "Sides"
  isRequired: boolean;
  maxSelections: number;
  choices: MenuItemOptionChoice[];
}

export interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number; // in Naira ₦
  categorySlug: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationMinutes: number;
  options: MenuItemOption[];
}

export interface SelectedOption {
  optionName: string;
  choiceName: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  vendorId: string;
  vendorName: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderStatus =
  | 'pending_acceptance'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface DeliveryDetails {
  street: string;
  hostelOrBuilding?: string;
  landmark: string;
  directions?: string;
  recipientName: string;
  recipientPhone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vendorId: string;
  vendorName: string;
  locationArea: LocationArea;
  fulfillmentType: 'delivery' | 'pickup';
  deliveryDetails?: DeliveryDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  rejectionReason?: string;
  paymentMethod: 'paystack' | 'flutterwave' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'verified' | 'unpaid';
  createdAt: string;
  updatedAt: string;
  vendorPhone?: string;
  paymentNote?: string;
  note?: string;
  prepTimeMinutes?: number | null;
  deliveryAddress?: string;
  pickupAddress?: string;
}

export interface WaitlistEntry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  locationArea: LocationArea;
  interestType: 'food_lover' | 'future_vendor' | 'both';
  favouriteFoodWishlist?: string;
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  preferredLocation: LocationArea;
  createdAt: string;
}

export interface Complaint {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vendorId: string;
  vendorName: string;
  issueType: 'missing_item' | 'late_delivery' | 'quality_issue' | 'other';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
  createdAt: string;
}

export interface RefundRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processed' | 'rejected';
  processedBy: string;
  createdAt: string;
  processedAt?: string;
}

export interface VendorSettlement {
  id: string;
  vendorId: string;
  period: string;
  grossSales: number;
  commissionDeduction: number;
  netPayout: number;
  status: 'pending' | 'settled';
  settledAt?: string;
}

export interface CustomerAddress {
  id: string;
  label: string; // e.g., "Hostel / Room", "Office", "Home"
  locationArea: LocationArea;
  street: string;
  hostelOrBuilding?: string;
  landmark: string;
  directions?: string;
  isDefault: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  action: string;
  targetType: 'vendor_application' | 'vendor' | 'service_area' | 'order' | 'setting' | 'customer';
  targetId: string;
  details: string;
  timestamp: string;
}
