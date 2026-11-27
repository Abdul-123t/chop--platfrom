import React from 'react';
import { ArrowLeft, LayoutDashboard, LogOut, MapPin, Receipt, UserRound } from 'lucide-react';
import { SERVICE_LOCATIONS } from '../../lib/constants';
import { useStore, type AccountTab } from '../../lib/store';
import { AccountAddresses } from './AccountAddresses';
import { AccountOrders } from './AccountOrders';
import { AccountOverview } from './AccountOverview';
import { AccountProfile } from './AccountProfile';

const TABS: Array<{ value: AccountTab; label: string; icon: typeof Receipt }> = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'orders', label: 'Orders', icon: Receipt },
  { value: 'addresses', label: 'Addresses', icon: MapPin },
  { value: 'profile', label: 'Profile', icon: UserRound },
];

export const CustomerDashboard: React.FC = () => {
  const { currentUser, accountTab, setAccountTab, setActiveView, logoutCustomer, openSignIn } = useStore();

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F0EEE8] flex items-center justify-center">
          <UserRound className="w-6 h-6 text-[#C45B3A]" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-[#141414]">Sign in to your account</h1>
          <p className="text-sm text-[#77736C] mt-1 max-w-xs">See your orders, saved addresses and profile.</p>
        </div>
        <button type="button" onClick={openSignIn} className="py-2.5 px-6 rounded-xl bg-[#141414] text-white text-sm font-semibold hover:bg-black">
          Sign in
        </button>
      </div>
    );
  }

  const signOut = () => {
    if (window.confirm('Sign out of CHOP?')) logoutCustomer();
  };

  return (
    <div className="bg-[#F7F6F2] min-h-[70vh] pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        <button
          type="button"
          onClick={() => setActiveView('marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#77736C] hover:text-[#141414]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to food spots
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#141414] flex items-center justify-center shrink-0">
            <span className="text-white text-base font-black uppercase">{currentUser.fullName?.[0] || 'C'}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#141414] truncate">
              Hi, {currentUser.fullName.split(/\s+/)[0]}
            </h1>
            <p className="text-xs text-[#77736C] truncate">
              {currentUser.phone}
              {currentUser.email ? ` · ${currentUser.email}` : ''} · {SERVICE_LOCATIONS[currentUser.preferredLocation]?.name}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 py-2 px-3 rounded-xl border border-[#E6E2DA] bg-white text-[11px] font-semibold text-[#77736C] hover:text-red-600"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>

        <nav aria-label="Account sections" className="grid grid-cols-4 gap-1.5 sm:flex">
          {TABS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-current={accountTab === value ? 'page' : undefined}
              onClick={() => setAccountTab(value)}
              className={`min-w-0 inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3.5 rounded-2xl sm:rounded-full text-[11px] sm:text-xs font-semibold border transition-colors ${
                accountTab === value
                  ? 'bg-[#141414] text-white border-[#141414]'
                  : 'bg-white text-[#191919] border-[#E6E2DA] hover:border-[#141414]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        {accountTab === 'overview' && <AccountOverview />}
        {accountTab === 'orders' && <AccountOrders />}
        {accountTab === 'addresses' && <AccountAddresses />}
        {accountTab === 'profile' && <AccountProfile onSignOut={signOut} />}
      </div>
    </div>
  );
};
