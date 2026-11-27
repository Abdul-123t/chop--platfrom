import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ChevronDown,
  Check,
  Menu,
  X,
  LogIn,
  UserPlus,
  User,
  LogOut,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { SERVICE_LOCATIONS } from '../../lib/constants';
import { LocationArea } from '../../types';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedLocation,
    setSelectedLocation,
    currentUser,
    openSignIn,
    openSignUp,
    logoutCustomer,
    setIsAccountModalOpen,
    approvedVendors,
    cart,
    setIsCartDrawerOpen,
    setIsHowItWorksOpen,
  } = useStore();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const currentLocation: LocationArea =
    selectedLocation === 'ijagun' ? 'ijagun' : 'ijebu-ode';
  const currentLocationName =
    SERVICE_LOCATIONS[currentLocation]?.name || 'Ijebu Ode';

  const hasVendors = approvedVendors.length > 0;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAuthenticated = !!currentUser;

  // Scroll detection for subtle header elevation
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click-outside & Escape key handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(target)
      ) {
        setIsLocationDropdownOpen(false);
      }
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(target)
      ) {
        setIsAccountMenuOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        const el = target as HTMLElement;
        if (!el.closest('[data-mobile-trigger]')) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLocationDropdownOpen(false);
        setIsAccountMenuOpen(false);
        setIsMobileMenuOpen(false);
        locationButtonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMobileMenuOpen]);

  // ── Navigation handlers ──────────────────────────────────────────────────
  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleDiscover = () => {
    if (activeView === 'marketplace') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveView('marketplace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeAll();
  };

  const handleCategories = () => {
    setActiveView('marketplace');
    setTimeout(() => {
      const el = document.getElementById('food-categories');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, activeView === 'marketplace' ? 0 : 150);
    closeAll();
  };

  const handleForVendors = () => {
    setActiveView('for-vendors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeAll();
  };

  const handleHowItWorks = () => {
    setIsHowItWorksOpen(true);
    closeAll();
  };

  const handleLocationSelect = (loc: LocationArea) => {
    setSelectedLocation(loc);
    setIsLocationDropdownOpen(false);
  };

  const handleSignIn = () => {
    openSignIn();
    closeAll();
  };

  const handleCreateAccount = () => {
    openSignUp();
    closeAll();
  };

  const handleLogout = () => {
    logoutCustomer();
    closeAll();
  };

  const handleCartOpen = () => {
    setIsCartDrawerOpen(true);
    closeAll();
  };

  // ── Shared nav link classes ───────────────────────────────────────────────
  const navLinkBase =
    'text-sm tracking-tight py-2 px-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20 rounded-md';
  const navLinkActive = `${navLinkBase} text-[#141414] font-semibold`;
  const navLinkIdle = `${navLinkBase} text-[#77736C] font-medium hover:text-[#191919]`;

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* DESKTOP + TABLET HEADER                                             */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header
        className={`sticky top-0 z-40 bg-[#F7F6F2]/95 backdrop-blur-md border-b transition-all duration-200 ${
          isScrolled
            ? 'border-[#E6E2DA] shadow-sm shadow-black/[0.04]'
            : 'border-[#E6E2DA]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-[68px]">

            {/* ── LEFT: Wordmark ─────────────────────────────────────────── */}
            <button
              onClick={handleDiscover}
              className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/30 rounded-xl py-1 pr-1 transition-transform duration-150 active:scale-[0.98] shrink-0"
              aria-label="CHOP — Food discovery in Ijebu Ode and Ijagun"
            >
              {/* Brand glyph */}
              <div className="w-8 h-8 rounded-xl bg-[#141414] flex items-center justify-center shadow-sm group-hover:bg-black transition-colors shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                  <path
                    d="M5 12C5 16.4183 8.58172 20 13 20C17.4183 20 21 16.4183 21 12H5Z"
                    fill="#F7F6F2"
                  />
                  <path
                    d="M10 7C9.5 8 10 9 10.5 10"
                    stroke="#C45B3A"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 6C13.5 7.5 14.5 8.5 15 9.5"
                    stroke="#C45B3A"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Wordmark */}
              <span className="font-display text-[22px] font-black tracking-tight text-[#141414] leading-none">
                CHOP<span className="text-[#C45B3A]">.</span>
              </span>
            </button>

            {/* ── CENTRE: Primary Nav Links ──────────────────────────────── */}
            <nav
              className="hidden md:flex items-center gap-8 lg:gap-10"
              aria-label="Main navigation"
            >
              <button
                onClick={handleDiscover}
                className={activeView === 'marketplace' ? navLinkActive : navLinkIdle}
              >
                Discover
              </button>

              <button
                onClick={handleCategories}
                className={navLinkIdle}
              >
                Categories
              </button>

              <button
                onClick={handleForVendors}
                className={activeView === 'for-vendors' ? navLinkActive : navLinkIdle}
              >
                For Vendors
              </button>
            </nav>

            {/* ── RIGHT: Location + Auth + Cart ─────────────────────────── */}
            <div className="hidden md:flex items-center gap-2.5">

              {/* Location selector */}
              <div className="relative" ref={locationDropdownRef}>
                <button
                  ref={locationButtonRef}
                  type="button"
                  onClick={() => setIsLocationDropdownOpen(o => !o)}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-full border border-[#E6E2DA] bg-white text-xs font-semibold text-[#191919] hover:border-[#141414]/30 hover:bg-[#F0EEE8]/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20 shadow-xs"
                  aria-haspopup="listbox"
                  aria-expanded={isLocationDropdownOpen}
                  aria-label={`Current location: ${currentLocationName}. Click to switch.`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C45B3A] shrink-0" aria-hidden="true" />
                  <span>{currentLocationName}</span>
                  <ChevronDown
                    className={`w-3 h-3 text-[#77736C] transition-transform duration-150 shrink-0 ${
                      isLocationDropdownOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isLocationDropdownOpen && (
                  <div
                    role="listbox"
                    aria-label="Select service location"
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E6E2DA] shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#77736C]">
                      Service Location
                    </div>

                    {/* Ijebu Ode */}
                    <button
                      type="button"
                      role="option"
                      aria-selected={currentLocation === 'ijebu-ode'}
                      onClick={() => handleLocationSelect('ijebu-ode')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        currentLocation === 'ijebu-ode'
                          ? 'bg-[#F0EEE8] text-[#141414] font-semibold'
                          : 'hover:bg-[#F7F6F2] text-[#191919] font-medium'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-[#141414]">Ijebu Ode</span>
                        <span className="text-[10px] text-[#77736C] font-normal">
                          General Service Area
                        </span>
                      </div>
                      {currentLocation === 'ijebu-ode' && (
                        <Check className="w-4 h-4 text-[#C45B3A] shrink-0 ml-2" aria-hidden="true" />
                      )}
                    </button>

                    {/* Ijagun */}
                    <button
                      type="button"
                      role="option"
                      aria-selected={currentLocation === 'ijagun'}
                      onClick={() => handleLocationSelect('ijagun')}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between mt-0.5 ${
                        currentLocation === 'ijagun'
                          ? 'bg-[#F0EEE8] text-[#141414] font-semibold'
                          : 'hover:bg-[#F7F6F2] text-[#191919] font-medium'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-[#141414]">Ijagun</span>
                        <span className="text-[10px] text-[#77736C] font-normal">
                          TASUED &amp; Surrounds
                        </span>
                      </div>
                      {currentLocation === 'ijagun' && (
                        <Check className="w-4 h-4 text-[#C45B3A] shrink-0 ml-2" aria-hidden="true" />
                      )}
                    </button>

                    <div className="px-3 pt-2 pb-1 border-t border-[#E6E2DA]/60 mt-1">
                      <p className="text-[10px] text-[#77736C] leading-tight">
                        Serving communities in Ijebu Ode and Ijagun only.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-[#E6E2DA] mx-0.5" aria-hidden="true" />

              {/* ── Auth: unauthenticated ── */}
              {!isAuthenticated && (
                <>
                  <button
                    onClick={handleSignIn}
                    className="text-xs font-semibold text-[#191919] py-2 px-3.5 rounded-full hover:bg-[#F0EEE8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleCreateAccount}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#141414] py-2 px-4 rounded-full hover:bg-black transition-colors shadow-xs active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/30"
                  >
                    <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                    Create Account
                  </button>
                </>
              )}

              {/* ── Auth: authenticated ── */}
              {isAuthenticated && (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen(o => !o)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-[#E6E2DA] bg-white text-xs font-semibold text-[#191919] hover:border-[#141414]/30 hover:bg-[#F0EEE8]/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20 shadow-xs"
                    aria-haspopup="true"
                    aria-expanded={isAccountMenuOpen}
                    aria-label="Account menu"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#141414] flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-black uppercase leading-none">
                        {currentUser?.fullName?.[0] || 'C'}
                      </span>
                    </div>
                    <span className="max-w-[90px] truncate">
                      {currentUser?.fullName?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-[#77736C] transition-transform duration-150 shrink-0 ${
                        isAccountMenuOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isAccountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#E6E2DA] shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-2 border-b border-[#E6E2DA]/60 mb-1">
                        <p className="text-xs font-semibold text-[#141414] truncate">
                          {currentUser?.fullName}
                        </p>
                        <p className="text-[10px] text-[#77736C] truncate mt-0.5">
                          {currentUser?.email || currentUser?.phone}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsAccountMenuOpen(false); setIsAccountModalOpen(true); }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-[#191919] hover:bg-[#F7F6F2] transition-colors flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-[#77736C]" aria-hidden="true" />
                        My Account
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-[#77736C] hover:bg-[#F7F6F2] hover:text-[#191919] transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Cart (only when vendors exist and user is authenticated) */}
              {hasVendors && isAuthenticated && (
                <button
                  type="button"
                  onClick={handleCartOpen}
                  className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[#E6E2DA] bg-white text-[#191919] hover:bg-[#F0EEE8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20 shadow-xs ml-0.5"
                  aria-label={`Cart — ${cartItemCount} item${cartItemCount !== 1 ? 's' : ''}`}
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C45B3A] text-white text-[9px] font-black flex items-center justify-center leading-none">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* ── MOBILE: location pill + cart (if any) + hamburger ─────── */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-full border border-[#E6E2DA] bg-white text-[11px] font-semibold text-[#191919] hover:bg-[#F0EEE8] transition-colors focus:outline-none"
                aria-label={`${currentLocationName} — tap to change`}
              >
                <MapPin className="w-3 h-3 text-[#C45B3A]" aria-hidden="true" />
                <span>{currentLocationName}</span>
              </button>

              {hasVendors && isAuthenticated && cartItemCount > 0 && (
                <button
                  type="button"
                  onClick={handleCartOpen}
                  className="relative w-8.5 h-8.5 flex items-center justify-center rounded-xl border border-[#E6E2DA] bg-white text-[#191919] active:scale-95"
                  aria-label={`Cart (${cartItemCount} items)`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#C45B3A] text-white text-[8px] font-bold flex items-center justify-center">
                    {cartItemCount}
                  </span>
                </button>
              )}

              <button
                data-mobile-trigger
                type="button"
                onClick={() => setIsMobileMenuOpen(o => !o)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-[#E6E2DA] bg-white text-[#191919] hover:bg-[#F0EEE8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/30"
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-drawer"
              >
                {isMobileMenuOpen
                  ? <X className="w-4.5 h-4.5" aria-hidden="true" />
                  : <Menu className="w-4.5 h-4.5" aria-hidden="true" />
                }
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MOBILE NAVIGATION DRAWER                                            */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel (slides down from top) */}
          <div
            ref={mobileMenuRef}
            className="relative bg-[#F7F6F2] border-b border-[#E6E2DA] shadow-xl px-5 pt-4 pb-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-top duration-200"
          >
            {/* ── Drawer header row ── */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DA]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#141414] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M5 12C5 16.4183 8.58172 20 13 20C17.4183 20 21 16.4183 21 12H5Z" fill="#F7F6F2" />
                    <path d="M10 7C9.5 8 10 9 10.5 10" stroke="#C45B3A" strokeWidth="1.75" strokeLinecap="round" />
                    <path d="M14 6C13.5 7.5 14.5 8.5 15 9.5" stroke="#C45B3A" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-display text-xl font-black text-[#141414]">
                  CHOP<span className="text-[#C45B3A]">.</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[#77736C] hover:text-[#191919] hover:bg-white transition-colors focus:outline-none"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* ── Location selector ── */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#E6E2DA] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736C] block">
                Your Area
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedLocation('ijebu-ode'); }}
                  className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    currentLocation === 'ijebu-ode'
                      ? 'bg-[#141414] text-white shadow-xs'
                      : 'bg-[#F7F6F2] text-[#191919] border border-[#E6E2DA] hover:bg-[#F0EEE8]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C45B3A]" aria-hidden="true" />
                  Ijebu Ode
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedLocation('ijagun'); }}
                  className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    currentLocation === 'ijagun'
                      ? 'bg-[#141414] text-white shadow-xs'
                      : 'bg-[#F7F6F2] text-[#191919] border border-[#E6E2DA] hover:bg-[#F0EEE8]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C45B3A]" aria-hidden="true" />
                  Ijagun
                </button>
              </div>
            </div>

            {/* ── Nav links ── */}
            <div className="space-y-0.5">
              {[
                { label: 'Discover', action: handleDiscover, accent: activeView === 'marketplace' },
                { label: 'Food Categories', action: handleCategories, accent: false },
                { label: 'How It Works', action: handleHowItWorks, accent: false },
                { label: 'For Vendors', action: handleForVendors, accent: activeView === 'for-vendors' },
              ].map(({ label, action, accent }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className={`w-full min-h-[48px] text-left px-4 rounded-xl text-sm flex items-center justify-between transition-colors ${
                    accent
                      ? 'font-semibold text-[#141414] bg-white'
                      : 'font-medium text-[#77736C] hover:bg-white hover:text-[#191919]'
                  }`}
                >
                  <span>{label}</span>
                  <ChevronRight className="w-4 h-4 opacity-40 shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>

            {/* ── Auth section ── */}
            <div className="border-t border-[#E6E2DA] pt-4 space-y-2">
              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="w-full min-h-[48px] rounded-xl bg-white border border-[#E6E2DA] text-[#191919] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F0EEE8] transition-all"
                  >
                    <LogIn className="w-4 h-4 text-[#77736C]" aria-hidden="true" />
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateAccount}
                    className="w-full min-h-[48px] rounded-xl bg-[#141414] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xs active:scale-[0.99]"
                  >
                    <UserPlus className="w-4 h-4" aria-hidden="true" />
                    Create Account
                  </button>
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E6E2DA] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E6E2DA]/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#141414] flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-black uppercase">
                        {currentUser?.fullName?.[0] || 'C'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#141414] truncate">
                        {currentUser?.fullName}
                      </p>
                      <p className="text-[11px] text-[#77736C] truncate">
                        {currentUser?.email || currentUser?.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full min-h-[44px] px-4 text-left text-sm font-medium text-[#77736C] hover:text-[#191919] hover:bg-[#F7F6F2] transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              )}

              {/* Cart shortcut (only when ordering is live) */}
              {hasVendors && isAuthenticated && (
                <button
                  type="button"
                  onClick={handleCartOpen}
                  className="w-full min-h-[44px] rounded-xl bg-white border border-[#E6E2DA] text-[#191919] text-sm font-medium flex items-center justify-between px-4 hover:bg-[#F0EEE8] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#77736C]" aria-hidden="true" />
                    Your Cart
                  </span>
                  {cartItemCount > 0 && (
                    <span className="text-xs font-semibold text-white bg-[#C45B3A] px-2 py-0.5 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
