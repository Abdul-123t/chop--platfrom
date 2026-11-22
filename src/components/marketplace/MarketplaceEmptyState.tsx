import React from 'react';
import { Store, MapPin, ShieldCheck, ArrowRight, UserPlus, Sparkles, ChefHat } from 'lucide-react';
import { useStore } from '../../lib/store';
import { SERVICE_LOCATIONS } from '../../lib/constants';

export const MarketplaceEmptyState: React.FC = () => {
  const {
    selectedLocation,
    setActiveView,
    searchQuery,
    selectedCategory,
    currentUser,
    openSignUp,
    openSignIn,
  } = useStore();

  const isFiltering = !!searchQuery || !!selectedCategory;

  const handlePrimaryCTA = () => {
    if (currentUser) {
      const el = document.getElementById('food-categories');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      openSignUp();
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#F7F6F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Brand Ceramic Bowl Motif */}
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white border border-[#E6E2DA] shadow-xs flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-3xl bg-[#C45B3A]/5 animate-pulse" />
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 sm:w-12 sm:h-12 relative z-10">
            <path
              d="M10 24C10 32.8366 16.268 40 24 40C31.732 40 38 32.8366 38 24H10Z"
              stroke="#141414" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <path d="M18 40L30 40" stroke="#141414" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 16C18 18 19 20 20 21" stroke="#C45B3A" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 13C23 16 25 18 25.5 20.5" stroke="#C45B3A" strokeWidth="2" strokeLinecap="round" />
            <path d="M29 15C30 17 29 19 28 21" stroke="#C45B3A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Location badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6E2DA] text-xs font-semibold text-[#C45B3A] mb-4 shadow-xs">
          <MapPin className="w-3.5 h-3.5" />
          <span>{SERVICE_LOCATIONS[selectedLocation].name} Hub &bull; Onboarding Initial Cohort</span>
        </div>

        {/* Required Headline & Supporting Text */}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#141414] tracking-tight leading-tight max-w-2xl mx-auto">
          Good food is coming closer.
        </h2>

        <p className="mt-3.5 text-sm sm:text-base text-[#77736C] max-w-xl mx-auto leading-relaxed">
          We&apos;re welcoming the first restaurants, kitchens, street-food sellers and independent food businesses to CHOP.
        </p>

        {/* Filter Feedback Notice if user searched or selected category */}
        {isFiltering && (
          <div className="mt-4 inline-block px-4 py-2 rounded-2xl bg-white border border-[#E6E2DA] shadow-xs text-xs text-[#141414]">
            Searching for <span className="font-bold text-[#C45B3A]">&ldquo;{searchQuery || selectedCategory}&rdquo;</span>. Verified menus will appear immediately as kitchens complete vetting.
          </div>
        )}

        {/* Genuine Vendor Recruitment & Customer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveView('for-vendors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <ChefHat className="w-4 h-4 text-[#C45B3A]" />
            <span>Apply as a Founding Vendor</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!currentUser ? (
            <button
              type="button"
              onClick={handlePrimaryCTA}
              className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-white text-[#191919] border border-[#E6E2DA] text-xs sm:text-sm font-semibold hover:bg-[#F0EEE8] hover:border-[#141414]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-[#77736C]" />
              <span>Create Customer Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrimaryCTA}
              className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-white text-[#191919] border border-[#E6E2DA] text-xs sm:text-sm font-semibold hover:bg-[#F0EEE8] transition-all"
            >
              Browse Food Taxonomy
            </button>
          )}
        </div>

        {/* Transparent Trust Notice */}
        <div className="mt-12 pt-8 border-t border-[#E6E2DA] max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
          <div className="p-4 rounded-2xl bg-white border border-[#E6E2DA]/80">
            <div className="flex items-center gap-2 text-xs font-bold text-[#141414] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#C45B3A]" />
              Verified Kitchens
            </div>
            <p className="text-[11px] text-[#77736C] leading-snug">
              Every vendor profile is physically inspected in person across Ijebu Ode and Ijagun.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E6E2DA]/80">
            <div className="flex items-center gap-2 text-xs font-bold text-[#141414] mb-1">
              <MapPin className="w-4 h-4 text-[#C45B3A]" />
              Authentic Coverage
            </div>
            <p className="text-[11px] text-[#77736C] leading-snug">
              Orders will only be fulfilled within confirmed local delivery zones in Ijebu Ode & Ijagun.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E6E2DA]/80">
            <div className="flex items-center gap-2 text-xs font-bold text-[#141414] mb-1">
              <Sparkles className="w-4 h-4 text-[#C45B3A]" />
              Honest Marketplace
            </div>
            <p className="text-[11px] text-[#77736C] leading-snug">
              No simulated restaurants, fake reviews, or fabricated inventory. Ever.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
