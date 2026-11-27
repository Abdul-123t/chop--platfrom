import React from 'react';
import { Compass, Search, Receipt, User, ShoppingBag } from 'lucide-react';
import { useStore } from '../../lib/store';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    openSignIn,
    setIsAccountModalOpen,
    orders,
    activeOrderToTrack,
    setActiveOrderToTrack,
    setIsOrderTrackerOpen,
    cart,
    setIsCartDrawerOpen,
    approvedVendors,
    openAccount,
  } = useStore();

  // Vendor & Admin workspaces have their own separate navigation
  if (activeView === 'vendor-workspace' || activeView === 'admin-control') {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#141414] text-white p-3 border-t border-white/10 md:hidden flex items-center justify-between shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <span className="text-xs font-semibold text-white/80">
          {activeView === 'admin-control' ? 'Admin Control Centre' : 'Kitchen Management'}
        </span>
        <button
          type="button"
          onClick={() => {
            setActiveView('marketplace');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs font-bold bg-[#C45B3A] text-white py-1.5 px-3 rounded-lg hover:bg-[#b34e30] transition-colors"
        >
          Exit to Customer App &rarr;
        </button>
      </div>
    );
  }

  const latestActiveOrder = orders.find(
    o => o.status !== 'completed' && o.status !== 'cancelled'
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const showCartPill = approvedVendors.length > 0 && cartCount > 0;

  const handleDiscover = () => {
    if (activeView === 'marketplace') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveView('marketplace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = () => {
    if (activeView !== 'marketplace') {
      setActiveView('marketplace');
    }
    setTimeout(() => {
      const searchInput = document.querySelector<HTMLInputElement>('input[aria-label="Search for food"]');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      } else {
        const categoriesEl = document.getElementById('food-categories');
        categoriesEl?.scrollIntoView({ behavior: 'smooth' });
      }
    }, activeView === 'marketplace' ? 50 : 200);
  };

  const handleOrders = () => {
    if (!currentUser) {
      openSignIn();
      return;
    }

    if (latestActiveOrder) {
      setActiveOrderToTrack(latestActiveOrder);
      setIsOrderTrackerOpen(true);
    } else {
      openAccount('orders');
    }
  };

  const handleAccount = () => {
    if (!currentUser) {
      openSignIn();
    } else {
      setIsAccountModalOpen(true);
    }
  };

  return (
    <>
      {/* Floating Cart Indicator on mobile when ordering has active items */}
      {showCartPill && (
        <aside
          aria-label="Active Cart"
          className="fixed bottom-[74px] inset-x-4 z-40 md:hidden animate-in slide-in-from-bottom-2 duration-200"
        >
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-full bg-[#141414] text-white rounded-2xl p-3 shadow-xl flex items-center justify-between border border-white/10 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C45B3A] text-white flex items-center justify-center font-bold text-xs">
                {cartCount}
              </div>
              <span className="text-xs font-semibold">View Current Order</span>
            </div>
            <span className="text-xs font-bold text-[#C45B3A] flex items-center gap-1">
              Checkout &rarr;
            </span>
          </button>
        </aside>
      )}

      {/* Fixed Safe-Area-Aware Bottom Navigation */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E2DA] md:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
      >
        <div className="grid grid-cols-4 h-15 items-center px-2">

          {/* 1. Discover */}
          <button
            type="button"
            onClick={handleDiscover}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors select-none active:scale-95 ${
              activeView === 'marketplace'
                ? 'text-[#C45B3A]'
                : 'text-[#77736C] hover:text-[#191919]'
            }`}
            aria-label="Discover food in Ijebu Ode and Ijagun"
          >
            <Compass className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-tight">Discover</span>
          </button>

          {/* 2. Search */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[#77736C] hover:text-[#191919] transition-colors select-none active:scale-95"
            aria-label="Search food menus"
          >
            <Search className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            <span className="text-[10px] font-semibold tracking-tight">Search</span>
          </button>

          {/* 3. Orders */}
          <button
            type="button"
            onClick={handleOrders}
            className="relative flex flex-col items-center justify-center gap-1 py-1 text-[#77736C] hover:text-[#191919] transition-colors select-none active:scale-95"
            aria-label="View orders"
          >
            <div className="relative">
              <Receipt className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
              {latestActiveOrder && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C45B3A] animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Orders</span>
          </button>

          {/* 4. Account */}
          <button
            type="button"
            onClick={handleAccount}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[#77736C] hover:text-[#191919] transition-colors select-none active:scale-95"
            aria-label={currentUser ? 'Customer account' : 'Sign in to account'}
          >
            <div className="relative">
              {currentUser ? (
                <div className="w-5 h-5 rounded-full bg-[#141414] text-white flex items-center justify-center text-[10px] font-bold uppercase leading-none">
                  {currentUser.fullName?.[0] || 'C'}
                </div>
              ) : (
                <User className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight">
              {currentUser ? 'Account' : 'Sign In'}
            </span>
          </button>

        </div>
      </nav>
    </>
  );
};
