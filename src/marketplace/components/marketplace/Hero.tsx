import React from 'react';
import { Search, MapPin, CheckCircle2, ArrowRight, Sparkles, Compass, Utensils } from 'lucide-react';
import { useStore } from '../../lib/store';
import { SERVICE_LOCATIONS } from '../../lib/constants';
import { LocationArea } from '../../types';

export const Hero: React.FC = () => {
  const {
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    currentUser,
    openSignIn,
  } = useStore();

  const locationInfo = SERVICE_LOCATIONS[selectedLocation];

  const handleExplore = () => {
    const el = document.getElementById('food-categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20 border-b border-[#E6E2DA]/80 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Hub Quick Switcher (Mobile & Desktop) */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border border-[#E6E2DA] shadow-xs max-w-full overflow-x-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C] px-2.5 shrink-0">
              Hub:
            </span>
            {(['ijebu-ode', 'ijagun'] as LocationArea[]).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`py-1.5 px-3 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                  selectedLocation === loc
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'text-[#191919] hover:bg-[#F0EEE8]'
                }`}
              >
                {loc === 'ijebu-ode' ? 'Ijebu Ode' : 'Ijagun'}
              </button>
            ))}
          </div>

          {!currentUser ? (
            <button
              type="button"
              onClick={openSignIn}
              className="text-xs font-semibold text-[#77736C] hover:text-[#141414] transition-colors py-1.5 px-3 rounded-full hover:bg-white/80 shrink-0"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#77736C] shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-[#141414] hidden sm:inline">Signed in as</span>
              <span className="font-semibold text-[#141414]">{currentUser.fullName.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Main Grid: Headline & Search (Left) + Editorial Food Showcase (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── LEFT: Headline & Core Actions ── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Service Location Subheading Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6E2DA] text-xs font-semibold text-[#C45B3A] shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#C45B3A]" />
              <span>{locationInfo.name} &bull; {locationInfo.badge}</span>
            </div>

            {/* Required Headline & Supporting Copy */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#141414] leading-[1.1]">
                Your next great meal <br className="hidden sm:inline" />
                <span className="text-[#C45B3A]">starts here.</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#77736C] max-w-xl font-normal leading-relaxed">
                Discover the food, kitchens and flavours of Ijebu Ode and Ijagun.
              </p>
            </div>

            {/* Responsive Search Input */}
            <div className="bg-white p-2 rounded-2xl border border-[#E6E2DA] shadow-xs max-w-xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="pl-2 sm:pl-3 shrink-0 text-[#C45B3A]">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExplore();
                  }}
                  placeholder="Search jollof, amala, asun, shawarma…"
                  className="w-full bg-transparent text-sm text-[#191919] placeholder-[#77736C] focus:outline-none py-1.5"
                  aria-label="Search for food"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#77736C] hover:text-[#191919] px-2 py-1 shrink-0"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExplore}
                  className="shrink-0 py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-xs active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Action Row: Primary "Explore CHOP" + Subtle "Sign In" */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleExplore}
                className="py-3 px-6 rounded-full bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-sm flex items-center gap-2 active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#C45B3A]" />
                <span>Explore CHOP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!currentUser && (
                <button
                  type="button"
                  onClick={openSignIn}
                  className="py-3 px-5 rounded-full bg-white text-[#191919] border border-[#E6E2DA] text-xs sm:text-sm font-semibold hover:bg-[#F0EEE8] transition-all active:scale-95"
                >
                  Sign In for Fast Orders
                </button>
              )}
            </div>

            {/* Trust Points */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#77736C]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C45B3A] shrink-0" />
                <span>No registration required to browse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C45B3A] shrink-0" />
                <span>Transparent ₦ prices</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C45B3A] shrink-0" />
                <span>Zero fake vendor listings</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Editorial Nigerian Food Imagery & Culture Showcase ── */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white border border-[#E6E2DA] shadow-xs p-5 sm:p-6 space-y-4">
              
              {/* Editorial Badge Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DA]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C45B3A]" />
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-[#141414]">
                    Editorial Food Spotlight
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#77736C] bg-[#F7F6F2] px-2 py-0.5 rounded-full border border-[#E6E2DA]">
                  Ijebu Food Culture
                </span>
              </div>

              {/* Editorial Vignettes (Treating food imagery as cultural editorial content, not fake vendor stock) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Vignette 1: Party Jollof & Asun */}
                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA]/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#141414] text-white">
                      Celebrated
                    </span>
                    <span className="text-[11px] font-bold text-[#C45B3A]">Ijebu Ode</span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-[#141414]">
                    Smoky Party Jollof &amp; Asun
                  </h3>
                  <p className="text-[11px] text-[#77736C] leading-snug">
                    Slow-cooked firewood jollof with spicy peppered goat meat cut fresh.
                  </p>
                </div>

                {/* Vignette 2: Pounded Yam & Egusi */}
                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA]/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#141414] text-white">
                      Comfort Classic
                    </span>
                    <span className="text-[11px] font-bold text-[#C45B3A]">Ijebu Ode</span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-[#141414]">
                    Pounded Yam &amp; Egusi
                  </h3>
                  <p className="text-[11px] text-[#77736C] leading-snug">
                    Velvety swallow with rich melon-seed soup, stockfish and assorted cuts.
                  </p>
                </div>

                {/* Vignette 3: Student Shawarma */}
                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA]/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#141414] text-white">
                      Street Food
                    </span>
                    <span className="text-[11px] font-bold text-[#C45B3A]">Ijagun</span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-[#141414]">
                    Double Sausage Shawarma
                  </h3>
                  <p className="text-[11px] text-[#77736C] leading-snug">
                    Toasted flatbread wrap with grilled chicken and spicy cream dressing.
                  </p>
                </div>

                {/* Vignette 4: Peppered Grills & Suya */}
                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E6E2DA]/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#141414] text-white">
                      Evening Grill
                    </span>
                    <span className="text-[11px] font-bold text-[#C45B3A]">Ijebu Ode</span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-[#141414]">
                    Charcoal Grilled Fish &amp; Yam
                  </h3>
                  <p className="text-[11px] text-[#77736C] leading-snug">
                    Tender catfish seasoned with yaji pepper and golden fried dundun slices.
                  </p>
                </div>

              </div>

              {/* Clear Honest Disclosure */}
              <div className="pt-2 border-t border-[#E6E2DA]/70 flex items-center justify-between text-[11px] text-[#77736C]">
                <span>Service Location: {locationInfo.name}</span>
                <button
                  type="button"
                  onClick={handleExplore}
                  className="font-semibold text-[#141414] hover:text-[#C45B3A] transition-colors"
                >
                  View Categories &rarr;
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
