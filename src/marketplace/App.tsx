import React from 'react';
import { useStore } from './lib/store';
import { SketchingIntro } from './components/intro/SketchingIntro';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/marketplace/Hero';
import { CategoryFilter } from './components/marketplace/CategoryFilter';
import { EditorialFoodSpotlight } from './components/marketplace/EditorialFoodSpotlight';
import { MarketplaceEmptyState } from './components/marketplace/MarketplaceEmptyState';
import { AuthModal } from './components/marketplace/AuthModal';
import { CartDrawer } from './components/marketplace/CartDrawer';
import { OrderTrackerModal } from './components/marketplace/OrderTrackerModal';
import { CustomerAccountModal } from './components/marketplace/CustomerAccountModal';
import { StorefrontModal } from './components/marketplace/StorefrontModal';
import { HowItWorksModal } from './components/how/HowItWorksModal';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { VendorRecruitmentPage } from './components/vendor/VendorRecruitmentPage';
import { VendorWorkspace } from './components/vendor/VendorWorkspace';
import { AdminControlCenter } from './components/admin/AdminControlCenter';
import { CustomerDashboard } from './components/account/CustomerDashboard';
import { MapPin, Clock, ArrowRight, Store } from 'lucide-react';
import { SERVICE_LOCATIONS, formatNaira } from './lib/constants';

export const AppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    approvedVendors,
    selectedLocation,
    setSelectedVendorStorefront,
    orders,
    setActiveOrderToTrack,
    setIsOrderTrackerOpen,
  } = useStore();

  // Filter approved vendors by selected location, verified status, and completed storefront activation
  const filteredVendors = approvedVendors.filter(
    v => v.locationArea === selectedLocation && v.isVerified && v.isActivated
  );

  const latestActiveOrder = orders.find(
    o => o.status !== 'completed' && o.status !== 'cancelled'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#191919]">
      {/* Signature intro animation */}
      <SketchingIntro />

      {/* Primary application header */}
      <Header />

      {/* Live order notification bar */}
      {latestActiveOrder && (
        <div className="bg-[#141414] text-white py-2 px-4 border-b border-[#C45B3A]">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C45B3A] animate-ping shrink-0" />
              <span>
                Active Order <strong>#{latestActiveOrder.orderNumber}</strong> with {latestActiveOrder.vendorName}:{' '}
                <span className="capitalize text-[#C45B3A] font-semibold">
                  {latestActiveOrder.status.replace(/_/g, ' ')}
                </span>
              </span>
            </div>
            <button
              onClick={() => {
                setActiveOrderToTrack(latestActiveOrder);
                setIsOrderTrackerOpen(true);
              }}
              className="text-white underline hover:text-[#C45B3A] text-xs font-semibold"
            >
              Track Live →
            </button>
          </div>
        </div>
      )}

      {/* Main view router */}
      <main className="flex-1 pb-20 md:pb-0">

        {/* ── Marketplace View ── */}
        {activeView === 'marketplace' && (
          <>
            <Hero />
            <CategoryFilter />

            {/* Live vendor grid — only genuine approved vendors */}
            {filteredVendors.length > 0 && (
              <section className="py-12 bg-white border-y border-[#E6E2DA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C45B3A]">
                          Live Kitchens
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#141414]">
                        {`Available Kitchens in ${SERVICE_LOCATIONS[selectedLocation].name}`}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVendors.map(vendor => (
                      <div
                        key={vendor.id}
                        className="p-5 rounded-3xl bg-[#F7F6F2] border border-[#E6E2DA] flex flex-col justify-between hover:border-[#141414]/30 hover:shadow-xs transition-all group"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#141414] text-white">
                                {SERVICE_LOCATIONS[vendor.locationArea].name}
                              </span>
                              <h3 className="font-display font-bold text-lg text-[#141414] mt-2 group-hover:text-[#C45B3A] transition-colors">
                                {vendor.businessName}
                              </h3>
                            </div>
                            {vendor.isPaused && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                                Taking a break
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#77736C] mt-2 line-clamp-2">{vendor.description}</p>
                          <div className="flex items-center gap-3 mt-4 text-xs text-[#77736C]">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#C45B3A]" />
                              {vendor.landmark}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {vendor.openingHours}
                            </span>
                          </div>
                        </div>
                        <div className="pt-4 mt-4 border-t border-[#E6E2DA] flex justify-between items-center">
                          <span className="text-xs font-semibold text-[#141414]">
                            {vendor.pickupAvailable && vendor.deliveryAvailable
                              ? 'Delivery & Pickup'
                              : vendor.deliveryAvailable
                              ? 'Delivery'
                              : 'Pickup'}
                          </span>
                          <button
                            onClick={() => setSelectedVendorStorefront(vendor)}
                            className="py-1.5 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1 focus:outline-none"
                          >
                            <span>View Menu</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 6. Editorial Food Spotlight — Celebrating Nigerian & Ijebu Food Culture */}
            <EditorialFoodSpotlight />

            {/* 7. Founding Vendor Invitation & Marketplace Onboarding State */}
            <MarketplaceEmptyState />
          </>
        )}

        {/* ── Vendor Recruitment ── */}
        {activeView === 'for-vendors' && <VendorRecruitmentPage />}

        {/* ── Vendor Workspace — only when approved vendors exist ── */}
        {activeView === 'vendor-workspace' && (
          approvedVendors.length > 0 ? (
            <VendorWorkspace />
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#F0EEE8] flex items-center justify-center">
                <Store className="w-6 h-6 text-[#C45B3A]" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-[#141414]">No approved vendor account</h2>
                <p className="text-sm text-[#77736C] mt-2 max-w-xs mx-auto">
                  You'll need an approved CHOP vendor profile to access the kitchen workspace.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveView('for-vendors');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-2.5 px-6 rounded-full bg-[#141414] text-white text-sm font-semibold hover:bg-black transition-all focus:outline-none"
              >
                Apply as a Vendor →
              </button>
            </div>
          )
        )}

        {/* ── Admin Control Centre ── */}
        {activeView === 'admin-control' && <AdminControlCenter />}

        {activeView === 'account' && <CustomerDashboard />}

      </main>

      {/* Footer */}
      <Footer />

      {/* Safe-Area-Aware Customer Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global modals & overlays */}
      <AuthModal />
      <CartDrawer />
      <OrderTrackerModal />
      <CustomerAccountModal />
      <StorefrontModal />
      <HowItWorksModal />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
