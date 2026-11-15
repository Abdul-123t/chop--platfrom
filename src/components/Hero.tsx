import { useEffect, useRef, useState } from 'react';
import { ArrowRight, MapPin, Search, Utensils } from 'lucide-react';
import { CHOP_CONFIG } from '../config';
import { SafeImage } from './SafeImage';

interface HeroProps {
  onJoinCustomer: () => void;
  onJoinVendor: () => void;
}

type ScreenKey = 'feed' | 'map' | 'vendor';

const SCREENS: { key: ScreenKey; label: string }[] = [
  { key: 'feed', label: 'Feed' },
  { key: 'map', label: 'Map' },
  { key: 'vendor', label: 'Menu' },
];

const HEADLINE_WORDS: { text: string; accent?: boolean }[] = [
  { text: 'Every' },
  { text: 'food' },
  { text: 'spot.' },
  { text: 'Every', accent: true },
  { text: 'craving.', accent: true },
  { text: 'One' },
  { text: 'place.' },
];

export function Hero({ onJoinCustomer, onJoinVendor }: HeroProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('feed');
  const [isPaused, setIsPaused] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(() => !document.hidden);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || isPaused || !isPhoneVisible || !isTabVisible) return;

    const timer = window.setInterval(() => {
      setActiveScreen((prev) => {
        if (prev === 'feed') return 'map';
        if (prev === 'map') return 'vendor';
        return 'feed';
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, [isPaused, isPhoneVisible, isTabVisible]);

  useEffect(() => {
    const node = phoneRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsPhoneVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  const heroCards = CHOP_CONFIG.images.heroCards;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="critical-hero relative pt-[88px] pb-16 md:pt-28 md:pb-24 lg:pt-36 lg:pb-[120px] overflow-hidden bg-[#F7F1E8] dark:bg-[#0E0D0B]"
    >
      {/* Faint perspective grid fading toward bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[540px] perspective-grid opacity-70"
      />

      {/* Slow-moving warm orange radial glow behind phone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-[2%] w-[520px] h-[520px] rounded-full bg-[#E8772E]/18 blur-[125px] animate-slow-glow"
      />

      {/* Subtle SVG film-grain overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 film-grain opacity-70" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Staggered Intro Sequence */}
          <div className="lg:col-span-6 space-y-7">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center rounded-full border border-[#0E0D0B]/12 dark:border-white/12 bg-white/75 dark:bg-[#191612]/90 px-4 py-1.5 animate-[fadeIn_450ms_ease-out_both]">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0E0D0B] dark:text-[#F7F1E8]">
                Launching soon in Ijebu Ode and Ijagun (TASUED)
              </span>
            </div>

            {/* Word-by-word masked headline reveal (60ms stagger) */}
            <h1
              id="hero-heading"
              className="critical-hero-heading font-display font-extrabold text-[clamp(38px,7vw,80px)] leading-[1.05] text-[#0E0D0B] dark:text-[#F7F1E8]"
            >
              {HEADLINE_WORDS.map((word, index) => (
                <span
                  key={`${word.text}-${index}`}
                  className="inline-block overflow-hidden align-bottom mr-[0.22em] pb-[0.06em]"
                >
                  <span
                    className={`inline-block animate-[wordRevealUp_620ms_cubic-bezier(0.16,1,0.3,1)_both] ${
                      word.accent ? 'text-[#E8772E]' : ''
                    }`}
                    style={{ animationDelay: `${90 + index * 60}ms` }}
                  >
                    {word.text}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="hero-copy text-[17px] sm:text-lg text-[#574F45] dark:text-[#A89F92] max-w-xl leading-relaxed animate-[fadeIn_550ms_ease-out_both]"
              style={{ animationDelay: '360ms' }}
            >
              Discover the best bukas, grills, bakeries, shawarma spots and home kitchens around{' '}
              <strong className="font-semibold text-[#0E0D0B] dark:text-[#F7F1E8]">
                Ijebu Ode
              </strong>
              . Be first in line when CHOP goes live in Ijebu Ode, with Ijagun (TASUED) next.
            </p>

            <div
              className="hero-action-group flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1 animate-[fadeIn_550ms_ease-out_both]"
              style={{ animationDelay: '460ms' }}
            >
              <button
                type="button"
                onClick={onJoinCustomer}
                className="btn-primary-chop inline-flex items-center justify-center gap-2 rounded-full bg-[#E8772E] hover:bg-[#B9441A] active:scale-[0.98] text-[#0E0D0B] font-semibold text-base px-7 py-3.5 transition-all whitespace-nowrap cursor-pointer"
              >
                <span>Join the waitlist</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onJoinVendor}
                className="hero-cta inline-flex items-center justify-center rounded-full border border-[#0E0D0B]/20 dark:border-white/20 hover:border-[#E8772E] dark:hover:border-[#E8772E] text-[#0E0D0B] dark:text-[#F7F1E8] active:scale-[0.98] font-semibold text-base px-7 py-3.5 transition-all whitespace-nowrap cursor-pointer"
              >
                Register your food business
              </button>
            </div>
          </div>

          {/* Right Column: CSS iPhone Preview + Slow-Drifting Food Photo Cards */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            {/* Floating Food Card 1 (Top Left on desktop) */}
            {heroCards[0] && (
              <div className="hidden xl:block absolute -left-8 top-6 z-20 w-44 rounded-2xl border border-[#0E0D0B]/10 dark:border-white/10 bg-[#F7F1E8] dark:bg-[#171411] p-2 shadow-xl animate-float-a">
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <SafeImage
                    src={heroCards[0].src}
                    alt={heroCards[0].alt}
                    width={320}
                    height={240}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-2 px-1">
                  <p className="text-xs font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] truncate">
                    {heroCards[0].caption}
                  </p>
                  <p className="text-[11px] text-[#574F45] dark:text-[#A89F92]">
                    {heroCards[0].tag}
                  </p>
                </div>
              </div>
            )}

            {/* Floating Food Card 2 (Bottom Right on desktop) */}
            {heroCards[1] && (
              <div className="hidden xl:block absolute -right-4 bottom-10 z-20 w-44 rounded-2xl border border-[#0E0D0B]/10 dark:border-white/10 bg-[#F7F1E8] dark:bg-[#171411] p-2 shadow-xl animate-float-b">
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <SafeImage
                    src={heroCards[1].src}
                    alt={heroCards[1].alt}
                    width={320}
                    height={240}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-2 px-1">
                  <p className="text-xs font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] truncate">
                    {heroCards[1].caption}
                  </p>
                  <p className="text-[11px] text-[#574F45] dark:text-[#A89F92]">
                    {heroCards[1].tag}
                  </p>
                </div>
              </div>
            )}

            {/* Floating Food Card 3 (Top Right on desktop) */}
            {heroCards[2] && (
              <div className="hidden md:block xl:block absolute right-0 sm:right-2 lg:-right-2 top-16 z-10 w-36 rounded-2xl border border-[#0E0D0B]/10 dark:border-white/10 bg-[#F7F1E8] dark:bg-[#171411] p-1.5 shadow-lg animate-float-c">
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <SafeImage
                    src={heroCards[2].src}
                    alt={heroCards[2].alt}
                    width={280}
                    height={210}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="pt-1.5 px-1 text-[11px] font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] truncate">
                  {heroCards[2].caption}
                </p>
              </div>
            )}

            {/* CSS iPhone-Style Preview Frame (rises in with tilt settling flat) */}
            <div
              ref={phoneRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="hero-phone-mockup relative z-10 overflow-hidden rounded-[44px] border-[8px] border-[#221E1A] bg-[#12100D] text-[#F7F1E8] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] animate-[phoneTiltSettle_820ms_cubic-bezier(0.16,1,0.3,1)_260ms_both]"
            >
              {/* Phone Notch / Dynamic Island */}
              <div className="pt-3 pb-2 px-5 flex items-center justify-between bg-[#12100D]">
                <span className="text-[11px] font-semibold text-[#A89F92]">
                  CHOP
                </span>
                <div className="w-20 h-5 rounded-full bg-[#070605] border border-white/[0.06]" />
                <span aria-hidden="true" className="w-[45px]" />
              </div>

              {/* Screen Tabs */}
              <div className="px-4 pb-2.5 flex items-center gap-1.5 bg-[#12100D]">
                {SCREENS.map((tab) => {
                  const active = activeScreen === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveScreen(tab.key)}
                      className={`flex-1 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#E8772E] text-[#0E0D0B]'
                          : 'bg-white/[0.06] text-[#A89F92] hover:text-[#F7F1E8]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Phone Viewport */}
              <div className="hero-phone-screen bg-[#161310] px-4 py-3 flex flex-col justify-between border-t border-white/[0.06]">
                {activeScreen === 'feed' && (
                  <div className="space-y-3.5 animate-[fadeIn_350ms_ease-out]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#A89F92]">Discovery</p>
                        <p className="font-display text-base font-bold text-[#F7F1E8]">
                          Near you in Ijebu Ode
                        </p>
                      </div>
                      <MapPin className="w-4 h-4 text-[#E8772E]" aria-hidden="true" />
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.07] px-3 py-2 text-xs text-[#A89F92]">
                      <Search className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Search amala, suya, bread...</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-hidden text-[11px]">
                      <span className="px-2.5 py-1 rounded-full bg-[#E8772E] text-[#0E0D0B] font-semibold">
                        All
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[#A89F92]">
                        Bukas
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[#A89F92]">
                        Grills
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[#A89F92]">
                        Bakeries
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        {
                          name: 'Iya Basira Amala Spot',
                          meta: 'Local Bukas · Sabo, Ijebu Ode',
                        },
                        {
                          name: 'Folagbade Smoke & Suya',
                          meta: 'Street Food & Grills · Folagbade',
                        },
                        {
                          name: 'Bonojo Warm Crust Bakery',
                          meta: 'Bakeries · Bonojo, Ijebu Ode',
                        },
                      ].map((spot, idx) => (
                        <div
                          key={spot.name}
                          className="rounded-2xl bg-[#1E1A16] border border-white/[0.07] p-3 animate-[fadeIn_400ms_ease-out_both]"
                          style={{ animationDelay: `${idx * 90}ms` }}
                        >
                          <p className="text-xs font-semibold text-[#F7F1E8]">{spot.name}</p>
                          <p className="text-[11px] text-[#A89F92] mt-0.5">{spot.meta}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeScreen === 'map' && (
                  <div className="h-full flex flex-col justify-between animate-[fadeIn_350ms_ease-out]">
                    <div>
                      <p className="text-[11px] text-[#A89F92]">Explore nearby</p>
                      <p className="font-display text-base font-bold text-[#F7F1E8]">
                        Ijebu Ode Food Map
                      </p>
                    </div>

                    <div className="relative flex-1 my-3 rounded-2xl bg-[#1E1A16] border border-white/[0.08] overflow-hidden p-3">
                      <svg
                        viewBox="0 0 240 240"
                        className="w-full h-full"
                        aria-label="Stylised map preview centered on Ijebu Ode"
                      >
                        <path
                          d="M20 70 Q120 45 220 90 M30 160 Q130 130 220 175 M110 20 L130 220"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="4"
                          fill="none"
                        />
                        {/* Pulsing ring around Ijebu Ode centre pin */}
                        <circle
                          cx="122"
                          cy="112"
                          r="26"
                          fill="rgba(232,119,46,0.22)"
                          className="animate-pin-ring"
                        />
                        <circle cx="122" cy="112" r="34" fill="rgba(232,119,46,0.12)" />
                        <g className="animate-[pinDrop_500ms_cubic-bezier(0.16,1,0.3,1)_both]">
                          <circle cx="122" cy="112" r="8.5" fill="#E8772E" />
                          <text
                            x="122"
                            y="138"
                            textAnchor="middle"
                            fill="#F7F1E8"
                            fontSize="13"
                            fontWeight="700"
                          >
                            Ijebu Ode
                          </text>
                        </g>

                        {[
                          { cx: 62, cy: 76, label: 'Sabo', delay: '120ms', ly: 65, color: '#F7F1E8' },
                          { cx: 176, cy: 84, label: 'Oke-Aje', delay: '200ms', ly: 73, color: '#F7F1E8' },
                          { cx: 72, cy: 168, label: 'Folagbade', delay: '280ms', ly: 184, color: '#F7F1E8' },
                          { cx: 184, cy: 186, label: 'Ijagun (TASUED)', delay: '360ms', ly: 201, color: '#3FA66B' },
                        ].map((pin) => (
                          <g
                            key={pin.label}
                            className="animate-[pinDrop_450ms_cubic-bezier(0.16,1,0.3,1)_both]"
                            style={{ animationDelay: pin.delay }}
                          >
                            <circle cx={pin.cx} cy={pin.cy} r="5" fill={pin.color} />
                            <text
                              x={pin.cx}
                              y={pin.ly}
                              textAnchor="middle"
                              fill="#A89F92"
                              fontSize="8.5"
                            >
                              {pin.label}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>

                    <div className="rounded-xl bg-[#1E1A16] border border-white/[0.08] px-3 py-2.5 flex items-center justify-between text-xs">
                      <span className="text-[#F7F1E8] font-medium">Ijebu Ode Central</span>
                      <span className="text-[#E8772E] font-semibold">Launch hub</span>
                    </div>
                  </div>
                )}

                {activeScreen === 'vendor' && (
                  <div className="space-y-3 animate-[fadeIn_350ms_ease-out]">
                    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#1E1A16]">
                      <div className="h-24 w-full overflow-hidden">
                        <SafeImage
                          src={CHOP_CONFIG.images.productScreenshots.vendorCover}
                          alt="Sample food vendor kitchen preview"
                          width={320}
                          height={160}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-display text-sm font-bold text-[#F7F1E8] truncate">
                            Sample vendor profile
                          </p>
                          <span className="text-[10px] font-semibold text-[#3FA66B] shrink-0">
                            Sample
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A89F92] mt-0.5">
                          Restaurants · Ijebu Ode
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#A89F92] mt-1.5">
                          <span>Hours shared by vendors</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A89F92]">
                        Sample menu
                      </p>
                      {[
                        'Smoky Jollof & Grilled Chicken',
                        'Ofada Rice & Ayamase Sauce',
                        'Peppered Beef Suya Pack',
                      ].map((item, idx) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-xl bg-[#1E1A16] border border-white/[0.06] px-3 py-2 text-xs animate-[fadeIn_350ms_ease-out_both]"
                          style={{ animationDelay: `${idx * 80}ms` }}
                        >
                          <span className="text-[#F7F1E8] truncate pr-2">{item}</span>
                          <span className="font-semibold text-[#E8772E] shrink-0">
                            Sample
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Phone Home Indicator */}
                <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-[10px] text-[#A89F92]">
                  <span className="inline-flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-[#E8772E]" aria-hidden="true" />
                    CHOP Preview
                  </span>
                  <span>Ijebu Ode</span>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Food Photo Strip below the phone */}
            <div className="hero-photo-strip grid grid-cols-3 gap-2.5 mt-6 w-full max-w-[380px] xl:hidden">
              {heroCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-[#0E0D0B]/10 dark:border-white/10 bg-[#F7F1E8] dark:bg-[#171411] p-1.5"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden">
                    <SafeImage
                      src={card.src}
                      alt={card.alt}
                      width={240}
                      height={180}
                      loading={card.id === 'jollof' ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="pt-1 text-[10px] font-semibold text-[#0E0D0B] dark:text-[#F7F1E8] truncate">
                    {card.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
