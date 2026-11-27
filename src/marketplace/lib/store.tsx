import React, { createContext, useCallback, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import {
  LocationArea,
  VendorApplication,
  Vendor,
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  WaitlistEntry,
  CustomerAddress,
  CustomerUser,
  AdminAuditLog,
  Complaint,
  RefundRecord,
  VendorSettlement,
  UserRole,
} from '../types';
import { SERVICE_LOCATIONS } from './constants';
import { marketplaceApi } from '../api/client';
import { deliveryAddressText, toMenuItems, toOrder, toVendor } from '../api/mappers';
import type { ApplicationStatusDto } from '../api/types';
import { useCustomerAccount } from '../api/useCustomerAccount';
import { useCustomerOrders } from '../api/useCustomerOrders';
import { useMarketplaceData } from '../api/useMarketplaceData';
import { toWaitlistApplication } from '../api/vendorApplication';

export type AppView = 'marketplace' | 'for-vendors' | 'vendor-workspace' | 'admin-control' | 'account';

export type AccountTab = 'overview' | 'orders' | 'addresses' | 'profile';

const ACCOUNT_PATH = '/account';

function viewFromPath(): AppView {
  return window.location.pathname.replace(/\/+$/, '') === ACCOUNT_PATH ? 'account' : 'marketplace';
}

interface StoreContextType {
  // Navigation & View
  activeView: AppView;
  setActiveView: (view: AppView) => void;

  // Location (Strictly Ijebu Ode and Ijagun)
  selectedLocation: LocationArea;
  setSelectedLocation: (loc: LocationArea) => void;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categorySlug: string | null) => void;

  // Customer Authentication
  currentUser: CustomerUser | null;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'signin' | 'signup') => void;
  loginCustomer: (emailOrPhone: string, password?: string, role?: UserRole) => Promise<CustomerUser>;
  registerCustomer: (data: {
    fullName: string;
    email: string;
    phone: string;
    preferredLocation: LocationArea;
    password?: string;
    role?: UserRole;
  }) => Promise<CustomerUser>;
  logoutCustomer: () => void;
  accountTab: AccountTab;
  openAccount: (tab?: AccountTab) => void;
  setAccountTab: (tab: AccountTab) => void;
  updateProfile: (update: { fullName?: string; email?: string; phone?: string; preferredLocation?: LocationArea }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  reorder: (order: Order) => { added: number; skipped: number };
  requestPasswordReset: (identifier: string) => Promise<void>;
  checkApplicationStatus: (phone: string) => Promise<ApplicationStatusDto | null>;
  marketplaceLoading: boolean;
  marketplaceError: string | null;
  reloadMarketplace: () => void;
  cartVendor: { deliveryAvailable: boolean; pickupAvailable: boolean; deliveryFee: number; minimumOrder: number; isPaused: boolean } | null;

  // Modals & Panels
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  isHowItWorksOpen: boolean;
  setIsHowItWorksOpen: (open: boolean) => void;
  selectedVendorStorefront: Vendor | null;
  setSelectedVendorStorefront: (vendor: Vendor | null) => void;
  activeOrderToTrack: Order | null;
  setActiveOrderToTrack: (order: Order | null) => void;

  // Intro animation
  hasSeenIntro: boolean;
  replayIntro: () => void;
  dismissIntro: () => void;

  // Waitlist Operations
  waitlistEntries: WaitlistEntry[];
  addWaitlistEntry: (entry: Omit<WaitlistEntry, 'id' | 'createdAt'>) => Promise<WaitlistEntry>;

  // Vendor Application & Onboarding
  vendorApplications: VendorApplication[];
  submitVendorApplication: (app: Omit<VendorApplication, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<VendorApplication>;
  updateApplicationStatus: (appId: string, status: VendorApplication['status'], feedback?: string) => void;

  // Live Vendors (Only approved vendors appear!)
  approvedVendors: Vendor[];
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItemAvailability: (itemId: string, isAvailable: boolean) => void;
  toggleVendorPauseStore: (vendorId: string) => void;
  toggleVendorStorefrontActivation: (vendorId: string) => void;
  updateVendorBankDetails: (vendorId: string, bankDetails: { bankName: string; accountNumber: string; accountName: string }) => void;
  suspendVendor: (vendorId: string, reason: string) => void;

  // Service Area Delivery Fees
  serviceAreaFees: Record<LocationArea, number>;
  updateServiceAreaDeliveryFee: (area: LocationArea, fee: number) => void;

  // Complaints & Disputes
  complaints: Complaint[];
  submitComplaint: (data: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => Promise<Complaint>;
  resolveComplaint: (complaintId: string, status: Complaint['status'], resolutionNotes?: string) => void;

  // Refund Records
  refundRecords: RefundRecord[];
  processRefund: (data: Omit<RefundRecord, 'id' | 'status' | 'processedBy' | 'createdAt' | 'processedAt'>) => Promise<RefundRecord>;

  // Cart Operations
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    fulfillmentType: 'delivery' | 'pickup';
    locationArea: LocationArea;
    deliveryDetails?: {
      street: string;
      hostelOrBuilding?: string;
      landmark: string;
      directions?: string;
      recipientName: string;
      recipientPhone: string;
    };
    paymentMethod: 'paystack' | 'flutterwave' | 'cash_on_delivery';
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;

  // Customer Addresses
  savedAddresses: CustomerAddress[];
  saveAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;

  // Admin Audit Logs
  auditLogs: AdminAuditLog[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  WAITLIST: 'chop_waitlist_entries_v1',
  APPLICATIONS: 'chop_vendor_applications_v1',
  APPROVED_VENDORS: 'chop_approved_vendors_v1',
  MENU_ITEMS: 'chop_menu_items_v1',
  ORDERS: 'chop_orders_v1',
  ADDRESSES: 'chop_saved_addresses_v1',
  AUDIT_LOGS: 'chop_audit_logs_v1',
  COMPLAINTS: 'chop_complaints_v1',
  REFUNDS: 'chop_refund_records_v1',
  SERVICE_FEES: 'chop_service_fees_v1',
  INTRO_SEEN: 'chop_intro_seen_v1',
  ACTIVE_LOCATION: 'chop_active_location_v1',
};

const PORTAL_PATHS: Partial<Record<AppView, string>> = {
  'vendor-workspace': '/vendor',
  'admin-control': '/admin',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & View
  const [activeView, setLocalView] = useState<AppView>(viewFromPath);
  const setActiveView = useCallback((view: AppView) => {
    const external = PORTAL_PATHS[view];
    if (external) {
      window.location.assign(external);
      return;
    }
    const onAccount = window.location.pathname.replace(/\/+$/, '') === ACCOUNT_PATH;
    if (view === 'account' && !onAccount) window.history.pushState(null, '', ACCOUNT_PATH);
    if (view !== 'account' && onAccount) window.history.pushState(null, '', '/');
    setLocalView(view);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const sync = () => setLocalView(viewFromPath());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const [accountTab, setAccountTab] = useState<AccountTab>('overview');
  
  // Location (Strictly Ijebu Ode or Ijagun)
  const [selectedLocation, setSelectedLocationState] = useState<LocationArea>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_LOCATION);
    if (saved === 'ijagun') return 'ijagun';
    return 'ijebu-ode'; // Default to prime Ijebu hub
  });

  const setSelectedLocation = (loc: LocationArea) => {
    const normalized: LocationArea = loc === 'ijagun' ? 'ijagun' : 'ijebu-ode';
    setSelectedLocationState(normalized);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_LOCATION, normalized);
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const marketplace = useMarketplaceData();
  const account = useCustomerAccount();
  const liveOrders = useCustomerOrders(account.token, selectedLocation);
  const currentUser = account.user;

  const liveVendors = useMemo(
    () => marketplace.vendors.map((vendor) => toVendor(vendor, selectedLocation)),
    [marketplace.vendors, selectedLocation]
  );
  const liveMenuItems = useMemo(() => marketplace.vendors.flatMap(toMenuItems), [marketplace.vendors]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  const openSignIn = () => {
    setAuthModalTab('signin');
    setIsAuthModalOpen(true);
  };
  const openSignUp = () => {
    setAuthModalTab('signup');
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginCustomer = async (emailOrPhone: string, password?: string): Promise<CustomerUser> => {
    if (!password) throw new Error('Enter your password.');
    const user = await account.login(emailOrPhone, password);
    setIsAuthModalOpen(false);
    return user;
  };

  const registerCustomer = async (data: {
    fullName: string;
    email: string;
    phone: string;
    preferredLocation: LocationArea;
    password?: string;
    role?: UserRole;
  }): Promise<CustomerUser> => {
    const user = await account.register(data);
    setIsAuthModalOpen(false);
    return user;
  };

  const logoutCustomer = () => {
    account.logout();
    if (activeView === 'account') setActiveView('marketplace');
  };

  const openAccount = (tab: AccountTab = 'overview') => {
    if (!account.user) {
      openSignIn();
      return;
    }
    setAccountTab(tab);
    setAccountModalState(false);
    setIsOrderTrackerOpen(false);
    setIsCartDrawerOpen(false);
    setActiveView('account');
  };

  const setIsAccountModalOpen = (open: boolean) => {
    if (open) openAccount('overview');
    else setAccountModalState(false);
  };

  const updateProfile = (update: { fullName?: string; email?: string; phone?: string; preferredLocation?: LocationArea }) =>
    account.updateProfile(update);

  const changePassword = (currentPassword: string, newPassword: string) => account.changePassword(currentPassword, newPassword);

  const setDefaultAddress = (addressId: string) => account.setDefaultAddress(addressId);

  const addAddress = (address: Omit<CustomerAddress, 'id'>) => account.saveAddress(address);

  const requestPasswordReset = (identifier: string) => account.requestPasswordReset(identifier);

  const checkApplicationStatus = async (phone: string) => (await marketplaceApi.applicationStatus(phone)).application;

  // Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAccountModalOpen, setAccountModalState] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [selectedVendorStorefront, setSelectedVendorStorefront] = useState<Vendor | null>(null);
  const [activeOrderToTrack, setActiveOrderToTrack] = useState<Order | null>(null);

  // Intro (Respects clean sessions and ?intro=replay parameter for testing)
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('intro') || params.has('replay')) {
          return false;
        }
      }
      return sessionStorage.getItem(LOCAL_STORAGE_KEYS.INTRO_SEEN) === 'true';
    } catch {
      return false;
    }
  });

  const dismissIntro = () => {
    setHasSeenIntro(true);
    try {
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.INTRO_SEEN, 'true');
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
  };

  const replayIntro = () => {
    try {
      sessionStorage.removeItem(LOCAL_STORAGE_KEYS.INTRO_SEEN);
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
    setHasSeenIntro(false);
  };

  // Waitlist State (Starts clean from real data)
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.WAITLIST);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addWaitlistEntry = async (entry: Omit<WaitlistEntry, 'id' | 'createdAt'>): Promise<WaitlistEntry> => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...waitlistEntries];
    setWaitlistEntries(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.WAITLIST, JSON.stringify(updated));
    return newEntry;
  };

  // Vendor Applications (Empty initially — strictly NO fake data)
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.APPLICATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Approved Vendors (Empty initially — strictly NO fake vendors)
  const [approvedVendors, setApprovedVendors] = useState<Vendor[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.APPROVED_VENDORS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Menu items (Empty initially)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.MENU_ITEMS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Orders (Empty initially)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.ADDRESSES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Complaints & Customer Inquiries
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLAINTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Refund Records
  const [refundRecords, setRefundRecords] = useState<RefundRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.REFUNDS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Configurable Delivery Fees per Service Area (Strictly Ijebu Ode & Ijagun)
  const [serviceAreaFees, setServiceAreaFees] = useState<Record<LocationArea, number>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SERVICE_FEES);
      return stored
        ? JSON.parse(stored)
        : {
            'ijebu-ode': SERVICE_LOCATIONS['ijebu-ode'].deliveryBaseFee,
            ijagun: SERVICE_LOCATIONS.ijagun.deliveryBaseFee,
          };
    } catch {
      return {
        'ijebu-ode': 600,
        ijagun: 450,
      };
    }
  });

  const updateServiceAreaDeliveryFee = (area: LocationArea, fee: number) => {
    const updated = { ...serviceAreaFees, [area]: Math.max(0, fee) };
    setServiceAreaFees(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SERVICE_FEES, JSON.stringify(updated));

    appendAuditLog({
      adminName: currentUser?.fullName || 'Admin Operator',
      action: 'DELIVERY_FEE_UPDATED',
      targetType: 'service_area',
      targetId: area,
      details: `Delivery base fee for ${SERVICE_LOCATIONS[area].name} updated to ₦${fee}.`,
    });
  };

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS);
      return stored ? JSON.parse(stored) : [
        {
          id: 'log-genesis',
          adminName: 'CHOP Founding Team',
          action: 'MARKETPLACE_INITIALIZED',
          targetType: 'service_area',
          targetId: 'ijebu-ode_ijagun',
          details: 'CHOP core services initialized for Ijebu Ode & Ijagun hubs.',
          timestamp: new Date().toISOString(),
        }
      ];
    } catch {
      return [];
    }
  });

  const appendAuditLog = (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => {
    const newLog: AdminAuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  };

  const submitVendorApplication = async (
    appData: Omit<VendorApplication, 'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<VendorApplication> => {
    const result = await marketplaceApi.applyAsVendor(toWaitlistApplication(appData));
    if (result.duplicate) {
      throw new Error('This WhatsApp number has already applied. Check your application status below.');
    }
    const now = new Date().toISOString();
    const newApp: VendorApplication = {
      ...appData,
      id: result.id,
      referenceNumber: result.id,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newApp, ...vendorApplications];
    setVendorApplications(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    return newApp;
  };

  const updateApplicationStatus = (
    appId: string,
    status: VendorApplication['status'],
    feedback?: string
  ) => {
    let approvedVendorInstance: Vendor | null = null;

    const updatedApps = vendorApplications.map((app) => {
      if (app.id === appId) {
        const updated = {
          ...app,
          status,
          adminFeedback: feedback,
          updatedAt: new Date().toISOString(),
        };

        // If approved, create official Vendor record with isActivated: false initially
        // Approved vendor must set up their menu/profile to activate their storefront
        if (status === 'approved' && app.status !== 'approved') {
          approvedVendorInstance = {
            id: `v_${app.id}`,
            applicationId: app.id,
            referenceNumber: app.referenceNumber,
            businessName: app.businessName,
            slug: app.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: app.description,
            locationArea: app.locationArea,
            address: app.specificAddress,
            landmark: app.landmark,
            phone: app.phone,
            email: app.email,
            isVerified: true,
            isActivated: false, // Setup required before public appearance
            isOpen: true,
            isPaused: false,
            openingHours: app.openingHours || '8:00 AM - 9:00 PM',
            preparationMinutes: 25,
            deliveryAvailable: app.fulfillmentOptions === 'delivery' || app.fulfillmentOptions === 'both',
            pickupAvailable: app.fulfillmentOptions === 'pickup' || app.fulfillmentOptions === 'both',
            rating: 0,
            reviewsCount: 0,
            foodCategories: app.foodCategories,
            commissionRate: 0.10, // 10% standard partner commission
            createdAt: new Date().toISOString(),
          };
        }
        return updated;
      }
      return app;
    });

    setVendorApplications(updatedApps);
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPLICATIONS, JSON.stringify(updatedApps));

    if (approvedVendorInstance) {
      const updatedVendors = [approvedVendorInstance, ...approvedVendors];
      setApprovedVendors(updatedVendors);
      localStorage.setItem(LOCAL_STORAGE_KEYS.APPROVED_VENDORS, JSON.stringify(updatedVendors));
    }

    appendAuditLog({
      adminName: currentUser?.fullName || 'Admin Auditor',
      action: `APPLICATION_${status.toUpperCase()}`,
      targetType: 'vendor_application',
      targetId: appId,
      details: `Status set to ${status}. Feedback: ${feedback || 'None'}`,
    });
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `menu_${Date.now()}`,
    };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU_ITEMS, JSON.stringify(updated));

    appendAuditLog({
      adminName: 'Vendor Action',
      action: 'MENU_ITEM_CREATED',
      targetType: 'vendor',
      targetId: itemData.vendorId,
      details: `Added "${itemData.name}" priced at ₦${itemData.price}.`,
    });
  };

  const updateMenuItemAvailability = (itemId: string, isAvailable: boolean) => {
    const updated = menuItems.map(m => m.id === itemId ? { ...m, isAvailable } : m);
    setMenuItems(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU_ITEMS, JSON.stringify(updated));
  };

  const toggleVendorPauseStore = (vendorId: string) => {
    const updated = approvedVendors.map(v => {
      if (v.id === vendorId) {
        return { ...v, isPaused: !v.isPaused };
      }
      return v;
    });
    setApprovedVendors(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPROVED_VENDORS, JSON.stringify(updated));

    const vendor = approvedVendors.find(v => v.id === vendorId);
    appendAuditLog({
      adminName: 'Vendor / Admin Action',
      action: vendor?.isPaused ? 'STORE_RESUMED' : 'STORE_PAUSED',
      targetType: 'vendor',
      targetId: vendorId,
      details: `Store "${vendor?.businessName}" pause status changed to ${!vendor?.isPaused}.`,
    });
  };

  const toggleVendorStorefrontActivation = (vendorId: string) => {
    const updated = approvedVendors.map(v => {
      if (v.id === vendorId) {
        return { ...v, isActivated: !v.isActivated };
      }
      return v;
    });
    setApprovedVendors(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPROVED_VENDORS, JSON.stringify(updated));

    const vendor = approvedVendors.find(v => v.id === vendorId);
    appendAuditLog({
      adminName: currentUser?.fullName || 'Vendor / Admin',
      action: vendor?.isActivated ? 'STOREFRONT_DEACTIVATED' : 'STOREFRONT_ACTIVATED',
      targetType: 'vendor',
      targetId: vendorId,
      details: `Storefront for "${vendor?.businessName}" is now ${!vendor?.isActivated ? 'Live on Marketplace' : 'Taken Offline'}.`,
    });
  };

  const updateVendorBankDetails = (
    vendorId: string,
    bankDetails: { bankName: string; accountNumber: string; accountName: string }
  ) => {
    const updated = approvedVendors.map(v => {
      if (v.id === vendorId) {
        return { ...v, bankDetails };
      }
      return v;
    });
    setApprovedVendors(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPROVED_VENDORS, JSON.stringify(updated));

    appendAuditLog({
      adminName: 'Vendor Action',
      action: 'BANK_DETAILS_UPDATED',
      targetType: 'vendor',
      targetId: vendorId,
      details: `Settlement account updated (${bankDetails.bankName} - ${bankDetails.accountNumber.slice(-4)}).`,
    });
  };

  const suspendVendor = (vendorId: string, reason: string) => {
    const updated = approvedVendors.map(v => {
      if (v.id === vendorId) {
        return { ...v, isActivated: false, isPaused: true };
      }
      return v;
    });
    setApprovedVendors(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPROVED_VENDORS, JSON.stringify(updated));

    appendAuditLog({
      adminName: currentUser?.fullName || 'Admin Operations',
      action: 'VENDOR_SUSPENDED',
      targetType: 'vendor',
      targetId: vendorId,
      details: `Vendor suspended: "${reason}".`,
    });
  };

  // Submit and Resolve Complaints
  const submitComplaint = async (
    data: Omit<Complaint, 'id' | 'status' | 'createdAt'>
  ): Promise<Complaint> => {
    const newComplaint: Complaint = {
      ...data,
      id: `cmp_${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated));

    appendAuditLog({
      adminName: 'Customer Inbound',
      action: 'COMPLAINT_FILED',
      targetType: 'order',
      targetId: data.orderId,
      details: `Complaint for Order #${data.orderNumber} (${data.issueType}) submitted by ${data.customerName}.`,
    });

    return newComplaint;
  };

  const resolveComplaint = (
    complaintId: string,
    status: Complaint['status'],
    resolutionNotes?: string
  ) => {
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        return { ...c, status, resolutionNotes };
      }
      return c;
    });
    setComplaints(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLAINTS, JSON.stringify(updated));

    appendAuditLog({
      adminName: currentUser?.fullName || 'Admin Support',
      action: `COMPLAINT_${status.toUpperCase()}`,
      targetType: 'order',
      targetId: complaintId,
      details: `Complaint marked as ${status}. Resolution: ${resolutionNotes || 'None'}`,
    });
  };

  // Process Refunds
  const processRefund = async (
    data: Omit<RefundRecord, 'id' | 'status' | 'processedBy' | 'createdAt' | 'processedAt'>
  ): Promise<RefundRecord> => {
    const newRefund: RefundRecord = {
      ...data,
      id: `ref_${Date.now()}`,
      status: 'processed',
      processedBy: currentUser?.fullName || 'Admin Operations',
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };
    const updated = [newRefund, ...refundRecords];
    setRefundRecords(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFUNDS, JSON.stringify(updated));

    appendAuditLog({
      adminName: currentUser?.fullName || 'Finance Ops',
      action: 'REFUND_PROCESSED',
      targetType: 'order',
      targetId: data.orderId,
      details: `Refund of ₦${data.amount} processed for Order #${data.orderNumber}. Reason: ${data.reason}`,
    });

    return newRefund;
  };

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    const otherVendor = cart.find((entry) => entry.vendorId !== item.vendorId);
    if (otherVendor) {
      if (!window.confirm(`Your order has items from ${otherVendor.vendorName}. Start a new order from ${item.vendorName}?`)) return;
      setCart([item]);
      setSelectedVendorStorefront(null);
      setIsCartDrawerOpen(true);
      return;
    }
    setCart(prev => {
      const existingIndex = prev.findIndex(ci =>
        ci.menuItemId === item.menuItemId &&
        JSON.stringify(ci.selectedOptions) === JSON.stringify(item.selectedOptions)
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        const updatedQuantity = copy[existingIndex].quantity + item.quantity;
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: updatedQuantity,
          itemTotal: copy[existingIndex].unitPrice * updatedQuantity +
            copy[existingIndex].selectedOptions.reduce((acc, opt) => acc + opt.priceDelta, 0) * updatedQuantity,
        };
        return copy;
      }
      return [...prev, item];
    });
    setSelectedVendorStorefront(null);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          const optionsPrice = item.selectedOptions.reduce((acc, opt) => acc + opt.priceDelta, 0);
          return {
            ...item,
            quantity: newQty,
            itemTotal: (item.unitPrice + optionsPrice) * newQty,
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);
  
  const cartVendorDto = cart.length > 0 ? marketplace.vendors.find((vendor) => vendor.slug === cart[0].vendorId) ?? null : null;
  const cartVendor = cartVendorDto
    ? {
        deliveryAvailable: cartVendorDto.offersDelivery,
        pickupAvailable: cartVendorDto.offersPickup,
        deliveryFee: cartVendorDto.deliveryFee,
        minimumOrder: cartVendorDto.minimumOrder,
        isPaused: !cartVendorDto.canOrder,
      }
    : null;
  const deliveryFee = cartVendor && cartVendor.deliveryAvailable ? cartVendor.deliveryFee : 0;

  const cartTotal = cartSubtotal + deliveryFee;

  const placeOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    fulfillmentType: 'delivery' | 'pickup';
    locationArea: LocationArea;
    deliveryDetails?: {
      street: string;
      hostelOrBuilding?: string;
      landmark: string;
      directions?: string;
      recipientName: string;
      recipientPhone: string;
    };
    paymentMethod: 'paystack' | 'flutterwave' | 'cash_on_delivery';
  }): Promise<Order> => {
    if (cart.length === 0) throw new Error('Your cart is empty.');
    const instructions = cart
      .filter((item) => item.specialInstructions?.trim())
      .map((item) => `${item.name}: ${item.specialInstructions?.trim()}`);
    const result = await marketplaceApi.placeOrder(
      cart[0].vendorId,
      {
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        fulfilment: orderData.fulfillmentType === 'delivery' ? 'DELIVERY' : 'PICKUP',
        address: orderData.deliveryDetails ? deliveryAddressText(orderData.deliveryDetails) : '',
        note: instructions.join('; ').slice(0, 300),
        items: cart.map((item) => ({ itemId: item.menuItemId, quantity: item.quantity })),
      },
      account.token ?? undefined
    );
    if (!result.order) throw new Error('Could not place your order. Please try again.');
    liveOrders.addPlaced(result.order);
    const placed = toOrder({ ...result.order, customerPhone: orderData.customerPhone }, orderData.locationArea);
    clearCart();
    setActiveOrderToTrack(placed);
    setIsOrderTrackerOpen(true);
    return placed;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          rejectionReason: reason,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    if (activeOrderToTrack && activeOrderToTrack.id === orderId) {
      setActiveOrderToTrack(prev => prev ? { ...prev, status, rejectionReason: reason } : null);
    }

    appendAuditLog({
      adminName: 'Vendor / Admin Action',
      action: `ORDER_STATUS_${status.toUpperCase()}`,
      targetType: 'order',
      targetId: orderId,
      details: `Order status updated to ${status}. ${reason ? `Reason: ${reason}` : ''}`,
    });
  };

  const saveAddress = (address: Omit<CustomerAddress, 'id'>) => {
    if (account.token) {
      void account.saveAddress(address).catch((error: unknown) => {
        window.alert(error instanceof Error ? error.message : 'Could not save this address.');
      });
      return;
    }
    const newAddress: CustomerAddress = {
      ...address,
      id: `addr_${Date.now()}`,
    };
    const updated = [newAddress, ...savedAddresses];
    setSavedAddresses(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADDRESSES, JSON.stringify(updated));
  };

  const deleteAddress = (id: string) => {
    if (account.token) {
      void account.deleteAddress(id).catch(() => undefined);
      return;
    }
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADDRESSES, JSON.stringify(updated));
  };

  const reloadOrders = liveOrders.reload;

  const cancelOrder = (orderId: string) => liveOrders.cancel(orderId);

  const reorder = (order: Order) => {
    const available = order.items.flatMap((line) => {
      const item = liveMenuItems.find((entry) => entry.id === line.menuItemId && entry.isAvailable);
      return item
        ? [
            {
              cartItemId: `re_${item.id}_${Date.now()}`,
              menuItemId: item.id,
              vendorId: item.vendorId,
              vendorName: order.vendorName,
              name: item.name,
              unitPrice: item.price,
              quantity: line.quantity,
              selectedOptions: [],
              itemTotal: item.price * line.quantity,
            } satisfies CartItem,
          ]
        : [];
    });
    if (available.length > 0) {
      setCart(available);
      setActiveView('marketplace');
      setIsCartDrawerOpen(true);
    }
    return { added: available.length, skipped: order.items.length - available.length };
  };

  useEffect(() => {
    setActiveOrderToTrack((current) => {
      if (!current) return current;
      const latest = liveOrders.orders.find((order) => order.id === current.id);
      return latest && latest.status !== current.status ? { ...latest, customerPhone: current.customerPhone } : current;
    });
  }, [liveOrders.orders]);

  useEffect(() => {
    if (isOrderTrackerOpen) reloadOrders();
  }, [isOrderTrackerOpen, reloadOrders]);

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedLocation,
        setSelectedLocation,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        currentUser,
        isAuthModalOpen,
        authModalTab,
        openSignIn,
        openSignUp,
        closeAuthModal,
        setAuthModalTab,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        accountTab,
        openAccount,
        setAccountTab,
        updateProfile,
        changePassword,
        setDefaultAddress,
        addAddress,
        cancelOrder,
        reorder,
        requestPasswordReset,
        checkApplicationStatus,
        marketplaceLoading: marketplace.loading,
        marketplaceError: marketplace.error,
        reloadMarketplace: marketplace.reload,
        cartVendor,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        isHowItWorksOpen,
        setIsHowItWorksOpen,
        selectedVendorStorefront,
        setSelectedVendorStorefront,
        activeOrderToTrack,
        setActiveOrderToTrack,
        hasSeenIntro,
        replayIntro,
        dismissIntro,
        waitlistEntries,
        addWaitlistEntry,
        vendorApplications,
        submitVendorApplication,
        updateApplicationStatus,
        approvedVendors: liveVendors,
        menuItems: liveMenuItems,
        addMenuItem,
        updateMenuItemAvailability,
        toggleVendorPauseStore,
        toggleVendorStorefrontActivation,
        updateVendorBankDetails,
        suspendVendor,
        serviceAreaFees,
        updateServiceAreaDeliveryFee,
        complaints,
        submitComplaint,
        resolveComplaint,
        refundRecords,
        processRefund,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        orders: liveOrders.orders,
        placeOrder,
        updateOrderStatus,
        savedAddresses: account.token ? account.addresses : savedAddresses,
        saveAddress,
        deleteAddress,
        auditLogs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
