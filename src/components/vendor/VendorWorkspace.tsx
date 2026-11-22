import React, { useState } from 'react';
import {
  Store,
  Clock,
  PauseCircle,
  PlayCircle,
  Plus,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Settings,
  UtensilsCrossed,
  DollarSign,
  MapPin,
  ArrowLeft,
  Building,
  CreditCard,
  Radio,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatNaira, SERVICE_LOCATIONS, FOOD_CATEGORIES } from '../../lib/constants';
import { MenuItem, Order, OrderStatus } from '../../types';

export const VendorWorkspace: React.FC = () => {
  const {
    approvedVendors,
    toggleVendorPauseStore,
    toggleVendorStorefrontActivation,
    updateVendorBankDetails,
    menuItems,
    addMenuItem,
    updateMenuItemAvailability,
    orders,
    updateOrderStatus,
    setActiveView,
    setSelectedVendorStorefront,
  } = useStore();

  // If there are approved vendors, let user pick which one to manage; otherwise let them view a test kitchen or onboarding guidance
  const [selectedVendorId, setSelectedVendorId] = useState<string>(() => {
    return approvedVendors.length > 0 ? approvedVendors[0].id : '';
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'settlement' | 'analytics'>('overview');

  // Bank Form State
  const [bankName, setBankName] = useState('GTBank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankSavedMessage, setBankSavedMessage] = useState(false);

  // New Menu Item State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemCategory, setItemCategory] = useState(FOOD_CATEGORIES[0].slug);
  const [itemPrepMinutes, setItemPrepMinutes] = useState('20');
  const [hasCustomizations, setHasCustomizations] = useState(false);
  const [optionName, setOptionName] = useState('Protein Choice');
  const [optionChoices, setOptionChoices] = useState('Beef (+0), Fried Fish (+500), Peppered Turkey (+1200)');

  // Reject Order reason modal
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Out of stock for key ingredients');

  const activeVendor = approvedVendors.find(v => v.id === selectedVendorId) || approvedVendors[0] || null;

  // Sync bank details when activeVendor changes
  React.useEffect(() => {
    if (activeVendor?.bankDetails) {
      setBankName(activeVendor.bankDetails.bankName || 'GTBank');
      setAccountNumber(activeVendor.bankDetails.accountNumber || '');
      setAccountName(activeVendor.bankDetails.accountName || '');
    }
  }, [activeVendor?.id]);

  // Filter orders for active vendor
  const vendorOrders = activeVendor ? orders.filter(o => o.vendorId === activeVendor.id) : [];
  const vendorMenu = activeVendor ? menuItems.filter(m => m.vendorId === activeVendor.id) : [];

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVendor || !accountNumber.trim() || accountNumber.trim().length < 10 || !accountName.trim()) return;
    updateVendorBankDetails(activeVendor.id, {
      bankName,
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
    });
    setBankSavedMessage(true);
    setTimeout(() => setBankSavedMessage(false), 3000);
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVendor || !itemName.trim() || !itemPrice) return;

    const parsedPrice = parseInt(itemPrice, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return;

    // Parse options if configured
    let optionsList = [];
    if (hasCustomizations && optionName.trim() && optionChoices.trim()) {
      const choices = optionChoices.split(',').map((c, idx) => {
        const parts = c.trim().match(/^(.*?)(?:\s*\(\+(\d+)\))?$/);
        const name = parts ? parts[1].trim() : c.trim();
        const priceDelta = parts && parts[2] ? parseInt(parts[2], 10) : 0;
        return {
          id: `opt_choice_${idx}`,
          name,
          priceDelta,
        };
      });

      optionsList.push({
        id: `opt_${Date.now()}`,
        name: optionName.trim(),
        isRequired: true,
        maxSelections: 1,
        choices,
      });
    }

    addMenuItem({
      vendorId: activeVendor.id,
      name: itemName.trim(),
      description: itemDescription.trim() || 'Freshly made to order.',
      price: parsedPrice,
      categorySlug: itemCategory,
      isAvailable: true,
      preparationMinutes: parseInt(itemPrepMinutes, 10) || 20,
      options: optionsList,
    });

    setIsAddingItem(false);
    setItemName('');
    setItemPrice('');
    setItemDescription('');
  };

  const handleConfirmReject = () => {
    if (rejectOrderId) {
      updateOrderStatus(rejectOrderId, 'cancelled', rejectReason);
      setRejectOrderId(null);
    }
  };

  return (
    <div className="bg-[#F7F6F2] min-h-screen">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E6E2DA] sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3">
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('marketplace')}
                className="p-1.5 rounded-full text-[#77736C] hover:text-[#191919] hover:bg-[#F0EEE8]"
                title="Return to marketplace"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736C]">
                  CHOP Vendor Workspace
                </span>
                <h1 className="font-display text-xl font-black text-[#141414] leading-tight">
                  {activeVendor ? activeVendor.businessName : 'Kitchen Operations'}
                </h1>
              </div>
            </div>

            {/* Vendor Selector & Live Actions */}
            <div className="flex items-center gap-2">
              {approvedVendors.length > 0 ? (
                <>
                  {approvedVendors.length > 1 && (
                    <select
                      value={selectedVendorId}
                      onChange={(e) => setSelectedVendorId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-[#F0EEE8] border border-[#E6E2DA] text-xs font-semibold text-[#141414]"
                    >
                      {approvedVendors.map(v => (
                        <option key={v.id} value={v.id}>{v.businessName}</option>
                      ))}
                    </select>
                  )}

                  {activeVendor && (
                    <>
                      {/* Storefront Activation Status & Toggle */}
                      <button
                        onClick={() => {
                          if (!activeVendor.isActivated && vendorMenu.length === 0) {
                            alert('Please add at least 1 food menu item before activating your public storefront.');
                            return;
                          }
                          toggleVendorStorefrontActivation(activeVendor.id);
                        }}
                        className={`py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          activeVendor.isActivated
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        }`}
                        title={activeVendor.isActivated ? 'Storefront is live on CHOP marketplace' : 'Click to go live on CHOP marketplace'}
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>{activeVendor.isActivated ? 'Storefront Live' : 'Go Live on Marketplace'}</span>
                      </button>

                      {/* Pause Store Toggle */}
                      <button
                        onClick={() => toggleVendorPauseStore(activeVendor.id)}
                        className={`py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          activeVendor.isPaused
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-[#F0EEE8] text-[#191919] hover:bg-[#E6E2DA]'
                        }`}
                      >
                        {activeVendor.isPaused ? (
                          <>
                            <PlayCircle className="w-3.5 h-3.5 text-amber-700" />
                            <span>Resume Orders</span>
                          </>
                        ) : (
                          <>
                            <PauseCircle className="w-3.5 h-3.5 text-[#C45B3A]" />
                            <span>Pause Store</span>
                          </>
                        )}
                      </button>

                      {/* Preview Storefront */}
                      <button
                        onClick={() => setSelectedVendorStorefront(activeVendor)}
                        className="py-1.5 px-3.5 rounded-full bg-[#141414] text-white text-xs font-semibold hover:bg-black flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Storefront</span>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveView('for-vendors')}
                  className="py-1.5 px-3.5 rounded-full bg-[#C45B3A] text-white text-xs font-semibold hover:opacity-90"
                >
                  Apply as Founding Vendor
                </button>
              )}
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 overflow-x-auto text-xs font-semibold border-t border-[#E6E2DA]/60 pt-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#141414] text-[#141414]'
                  : 'border-transparent text-[#77736C] hover:text-[#191919]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-[#141414] text-[#141414]'
                  : 'border-transparent text-[#77736C] hover:text-[#191919]'
              }`}
            >
              <span>Incoming Orders</span>
              {vendorOrders.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#C45B3A] text-white text-[10px] flex items-center justify-center font-bold">
                  {vendorOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'border-[#141414] text-[#141414]'
                  : 'border-transparent text-[#77736C] hover:text-[#191919]'
              }`}
            >
              Menu & Availability ({vendorMenu.length})
            </button>
            <button
              onClick={() => setActiveTab('settlement')}
              className={`py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settlement'
                  ? 'border-[#141414] text-[#141414]'
                  : 'border-transparent text-[#77736C] hover:text-[#191919]'
              }`}
            >
              Settlement & Bank
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-[#141414] text-[#141414]'
                  : 'border-transparent text-[#77736C] hover:text-[#191919]'
              }`}
            >
              Honest Analytics
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!activeVendor ? (
          <div className="bg-white rounded-3xl border border-[#E6E2DA] p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F0EEE8] text-[#77736C] flex items-center justify-center mx-auto">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-black text-[#141414]">
              No Live Vendor Selected
            </h2>
            <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed">
              CHOP strictly maintains zero fictional vendor inventory. You can submit a genuine vendor application or approve an application in the Admin Control Centre to preview full digital kitchen operations.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setActiveView('for-vendors')}
                className="py-2.5 px-5 rounded-full bg-[#141414] text-white text-xs font-semibold hover:bg-black"
              >
                Submit Application
              </button>
              <button
                onClick={() => setActiveView('admin-control')}
                className="py-2.5 px-5 rounded-full bg-[#F0EEE8] text-[#141414] text-xs font-semibold hover:bg-[#E6E2DA]"
              >
                Go to Admin Centre &rarr;
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Status Callout if not activated */}
                {!activeVendor.isActivated && (
                  <div className="p-5 rounded-2xl bg-[#141414] text-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#C45B3A]/20 text-[#C45B3A] flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-white text-sm block">Storefront Setup in Progress</strong>
                        <p className="text-white/80 mt-0.5">
                          Your kitchen is approved! Add your menu items and click &ldquo;Go Live on Marketplace&rdquo; to start receiving customer orders in {SERVICE_LOCATIONS[activeVendor.locationArea].name}.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (vendorMenu.length === 0) {
                          setActiveTab('menu');
                        } else {
                          toggleVendorStorefrontActivation(activeVendor.id);
                        }
                      }}
                      className="py-2 px-4 rounded-xl bg-[#C45B3A] hover:opacity-90 text-white font-bold whitespace-nowrap self-start sm:self-center"
                    >
                      {vendorMenu.length === 0 ? 'Add Menu Items' : 'Activate Storefront Now'}
                    </button>
                  </div>
                )}

                {/* Status Callout if paused */}
                {activeVendor.isPaused && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PauseCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>
                        <strong>Store is currently paused.</strong> Customers can view your menu but cannot place new orders until resumed.
                      </span>
                    </div>
                    <button
                      onClick={() => toggleVendorPauseStore(activeVendor.id)}
                      className="py-1 px-3 rounded-xl bg-amber-200 hover:bg-amber-300 font-semibold"
                    >
                      Resume Now
                    </button>
                  </div>
                )}

                {/* Honest Zero-State Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="p-5 rounded-3xl bg-white border border-[#E6E2DA] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C]">
                      Total Orders
                    </span>
                    <p className="font-display text-3xl font-black text-[#141414]">
                      {vendorOrders.length}
                    </p>
                    <span className="text-[11px] text-[#77736C] block">
                      {vendorOrders.length === 0 ? 'Awaiting first customer order' : 'Real customer orders'}
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-[#E6E2DA] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C]">
                      Net Revenue (₦)
                    </span>
                    <p className="font-display text-3xl font-black text-[#C45B3A]">
                      {formatNaira(
                        vendorOrders
                          .filter(o => o.status === 'completed')
                          .reduce((acc, o) => acc + o.subtotal, 0)
                      )}
                    </p>
                    <span className="text-[11px] text-[#77736C] block">
                      Calculated from completed deliveries
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-[#E6E2DA] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C]">
                      Active Menu Items
                    </span>
                    <p className="font-display text-3xl font-black text-[#141414]">
                      {vendorMenu.filter(m => m.isAvailable).length}
                    </p>
                    <span className="text-[11px] text-[#77736C] block">
                      {vendorMenu.length} total items in kitchen
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-[#E6E2DA] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C]">
                      Customer Rating
                    </span>
                    <p className="font-display text-3xl font-black text-[#141414]">
                      {activeVendor.rating > 0 ? `${activeVendor.rating.toFixed(1)} ★` : '—'}
                    </p>
                    <span className="text-[11px] text-[#77736C] block">
                      {activeVendor.reviewsCount === 0 ? 'Zero fake reviews' : `${activeVendor.reviewsCount} reviews`}
                    </span>
                  </div>

                </div>

                {/* Quick Actions & Recent Orders Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E6E2DA] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-[#141414]">
                        Recent Orders
                      </h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-[#C45B3A] hover:underline"
                      >
                        View All ({vendorOrders.length})
                      </button>
                    </div>

                    {vendorOrders.length === 0 ? (
                      <div className="text-center py-12 text-[#77736C] text-xs space-y-2">
                        <ShoppingBag className="w-8 h-8 mx-auto text-[#77736C]/60" />
                        <p className="font-semibold text-[#141414]">No orders yet</p>
                        <p>New orders placed by customers in {SERVICE_LOCATIONS[activeVendor.locationArea].name} will appear here with sound alert notifications.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {vendorOrders.slice(0, 3).map(ord => (
                          <div key={ord.id} className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA] flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-[#141414]">Order #{ord.orderNumber} &bull; {ord.customerName}</p>
                              <p className="text-[#77736C]">{ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-[#C45B3A]">{formatNaira(ord.total)}</span>
                              <p className="text-[10px] text-[#77736C] capitalize">{ord.status.replace(/_/g, ' ')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Kitchen Profile Summary Card */}
                  <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E6E2DA] p-6 space-y-4">
                    <h3 className="font-display text-base font-bold text-[#141414]">
                      Kitchen Details
                    </h3>
                    <div className="space-y-2 text-xs text-[#77736C]">
                      <div className="flex justify-between py-1 border-b border-[#E6E2DA]">
                        <span>Hub</span>
                        <strong className="text-[#141414]">{SERVICE_LOCATIONS[activeVendor.locationArea].name}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#E6E2DA]">
                        <span>Address</span>
                        <span className="text-[#141414] text-right truncate max-w-[180px]">{activeVendor.address}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#E6E2DA]">
                        <span>Hours</span>
                        <span className="text-[#141414]">{activeVendor.openingHours}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#E6E2DA]">
                        <span>Verification</span>
                        <span className="text-emerald-700 font-semibold">Official Partner</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('menu')}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black"
                    >
                      Manage Food Menu
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-[#141414]">
                    Kitchen Orders
                  </h3>
                  <span className="text-xs text-[#77736C]">
                    Manage preparation and fulfillment
                  </span>
                </div>

                {vendorOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E2DA] p-8 text-xs text-[#77736C] space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto text-[#77736C]/60" />
                    <p className="font-display text-base font-bold text-[#141414]">
                      Order feed is currently quiet
                    </p>
                    <p className="max-w-sm mx-auto">
                      When customers place orders, you can accept, set prep times, or decline with a customer-facing reason.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vendorOrders.map(order => (
                      <div
                        key={order.id}
                        className="p-5 rounded-3xl bg-white border border-[#E6E2DA] space-y-4 shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6E2DA]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-extrabold text-base text-[#141414]">
                                Order #{order.orderNumber}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F0EEE8] text-[#141414]">
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-[#77736C] mt-0.5">
                              Customer: <strong>{order.customerName}</strong> ({order.customerPhone}) &bull; {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>

                          <span className="font-display font-bold text-base text-[#C45B3A]">
                            {formatNaira(order.total)}
                          </span>
                        </div>

                        {/* Items ordered */}
                        <div className="space-y-1.5 text-xs">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-[#191919]">
                              <span>
                                {it.quantity}x <strong>{it.name}</strong>
                                {it.selectedOptions && it.selectedOptions.length > 0 && (
                                  <span className="text-[#77736C] ml-1">
                                    ({it.selectedOptions.map(o => o.choiceName).join(', ')})
                                  </span>
                                )}
                              </span>
                              <span>{formatNaira(it.itemTotal)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Instructions */}
                        {order.deliveryDetails && (
                          <div className="p-3 rounded-xl bg-[#F7F6F2] text-xs text-[#77736C] space-y-1">
                            <span className="font-bold text-[#141414] block">Delivery Location:</span>
                            <p>{order.deliveryDetails.street} ({order.deliveryDetails.landmark})</p>
                            {order.deliveryDetails.hostelOrBuilding && (
                              <p>Building/Hostel: {order.deliveryDetails.hostelOrBuilding}</p>
                            )}
                          </div>
                        )}

                        {/* Order Controls */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E6E2DA]">
                          {order.status === 'pending_acceptance' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                                className="py-2 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black"
                              >
                                Accept Order
                              </button>
                              <button
                                onClick={() => setRejectOrderId(order.id)}
                                className="py-2 px-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100"
                              >
                                Decline Order
                              </button>
                            </>
                          )}

                          {order.status === 'accepted' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="py-2 px-4 rounded-xl bg-[#C45B3A] text-white text-xs font-semibold hover:opacity-95"
                            >
                              Mark as Preparing
                            </button>
                          )}

                          {order.status === 'preparing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                              className="py-2 px-4 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                            >
                              Mark Ready for Pickup
                            </button>
                          )}

                          {order.status === 'ready_for_pickup' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                              className="py-2 px-4 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700"
                            >
                              Hand to Rider / Out for Delivery
                            </button>
                          )}

                          {order.status === 'out_for_delivery' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="py-2 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                            >
                              Mark Completed
                            </button>
                          )}

                          {order.status === 'completed' && (
                            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Completed & Fulfilled
                            </span>
                          )}

                          {order.status === 'cancelled' && (
                            <span className="text-xs font-semibold text-red-600">
                              Cancelled: {order.rejectionReason}
                            </span>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* MENU TAB */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#141414]">
                      Menu Items ({vendorMenu.length})
                    </h3>
                    <p className="text-xs text-[#77736C]">
                      Add food items, update Nigerian Naira prices, and toggle daily availability.
                    </p>
                  </div>
                  {!isAddingItem && (
                    <button
                      onClick={() => setIsAddingItem(true)}
                      className="py-2 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-black"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Food Item</span>
                    </button>
                  )}
                </div>

                {/* Add Item Form */}
                {isAddingItem && (
                  <form onSubmit={handleCreateMenuItem} className="p-6 rounded-3xl bg-white border border-[#E6E2DA] space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E6E2DA]">
                      <h4 className="font-display font-bold text-sm text-[#141414]">
                        Create New Menu Listing
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingItem(false)}
                        className="text-xs text-[#77736C] hover:text-[#191919]"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#191919] mb-1">
                          Food Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          placeholder="e.g. Special Smoky Jollof Rice"
                          className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#191919] mb-1">
                          Price in Naira (₦) *
                        </label>
                        <input
                          type="number"
                          required
                          min="100"
                          step="50"
                          value={itemPrice}
                          onChange={(e) => setItemPrice(e.target.value)}
                          placeholder="2500"
                          className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#191919] mb-1">
                          Food Category
                        </label>
                        <select
                          value={itemCategory}
                          onChange={(e) => setItemCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs"
                        >
                          {FOOD_CATEGORIES.map(c => (
                            <option key={c.id} value={c.slug}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#191919] mb-1">
                          Estimated Prep Time (Minutes)
                        </label>
                        <input
                          type="number"
                          value={itemPrepMinutes}
                          onChange={(e) => setItemPrepMinutes(e.target.value)}
                          placeholder="20"
                          className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#191919] mb-1">
                        Food Description
                      </label>
                      <input
                        type="text"
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        placeholder="e.g. Prepared with fresh tomato base, firewood smoky aroma, served with fried plantain."
                        className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs focus:outline-none"
                      />
                    </div>

                    {/* Customization Toggle */}
                    <div className="pt-2 border-t border-[#E6E2DA]">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#191919]">
                        <input
                          type="checkbox"
                          checked={hasCustomizations}
                          onChange={(e) => setHasCustomizations(e.target.checked)}
                          className="text-[#C45B3A] rounded"
                        />
                        <span>Enable item customizations (e.g. protein choice, extra sides)</span>
                      </label>

                      {hasCustomizations && (
                        <div className="mt-3 p-3 rounded-2xl bg-[#F7F6F2] space-y-2 text-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#191919] mb-1">
                              Customization Group Name
                            </label>
                            <input
                              type="text"
                              value={optionName}
                              onChange={(e) => setOptionName(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E6E2DA] text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#191919] mb-1">
                              Choices (Comma-separated with price additions)
                            </label>
                            <input
                              type="text"
                              value={optionChoices}
                              onChange={(e) => setOptionChoices(e.target.value)}
                              placeholder="Beef (+0), Fried Fish (+500), Peppered Turkey (+1200)"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E6E2DA] text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingItem(false)}
                        className="py-2 px-4 rounded-xl bg-[#F0EEE8] text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-5 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black"
                      >
                        Save Food Item
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Menu Items */}
                {vendorMenu.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E2DA] p-8 text-xs text-[#77736C] space-y-2">
                    <UtensilsCrossed className="w-8 h-8 mx-auto text-[#77736C]/60" />
                    <p className="font-display font-bold text-base text-[#141414]">No Menu Items Added</p>
                    <p>Start by adding your signature dishes so customers can discover and order them.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendorMenu.map(item => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-white border border-[#E6E2DA] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-display font-bold text-sm text-[#141414]">
                                {item.name}
                              </h4>
                              <span className="font-display font-bold text-xs text-[#C45B3A]">
                                {formatNaira(item.price)}
                              </span>
                            </div>
                            <button
                              onClick={() => updateMenuItemAvailability(item.id, !item.isAvailable)}
                              className={`py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                                item.isAvailable
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.isAvailable ? 'In Stock' : 'Sold Out'}
                            </button>
                          </div>
                          <p className="text-xs text-[#77736C] mt-1">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#E6E2DA] flex justify-between items-center text-[11px] text-[#77736C]">
                          <span>Prep: ~{item.preparationMinutes} mins</span>
                          <span>{item.options?.length ? `${item.options.length} options` : 'Standard'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* HONEST ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#E6E2DA] p-8 space-y-4">
                  <h3 className="font-display text-lg font-bold text-[#141414]">
                    Honest Vendor Performance
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77736C] max-w-xl leading-relaxed">
                    CHOP is committed to integrity: we never manufacture fake customer counts, conversion boosts, or vanity metrics. All figures reflect verified customer orders in {SERVICE_LOCATIONS[activeVendor.locationArea].name}.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E6E2DA]">
                    <div className="p-4 rounded-2xl bg-[#F7F6F2]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C]">
                        Completed Orders
                      </span>
                      <p className="font-display text-2xl font-black text-[#141414] mt-1">
                        {vendorOrders.filter(o => o.status === 'completed').length}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F6F2]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C]">
                        Total Payouts Due
                      </span>
                      <p className="font-display text-2xl font-black text-[#C45B3A] mt-1">
                        {formatNaira(
                          vendorOrders
                            .filter(o => o.status === 'completed')
                            .reduce((acc, o) => acc + o.subtotal, 0)
                        )}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F6F2]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C]">
                        Fulfilled On Time
                      </span>
                      <p className="font-display text-2xl font-black text-[#141414] mt-1">
                        {vendorOrders.length > 0 ? '100%' : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SETTLEMENT & BANK TAB */}
            {activeTab === 'settlement' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#E6E2DA] p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C45B3A]">
                      Direct Payouts & Settlement
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#141414] mt-1">
                      Nigerian Bank Account Details
                    </h3>
                    <p className="text-xs text-[#77736C] mt-1 max-w-xl leading-relaxed">
                      All completed orders are settled directly into your registered Nigerian bank account. CHOP applies a fair 10% partner commission on delivered meals.
                    </p>
                  </div>

                  {bankSavedMessage && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bank details successfully updated and saved for settlements.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveBankDetails} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-[#191919] mb-1">
                        Bank Name
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs font-semibold text-[#191919] focus:outline-none"
                      >
                        <option value="GTBank">Guaranty Trust Bank (GTBank)</option>
                        <option value="Zenith Bank">Zenith Bank</option>
                        <option value="Access Bank">Access Bank</option>
                        <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                        <option value="UBA">United Bank for Africa (UBA)</option>
                        <option value="Kuda Bank">Kuda Bank</option>
                        <option value="Moniepoint MFB">Moniepoint Microfinance Bank</option>
                        <option value="OPay">OPay Digital Services</option>
                        <option value="Stanbic IBTC">Stanbic IBTC Bank</option>
                        <option value="Fidelity Bank">Fidelity Bank</option>
                        <option value="Wema Bank">Wema Bank / ALAT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#191919] mb-1">
                        10-Digit NUBAN Account Number
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="0123456789"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs font-mono text-[#191919] focus:outline-none focus:border-[#141414]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#191919] mb-1">
                        Account Holder Name (Must match business/owner name)
                      </label>
                      <input
                        type="text"
                        required
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="e.g. Caroline Olusola or Mama Caro Kitchen"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none focus:border-[#141414]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="py-2.5 px-6 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black transition-all"
                      >
                        Save Settlement Details
                      </button>
                    </div>
                  </form>

                  <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#77736C] space-y-1">
                    <span className="font-bold text-[#141414] block">Settlement Schedule:</span>
                    <p>Reconciliation runs weekly every Monday morning. Funds are disbursed automatically via NIP instant settlement.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Reject Order Reason Modal */}
      {rejectOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E6E2DA] shadow-xl space-y-4">
            <h4 className="font-display font-bold text-base text-[#141414]">
              Decline Order
            </h4>
            <p className="text-xs text-[#77736C]">
              Please state why this order cannot be fulfilled right now. This reason is sent to the customer immediately.
            </p>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectOrderId(null)}
                className="py-2 px-4 rounded-xl bg-[#F0EEE8] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="py-2 px-4 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
