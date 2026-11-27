import React, { useState } from 'react';
import { X, MapPin, Plus, Trash2, Clock, User, LogOut } from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatNaira, SERVICE_LOCATIONS } from '../../lib/constants';
import { LocationArea } from '../../types';

export const CustomerAccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    currentUser,
    logoutCustomer,
    openSignIn,
    savedAddresses,
    saveAddress,
    deleteAddress,
    orders,
    setActiveOrderToTrack,
    setIsOrderTrackerOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'addresses' | 'orders'>('addresses');

  // New Address form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [label, setLabel] = useState('Hostel / Room');
  const [locationArea, setLocationArea] = useState<LocationArea>('ijagun');
  const [street, setStreet] = useState('');
  const [hostelOrBuilding, setHostelOrBuilding] = useState('');
  const [landmark, setLandmark] = useState('');
  const [directions, setDirections] = useState('');

  if (!isAccountModalOpen) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !landmark.trim()) return;
    saveAddress({
      label: label.trim() || 'Address',
      locationArea,
      street: street.trim(),
      hostelOrBuilding: hostelOrBuilding.trim() || undefined,
      landmark: landmark.trim(),
      directions: directions.trim() || undefined,
      isDefault: savedAddresses.length === 0,
    });
    setIsAddingAddress(false);
    setStreet('');
    setHostelOrBuilding('');
    setLandmark('');
    setDirections('');
  };

  const handleLogout = () => {
    logoutCustomer();
    setIsAccountModalOpen(false);
  };

  const inputClass =
    'w-full px-3 py-1.5 rounded-lg bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#F7F6F2] rounded-3xl border border-[#E6E2DA] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200">

        {/* ── Header ── */}
        <div className="p-5 border-b border-[#E6E2DA] bg-white">

          {/* If not authenticated */}
          {!currentUser ? (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#141414]">My Account</h3>
                <p className="text-xs text-[#77736C] mt-0.5">Sign in to view your profile, addresses and orders.</p>
              </div>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1.5 rounded-full text-[#77736C] hover:text-[#191919] hover:bg-[#F0EEE8]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              {/* Top row: title + close */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-extrabold text-lg text-[#141414]">My Account</h3>
                <button
                  onClick={() => setIsAccountModalOpen(false)}
                  className="p-1.5 rounded-full text-[#77736C] hover:text-[#191919] hover:bg-[#F0EEE8]"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User identity row */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA]">
                <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-black uppercase">
                    {currentUser.fullName?.[0] || 'C'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#141414] truncate">{currentUser.fullName}</p>
                  <p className="text-[11px] text-[#77736C] truncate">
                    {currentUser.email || currentUser.phone}
                  </p>
                  <p className="text-[10px] text-[#C45B3A] font-semibold mt-0.5">
                    {SERVICE_LOCATIONS[currentUser.preferredLocation]?.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="shrink-0 flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-[#77736C] hover:text-red-600 hover:bg-red-50 border border-[#E6E2DA] text-[11px] font-semibold transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Not authenticated: sign in prompt */}
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F0EEE8] flex items-center justify-center">
              <User className="w-6 h-6 text-[#C45B3A]" />
            </div>
            <div>
              <p className="font-display font-bold text-[#141414]">You're not signed in</p>
              <p className="text-xs text-[#77736C] mt-1 max-w-xs">
                Sign in to save your delivery addresses and track your orders on CHOP.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAccountModalOpen(false);
                openSignIn();
              }}
              className="py-2.5 px-6 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black transition-all focus:outline-none"
            >
              Sign In to Your Account
            </button>
          </div>
        ) : (
          <>
            {/* Tab switcher */}
            <div className="grid grid-cols-2 p-2 bg-white border-b border-[#E6E2DA] gap-2">
              <button
                onClick={() => setActiveTab('addresses')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-[#141414] text-white'
                    : 'text-[#77736C] hover:bg-[#F7F6F2]'
                }`}
              >
                Delivery Addresses ({savedAddresses.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#141414] text-white'
                    : 'text-[#77736C] hover:bg-[#F7F6F2]'
                }`}
              >
                Order History ({orders.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">

              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#77736C]">
                      Save your hostels, halls and landmarks for fast 1-click checkout.
                    </p>
                    {!isAddingAddress && (
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="py-1.5 px-3 rounded-full bg-[#141414] text-white text-xs font-semibold flex items-center gap-1 hover:bg-black"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>

                  {isAddingAddress && (
                    <form onSubmit={handleSaveAddress} className="p-4 rounded-2xl bg-white border border-[#E6E2DA] space-y-3">
                      <h4 className="font-display text-xs font-bold text-[#141414]">New Delivery Address</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#191919] mb-1">Label</label>
                          <input type="text" required value={label} onChange={(e) => setLabel(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#191919] mb-1">Service Area</label>
                          <select value={locationArea} onChange={(e) => setLocationArea(e.target.value as LocationArea)} className={inputClass}>
                            <option value="ijebu-ode">Ijebu Ode</option>
                            <option value="ijagun">Ijagun</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#191919] mb-1">Street / Building <span className="text-[#C45B3A]">*</span></label>
                        <input type="text" required value={street} onChange={(e) => setStreet(e.target.value)} placeholder="e.g. 8 New Road or Folagbade" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#191919] mb-1">Hostel / Estate (optional)</label>
                        <input type="text" value={hostelOrBuilding} onChange={(e) => setHostelOrBuilding(e.target.value)} placeholder="e.g. Excellence Hostel, Block B" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#191919] mb-1">Landmark <span className="text-[#C45B3A]">*</span></label>
                        <input type="text" required value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. Opposite Bovas Filling Station" className={inputClass} />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button type="submit" className="py-2 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold">Save Address</button>
                        <button type="button" onClick={() => setIsAddingAddress(false)} className="py-2 px-4 rounded-xl bg-[#F0EEE8] text-[#191919] text-xs font-semibold">Cancel</button>
                      </div>
                    </form>
                  )}

                  {savedAddresses.length === 0 && !isAddingAddress ? (
                    <div className="text-center py-8 bg-white rounded-2xl border border-[#E6E2DA] p-6 text-xs text-[#77736C]">
                      No saved addresses yet. Add one for 1-click ordering.
                    </div>
                  ) : (
                    savedAddresses.map((addr) => (
                      <div key={addr.id} className="p-3.5 rounded-2xl bg-white border border-[#E6E2DA] flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-[#141414]">{addr.label}</span>
                            <span className="text-[10px] text-[#C45B3A] bg-[#C45B3A]/10 px-1.5 py-0.5 rounded font-semibold">
                              {SERVICE_LOCATIONS[addr.locationArea].name}
                            </span>
                          </div>
                          <p className="text-[#191919] font-medium">{addr.street}</p>
                          {addr.hostelOrBuilding && <p className="text-[#77736C]">{addr.hostelOrBuilding}</p>}
                          <p className="text-[11px] text-[#77736C]">Landmark: {addr.landmark}</p>
                        </div>
                        <button onClick={() => deleteAddress(addr.id)} className="text-[#77736C] hover:text-red-600 p-1" aria-label="Delete address">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-[#E6E2DA] p-6 text-xs text-[#77736C]">
                      No orders placed yet. Once you place an order, tracking updates will appear here.
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div key={ord.id} className="p-4 rounded-2xl bg-white border border-[#E6E2DA] space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-display font-bold text-sm text-[#141414]">{ord.vendorName}</span>
                            <p className="text-[11px] text-[#77736C]">
                              Order #{ord.orderNumber} · {new Date(ord.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full bg-[#F0EEE8] text-[#141414] capitalize">
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#E6E2DA]">
                          <span className="font-bold text-[#C45B3A]">{formatNaira(ord.total)}</span>
                          <button
                            onClick={() => {
                              setActiveOrderToTrack(ord);
                              setIsAccountModalOpen(false);
                              setIsOrderTrackerOpen(true);
                            }}
                            className="py-1 px-3 rounded-lg bg-[#141414] text-white text-[11px] font-semibold hover:bg-black"
                          >
                            Track Status
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
