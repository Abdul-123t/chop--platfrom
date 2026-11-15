import { useEffect, useState } from 'react';
import { Clock, Lock, MapPin, ShoppingBag } from 'lucide-react';
import { CHOP_CONFIG } from '../config';
import { useReveal } from '../hooks/useReveal';
import { RevealItem } from './RevealItem';
import { SafeImage } from './SafeImage';

const FILTER_SAMPLES: Record<string, { name: string; area: string; note: string }[]> = {
  Bukas: [
    { name: 'Mama Tolu Buka', area: 'Ita-Osu, Ijebu Ode', note: 'Amala, Ewedu & Gbegiri' },
    { name: 'Ijebu Heritage Kitchen', area: 'Sabo, Ijebu Ode', note: 'Ofada & Ikokore' },
  ],
  Grills: [
    { name: 'Oba Suya Point', area: 'Folagbade, Ijebu Ode', note: 'Beef Suya & Masa' },
    { name: 'Boli & Fish Corner', area: 'Oke-Aje, Ijebu Ode', note: 'Charred Plantain & Croaker' },
  ],
  Shawarma: [
    { name: 'WrapHouse Ijebu', area: 'Ibadan Road, Ijebu Ode', note: 'Double Chicken Shawarma' },
    { name: 'Flame & Roll', area: 'Bonojo, Ijebu Ode', note: 'Spicy Beef Wraps' },
  ],
  Bakeries: [
    { name: 'Bonojo Warm Crust', area: 'Bonojo, Ijebu Ode', note: 'Butter Bread & Meat Pie' },
    { name: 'Morning Loaf Bakery', area: 'Oyingbo, Ijebu Ode', note: 'Pastries & Cakes' },
  ],
  Pizza: [
    { name: 'Ijebu Stone Oven', area: 'GRA, Ijebu Ode', note: 'Suya & Pepperoni Boxes' },
    { name: 'Slice & Share', area: 'New Market Road', note: 'Fresh Baked Crusts' },
  ],
  Campus: [
    { name: 'Ijagun Meal Hub', area: 'Near Ijebu Ode, Ijagun (TASUED)', note: 'Rice Bowls & Quick Packs' },
    { name: 'Folagbade Student Pot', area: 'Ijebu Ode', note: 'Daily Lunch Specials' },
  ],
};

const FILTER_KEYS = Object.keys(FILTER_SAMPLES);

