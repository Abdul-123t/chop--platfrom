import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { CHOP_CONFIG } from '../config';
import { observeRevealTarget } from '../hooks/useReveal';
import { ThemeMode } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onJoinWaitlist: () => void;
}

const NAV_LINKS = [
  { id: 'how-it-works', label: 'How it works', href: '#how-it-works' },
  { id: 'for-vendors', label: 'For vendors', href: '#for-vendors' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

export function Navbar({ theme, onToggleTheme, onJoinWaitlist }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [iconRotation, setIconRotation] = useState(0);
  const lastScrollY = useRef(0);

  // Scroll state: blurred backdrop after 40px + hide on scroll down / show on scroll up
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);

      if (mobileOpen || currentY <= 90) {
        setHidden(false);
      } else if (currentY > lastScrollY.current + 6) {
        setHidden(true);
      } else if (currentY < lastScrollY.current - 6) {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  // Highlight active sections with the shared page observer.
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const unsubscribe = elements.map((element) =>
      observeRevealTarget(element, () => setActiveSection(element.id), false)
    );
    return () => unsubscribe.forEach((stopObserving) => stopObserving());
  }, []);

  // Lock body scroll & close on Escape when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const scrollToHref = (href: string) => {
    const id = href.replace('#', '');
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navbarOffset = 92;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarOffset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  const handleThemeClick = () => {
    setIconRotation((prev) => prev + 180);
    onToggleTheme();
  };

  const handleMobileNavClick = (href: string) => {
    setMobileOpen(false);
    window.setTimeout(() => scrollToHref(href), 40);
  };

  return (
    <>
      <header
        className={`safe-area-header fixed top-0 inset-x-0 z-50 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out ${
          hidden ? '-translate-y-full duration-[250ms]' : 'translate-y-0 duration-[250ms]'
        } ${
          scrolled
            ? 'bg-[#F7F1E8]/90 dark:bg-[#0E0D0B]/90 backdrop-blur-xl border-b border-[#0E0D0B]/10 dark:border-white/[0.08] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)]'
            : 'bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-0 sm:gap-8">
          {/* Left: Wordmark + orange dot + "Ijebu Ode" pill */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                });
              }}
              className="inline-flex items-center gap-2 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#0E0D0B] dark:text-[#F7F1E8] whitespace-nowrap shrink-0 rounded-md"
              aria-label={`${CHOP_CONFIG.brandName} home`}
            >
              {CHOP_CONFIG.logoUrl ? (
                <img
                  src={CHOP_CONFIG.logoUrl}
                  alt={CHOP_CONFIG.brandName}
                  width={96}
                  height={32}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-7 w-auto object-contain"
                />
              ) : (
                <>
                  <span>{CHOP_CONFIG.brandName}</span>
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full bg-[#E8772E] translate-y-[-1px]"
                    aria-hidden="true"
                  />
                </>
              )}
            </a>

            <span className="navbar-location-pill inline-flex items-center rounded-full border border-[#0E0D0B]/12 dark:border-white/12 bg-[#0E0D0B]/[0.05] dark:bg-white/[0.06] px-2 py-0.5 text-[15px] font-semibold text-[#574F45] dark:text-[#A89F92] whitespace-nowrap">
              {CHOP_CONFIG.launchCity}
            </span>
          </div>

          {/* Centre: Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#574F45] dark:text-[#A89F92]"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  data-active={isActive}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHref(link.href);
                  }}
                  className={`chop-nav-link whitespace-nowrap shrink-0 py-1 transition-colors ${
                    isActive
                      ? 'text-[#0E0D0B] dark:text-[#F7F1E8] font-semibold'
                      : 'hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Theme Toggle + Primary CTA + Mobile Hamburger */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleThemeClick}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="w-10 h-10 rounded-full inline-flex items-center justify-center border border-[#0E0D0B]/14 dark:border-white/14 text-[#0E0D0B] dark:text-[#F7F1E8] hover:border-[#E8772E] transition-colors shrink-0 cursor-pointer"
            >
              <span
                className="chop-theme-icon inline-flex items-center justify-center"
                style={{ transform: `rotate(${iconRotation}deg)` }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4" aria-hidden="true" />
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={onJoinWaitlist}
              className="hidden md:inline-flex items-center justify-center rounded-full chop-nav-cta bg-[#E8772E] hover:bg-[#B9441A] active:scale-[0.98] text-[#0E0D0B] font-semibold text-base px-5 py-2.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Join the waitlist
            </button>

            {/* Hamburger morphing to X */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="md:hidden relative z-[70] w-11 h-11 rounded-full inline-flex flex-col items-center justify-center border border-[#0E0D0B]/15 dark:border-white/15 text-[#0E0D0B] dark:text-[#F7F1E8] cursor-pointer"
            >
              <span
                aria-hidden="true"
                className={`block w-5 h-0.5 rounded-full bg-current transition-transform duration-300 ${
                  mobileOpen ? 'translate-y-[3px] rotate-45' : '-translate-y-1'
                }`}
              />
              <span
                aria-hidden="true"
                className={`block w-5 h-0.5 rounded-full bg-current transition-opacity duration-200 ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                aria-hidden="true"
                className={`block w-5 h-0.5 rounded-full bg-current transition-transform duration-300 ${
                  mobileOpen ? '-translate-y-[3px] -rotate-45' : 'translate-y-1'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="md:hidden fixed inset-0 z-[60] bg-[#F7F1E8] dark:bg-[#0E0D0B] chop-mobile-overlay flex flex-col justify-between p-5 pt-[calc(64px+env(safe-area-inset-top)+16px)] pb-[calc(20px+env(safe-area-inset-bottom))] sm:p-6 sm:pt-[calc(64px+env(safe-area-inset-top)+24px)] sm:pb-[calc(24px+env(safe-area-inset-bottom))] overflow-y-auto"
        >
          {/* Soft radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#E8772E]/18 blur-[110px]"
          />

          <nav aria-label="Mobile menu links" className="relative flex flex-col gap-3 my-auto">
            {NAV_LINKS.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleMobileNavClick(link.href);
                }}
                style={{ animationDelay: `${idx * 80}ms` }}
                className="chop-mobile-link min-h-12 inline-flex items-center font-display text-4xl font-bold text-[#0E0D0B] dark:text-[#F7F1E8] hover:text-[#E8772E] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className="relative space-y-4 pt-6 border-t border-[#0E0D0B]/10 dark:border-white/[0.08] chop-mobile-link"
            style={{ animationDelay: `${NAV_LINKS.length * 80}ms` }}
          >
            <p className="text-[15px] text-[#574F45] dark:text-[#A89F92] leading-relaxed">
              {CHOP_CONFIG.brand.mission}
            </p>
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E]">
              Launching soon in Ijebu Ode and Ijagun (TASUED)
            </p>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                window.setTimeout(onJoinWaitlist, 40);
              }}
              className="w-full rounded-full chop-nav-cta bg-[#E8772E] hover:bg-[#B9441A] active:scale-[0.98] text-[#0E0D0B] font-semibold text-base py-4 px-6 transition-all cursor-pointer"
            >
              Join the waitlist
            </button>
          </div>
        </div>
      )}
    </>
  );
}
