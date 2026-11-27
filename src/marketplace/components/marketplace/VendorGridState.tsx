import React from 'react';
import { MapPin, RefreshCw, SearchX, WifiOff } from 'lucide-react';
import { FOOD_CATEGORIES, SERVICE_LOCATIONS } from '../../lib/constants';
import { useStore } from '../../lib/store';
import { filterVendors } from '../../lib/vendorFilters';
import type { LocationArea } from '../../types';

interface VendorGridStateProps {
  areaCount: number;
  otherAreaCount: number;
  shownCount: number;
}

function Shell({ icon, title, body, children }: { icon: React.ReactNode; title: string; body: string; children?: React.ReactNode }) {
  return (
    <section className="py-10 bg-white border-y border-[#E6E2DA]">
      <div className="max-w-xl mx-auto px-4 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#F0EEE8] text-[#C45B3A] flex items-center justify-center mx-auto">{icon}</div>
        <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#141414]">{title}</h3>
        <p className="text-sm text-[#77736C]">{body}</p>
        {children && <div className="pt-1 flex flex-wrap items-center justify-center gap-2">{children}</div>}
      </div>
    </section>
  );
}

const primary =
  'inline-flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-colors';
const secondary =
  'inline-flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-[#F0EEE8] text-[#191919] text-xs sm:text-sm font-semibold hover:bg-[#E6E2DA] transition-colors';

export const VendorGridState: React.FC<VendorGridStateProps> = ({ areaCount, otherAreaCount, shownCount }) => {
  const {
    approvedVendors,
    menuItems,
    marketplaceLoading,
    marketplaceError,
    reloadMarketplace,
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  if (approvedVendors.length === 0 && marketplaceLoading) {
    return (
      <section className="py-12 bg-white border-y border-[#E6E2DA]" aria-busy="true" aria-label="Loading food spots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((key) => (
            <div key={key} className="rounded-3xl border border-[#E6E2DA] p-6 space-y-3 animate-pulse">
              <div className="h-4 w-1/3 rounded bg-[#F0EEE8]" />
              <div className="h-6 w-2/3 rounded bg-[#F0EEE8]" />
              <div className="h-3 w-full rounded bg-[#F0EEE8]" />
              <div className="h-3 w-4/5 rounded bg-[#F0EEE8]" />
              <div className="h-9 w-1/2 rounded-xl bg-[#F0EEE8]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (approvedVendors.length === 0 && marketplaceError) {
    return (
      <Shell
        icon={<WifiOff className="w-6 h-6" />}
        title="We couldn't load food spots"
        body="Check your connection and try again. Your cart and account are safe."
      >
        <button type="button" onClick={reloadMarketplace} className={primary}>
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </Shell>
    );
  }

  if (shownCount > 0) return null;

  const otherArea: LocationArea = selectedLocation === 'ijagun' ? 'ijebu-ode' : 'ijagun';

  if (areaCount > 0 && searchQuery.trim()) {
    return (
      <Shell
        icon={<SearchX className="w-6 h-6" />}
        title={`No food spots match "${searchQuery.trim()}"`}
        body={`Try another dish or vendor name. We searched every menu in ${SERVICE_LOCATIONS[selectedLocation].name}.`}
      >
        <button type="button" onClick={() => setSearchQuery('')} className={primary}>
          Clear search
        </button>
        {selectedCategory && (
          <button type="button" onClick={() => setSelectedCategory(null)} className={secondary}>
            All categories
          </button>
        )}
      </Shell>
    );
  }

  if (areaCount > 0 && selectedCategory) {
    const elsewhere = filterVendors(approvedVendors, menuItems, { area: otherArea, query: '', category: selectedCategory }).length;
    const categoryName = FOOD_CATEGORIES.find((category) => category.slug === selectedCategory)?.name ?? 'this category';
    if (elsewhere > 0) {
      return (
        <Shell
          icon={<MapPin className="w-6 h-6" />}
          title={`No ${categoryName} in ${SERVICE_LOCATIONS[selectedLocation].name} yet`}
          body={`${elsewhere} ${elsewhere === 1 ? 'food spot serves' : 'food spots serve'} it in ${SERVICE_LOCATIONS[otherArea].name}.`}
        >
          <button type="button" onClick={() => setSelectedLocation(otherArea)} className={primary}>
            See {SERVICE_LOCATIONS[otherArea].name}
          </button>
          <button type="button" onClick={() => setSelectedCategory(null)} className={secondary}>
            All categories
          </button>
        </Shell>
      );
    }
  }

  if (areaCount === 0 && otherAreaCount > 0) {
    return (
      <Shell
        icon={<MapPin className="w-6 h-6" />}
        title={`No food spots in ${SERVICE_LOCATIONS[selectedLocation].name} yet`}
        body={`${otherAreaCount} ${otherAreaCount === 1 ? 'food spot is' : 'food spots are'} already live in ${SERVICE_LOCATIONS[otherArea].name}.`}
      >
        <button type="button" onClick={() => setSelectedLocation(otherArea)} className={primary}>
          See {SERVICE_LOCATIONS[otherArea].name}
        </button>
      </Shell>
    );
  }

  return null;
};