export function ProductPreview() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const [selectedFilter, setSelectedFilter] = useState<string>('Bukas');
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = 0;
    const updateParallax = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportMid = window.innerHeight / 2;
      const sectionMid = rect.top + rect.height / 2;
      const delta = (sectionMid - viewportMid) * 0.035;
      setParallaxOffset(Math.max(-14, Math.min(14, delta)));
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        updateParallax();
        rafId = 0;
      });
    };

    updateParallax();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [ref]);

  return (
    <section
      ref={ref}
      aria-labelledby="preview-heading"
      className="relative py-20 lg:py-[120px] overflow-hidden border-t border-[#0E0D0B]/8 dark:border-white/[0.06] bg-gradient-to-br from-[#F3ECE1] via-[#EFE6D8] to-[#E8772E]/10 dark:from-[#0E0D0B] dark:via-[#14100D] dark:to-[#B9441A]/15"
    >
      {/* Slowly drifting horizontal light streak */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-0 w-[680px] h-40 rounded-full bg-gradient-to-r from-transparent via-[#E8772E]/14 to-transparent blur-3xl animate-light-streak"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div
          className={`max-w-2xl mb-12 lg:mb-14 ${isVisible ? 'is-visible' : ''}`}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E] mb-3">
            Product preview
          </p>
          <h2
            id="preview-heading"
            className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B] dark:text-[#F7F1E8]"
          >
            See what&apos;s coming in Ijebu Ode and Ijagun (TASUED).
          </h2>
        </div>

        {/* 4-up Desktop Grid / Horizontal Snap Scroll on Mobile */}
        <div className="product-preview-strip flex items-stretch gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 md:overflow-visible md:snap-none md:pb-0 md:gap-5">
          {/* Card 1: Discovery feed (slides from left, subtle parallax) */}
          <RevealItem delay={0} className="product-preview-item snap-start shrink-0">
            <article
              className="product-preview-card chop-card chop-card-interactive flex h-full flex-col justify-between p-5 transition-transform duration-700"
              style={{
                transform: isVisible ? `translateY(${parallaxOffset * -0.5}px)` : undefined,
              }}
            >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="product-preview-ui-title font-display text-[#0E0D0B] dark:text-[#F7F1E8]">
                  Ijebu Ode
                </span>
                <span className="product-preview-sample">
                  Sample
                </span>
                <span className="sr-only inline-flex items-center gap-1 text-[11px] font-semibold text-[#3FA66B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
                  Preview
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-4 overflow-hidden">
                <span className="product-preview-chip px-2.5 py-1 rounded-full bg-[#E8772E] text-[#0E0D0B] font-semibold">
                  All
                </span>
                <span className="product-preview-chip px-2.5 py-1 rounded-full bg-[#0E0D0B]/6 dark:bg-white/[0.06] text-[#574F45] dark:text-[#A89F92]">
                  Bukas
                </span>
                <span className="product-preview-chip px-2.5 py-1 rounded-full bg-[#0E0D0B]/6 dark:bg-white/[0.06] text-[#574F45] dark:text-[#A89F92]">
                  Grills
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { title: 'Iya Kudi Amala', tag: 'Local Bukas · Oke-Aje' },
                  { title: 'Folagbade Suya Hub', tag: 'Street Food · Folagbade' },
                  { title: 'Tastee Crust Bakery', tag: 'Bakeries · Sabo' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#0E0D0B]/8 dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.03] p-3"
                  >
                    <p className="product-preview-ui-title product-preview-vendor-name text-[#0E0D0B] dark:text-[#F7F1E8]">
                      {item.title}
                    </p>
                    <p className="product-preview-meta text-[#574F45] dark:text-[#A89F92] mt-0.5">
                      {item.tag}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="product-preview-meta mt-5 pt-4 border-t border-[#0E0D0B]/8 dark:border-white/[0.08] text-[#574F45] dark:text-[#A89F92]">
              <strong className="text-[#0E0D0B] dark:text-[#F7F1E8]">Discovery feed:</strong>{' '}
              Browse active kitchens around Ijebu Ode in one place.
            </p>
            </article>
          </RevealItem>

          {/* Card 2: Vendor profile (slides from right, opposite subtle parallax) */}
          <RevealItem delay={80} className="product-preview-item snap-start shrink-0">
            <article
              className="product-preview-card chop-card chop-card-interactive flex h-full flex-col justify-between p-5 transition-transform duration-700"
              style={{
                transform: isVisible ? `translateY(${parallaxOffset * 0.5}px)` : undefined,
              }}
            >
            <div>
              <div className="h-28 rounded-2xl overflow-hidden border border-[#0E0D0B]/8 dark:border-white/[0.08] mb-3.5">
                <SafeImage
                  src={CHOP_CONFIG.images.productScreenshots.vendorCover}
                  alt="Vendor profile cover image preview in Ijebu Ode"
                  width={400}
                  height={225}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <h3 className="product-preview-ui-title product-preview-vendor-name min-w-0 font-display text-[#0E0D0B] dark:text-[#F7F1E8]">
                  Sample vendor profile
                </h3>
                <span className="product-preview-sample">Sample</span>
              </div>

              <p className="product-preview-meta text-[#574F45] dark:text-[#A89F92] mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E8772E]" aria-hidden="true" />
                Restaurants · Bonojo, Ijebu Ode
              </p>
              <p className="product-preview-meta text-[#574F45] dark:text-[#A89F92] mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E8772E]" aria-hidden="true" />
                Hours shared by vendors
              </p>

              <div className="product-preview-meta mt-3 pt-3 border-t border-[#0E0D0B]/8 dark:border-white/[0.08] text-[#574F45] dark:text-[#A89F92]">
                Menu details and prices shared by vendors.
              </div>
            </div>

            <p className="product-preview-meta mt-5 pt-4 border-t border-[#0E0D0B]/8 dark:border-white/[0.08] text-[#574F45] dark:text-[#A89F92]">
              <strong className="text-[#0E0D0B] dark:text-[#F7F1E8]">Vendor profile:</strong>{' '}
              Hours, location in Ijebu Ode, and full dish prices upfront.
            </p>
            </article>
          </RevealItem>

          {/* Card 3: Interactive Category Filters */}
          <RevealItem delay={160} className="product-preview-item snap-start shrink-0">
            <article
              className="product-preview-card chop-card chop-card-interactive flex h-full flex-col justify-between p-5 transition-transform duration-700"
              style={{
                transform: isVisible ? `translateY(${parallaxOffset * -0.5}px)` : undefined,
              }}
            >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="product-preview-ui-title text-[#0E0D0B] dark:text-[#F7F1E8]">
                  Filter by craving
                </p>
                <span className="product-preview-sample">Sample</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {FILTER_KEYS.map((key) => {
                  const active = selectedFilter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedFilter(key)}
                      className={`product-preview-chip px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#E8772E] text-[#0E0D0B]'
                          : 'bg-[#0E0D0B]/6 dark:bg-white/[0.06] text-[#574F45] dark:text-[#A89F92] hover:text-[#0E0D0B] dark:hover:text-[#F7F1E8]'
                      }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2.5">
                {FILTER_SAMPLES[selectedFilter]?.map((sample) => (
                  <div
                    key={sample.name}
                    className="rounded-2xl border border-[#0E0D0B]/8 dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.03] p-3 animate-[fadeIn_240ms_ease-out]"
                  >
                    <p className="product-preview-ui-title product-preview-vendor-name text-[#0E0D0B] dark:text-[#F7F1E8]">
                      {sample.name}
                    </p>
                    <p className="product-preview-meta text-[#E8772E] mt-0.5">{sample.note}</p>
                    <p className="product-preview-meta text-[#574F45] dark:text-[#A89F92] mt-0.5">
                      {sample.area}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="product-preview-meta mt-5 pt-4 border-t border-[#0E0D0B]/8 dark:border-white/[0.08] text-[#574F45] dark:text-[#A89F92]">
              <strong className="text-[#0E0D0B] dark:text-[#F7F1E8]">Category filters:</strong>{' '}
              Tap any category above to jump straight to what you crave.
            </p>
            </article>
          </RevealItem>

          {/* Card 4: Ordering screen (Coming soon) */}
          <RevealItem delay={240} className="product-preview-item snap-start shrink-0">
            <article
              className="product-preview-card chop-card chop-card-interactive flex h-full flex-col justify-between p-5 transition-transform duration-700"
              style={{
                transform: isVisible ? `translateY(${parallaxOffset * 0.5}px)` : undefined,
              }}
            >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="product-preview-ui-title inline-flex items-center gap-1.5 text-[#0E0D0B] dark:text-[#F7F1E8]">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E8772E]" aria-hidden="true" />
                  Your Order
                </span>
                <span className="product-preview-sample">
                  Sample
                </span>
                <span className="sr-only inline-flex items-center gap-1 rounded-full bg-[#3FA66B]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#3FA66B]">
                  Coming soon
                </span>
              </div>

              <div className="rounded-xl bg-[#3FA66B]/10 border border-[#3FA66B]/25 p-2.5 mb-3">
                <p className="product-preview-meta font-medium text-[#2A7D4D] dark:text-[#66C78F]">
                  Direct ordering opens after our Ijebu Ode discovery launch.
                </p>
              </div>

              <div className="product-preview-meta rounded-xl border border-[#0E0D0B]/8 dark:border-white/[0.08] p-3 text-[#574F45] dark:text-[#A89F92]">
                Checkout will be available after launch.
              </div>

              <button
                type="button"
                disabled
                aria-disabled="true"
                className="mt-4 w-full rounded-full bg-[#0E0D0B]/10 dark:bg-white/[0.08] text-[#574F45] dark:text-[#A89F92] font-semibold text-xs py-2.5 px-4 inline-flex items-center justify-center gap-1.5 cursor-not-allowed opacity-70"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Checkout (Coming soon)</span>
              </button>
            </div>

            <p className="product-preview-meta mt-5 pt-4 border-t border-[#0E0D0B]/8 dark:border-white/[0.08] text-[#574F45] dark:text-[#A89F92]">
              <strong className="text-[#0E0D0B] dark:text-[#F7F1E8]">Ordering screen:</strong>{' '}
              Simple checkout built for Ijebu Ode, launching next.
            </p>
            </article>
          </RevealItem>
        </div>
        <p className="product-preview-swipe-hint" aria-hidden="true">
          Swipe to explore
        </p>
      </div>
    </section>
  );
}
