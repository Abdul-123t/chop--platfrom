import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  MapPin,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';
import { CHOP_CONFIG } from '../config';
import { useReveal } from '../hooks/useReveal';
import { MobileCardAccent } from './MobileCardAccent';
import { RevealItem } from './RevealItem';
import { SafeImage } from './SafeImage';

interface ForVendorsProps {
  onApplyVendor: () => void;
}

const VENDOR_BENEFITS = [
  {
    icon: Eye,
    title: 'Get discovered',
    description: 'by people nearby',
    text: 'Get discovered by people nearby',
  },
  {
    icon: Sparkles,
    title: 'Look professional',
    description: 'online',
    text: 'Look professional online',
  },
  {
    icon: Users,
    title: 'Reach more customers',
    description: 'in Ijebu Ode',
    text: 'Reach more customers in Ijebu Ode',
  },
  {
    icon: Store,
    title: 'Be among the first',
    description: 'vendors on CHOP',
    text: 'Be among the first vendors on CHOP',
  },
];

const ELIGIBLE_BUSINESSES = [
  'Local bukas and traditional food vendors',
  'Restaurants and eateries',
  'Street-food businesses and grills',
  'Cafeterias and campus food vendors',
  'Shawarma, fast-food and pizza spots',
  'Bakeries and small-chop vendors',
  'Home-based food businesses',
  'Online food sellers and caterers',
];

export function ForVendors({ onApplyVendor }: ForVendorsProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="for-vendors-heading"
      className="relative py-20 lg:py-[120px] overflow-clip border-t border-white/[0.08] bg-gradient-to-br from-[#341307] via-[#1C110C] to-[#0E0D0B] text-[#F7F1E8]"
    >
      {/* Grain texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 film-grain opacity-75" />

      {/* Slow diagonal shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-0 w-[680px] h-[480px] rounded-full bg-gradient-to-r from-transparent via-[#E8772E]/14 to-transparent blur-3xl animate-diagonal-shimmer"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Pitch, Benefits, Who Can Apply & CTA */}
          <div className={`md:col-span-1 lg:col-span-7 space-y-8 ${isVisible ? 'is-visible' : ''}`}>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E] mb-3">
                For food businesses in Ijebu Ode
              </p>
              <h2
                id="for-vendors-heading"
                className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#F7F1E8]"
              >
                Get discovered by the people who are hungry right now.
              </h2>
            </div>

            {/* 4 Benefits */}
            <div className="mobile-card-deck grid grid-cols-1 gap-4 md:grid-cols-2">
              {VENDOR_BENEFITS.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <RevealItem
                    key={benefit.text}
                    delay={idx * 80}
                    stackIndex={idx}
                    className="mobile-deck-card hover-lift rounded-[24px] border border-white/[0.1] bg-white/[0.04] p-5 md:flex md:items-center md:gap-3.5 md:rounded-2xl md:px-4 md:py-3.5"
                  >
                    <MobileCardAccent icon={Icon} />
                    <p className="mobile-card-eyebrow">For vendors</p>
                    <div className="mb-2 md:hidden">
                      <h3 className="font-display text-lg font-bold text-[#F7F1E8]">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#CFC6B9]">
                        {benefit.description}
                      </p>
                    </div>
                    <div className="hidden md:flex w-9 h-9 rounded-full bg-[#E8772E]/20 text-[#E8772E] items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="hidden md:inline text-sm font-semibold text-[#F7F1E8]">
                      {benefit.text}
                    </span>
                  </RevealItem>
                );
              })}
            </div>

            {/* Who can apply */}
            <div>
              <h3 className="font-display text-lg font-bold text-[#F7F1E8] mb-3.5">
                Who can apply
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {ELIGIBLE_BUSINESSES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-[#CFC6B9]"
                  >
                    <Check
                      className="w-4 h-4 text-[#E8772E] mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="section-action-group">
              <button
                type="button"
                onClick={onApplyVendor}
                className="btn-primary-chop inline-flex items-center justify-center gap-2 rounded-full bg-[#E8772E] hover:bg-[#B9441A] active:scale-[0.98] text-[#0E0D0B] font-semibold text-base px-7 py-3.5 transition-all whitespace-nowrap cursor-pointer"
              >
                <span>Apply as a food business</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Column: Floating Abstract Vendor Listing Preview Card */}
          <div
            className={`md:col-span-1 lg:col-span-5 reveal-item ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: '120ms' }}
          >
            <div className="rounded-[24px] border border-white/[0.1] bg-gradient-to-b from-[#231D18]/95 to-[#14110E]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_60px_-20px_rgba(0,0,0,0.8)] p-6 sm:p-7 relative animate-float-vendor">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A89F92]">
                  Vendor Listing
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3FA66B]/18 px-3 py-1 text-[13px] font-semibold text-[#66C78F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
                  Sample
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#191612]">
                <div className="h-44 overflow-hidden">
                  <SafeImage
                    src={CHOP_CONFIG.images.productScreenshots.vendorCover}
                    alt="Sample vendor listing banner on CHOP in Ijebu Ode"
                    width={640}
                    height={360}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#F7F1E8]">
                        Sample vendor profile
                      </h3>
                      <p className="text-[15px] text-[#A89F92] mt-0.5">
                        Local Bukas &amp; Grills
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-[15px] text-[#A89F92] pt-3 border-t border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E8772E] shrink-0" aria-hidden="true" />
                      <span>Ijebu Ode, Ogun State</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#E8772E] shrink-0" aria-hidden="true" />
                      <span>Hours shared by vendors</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <div className="h-2.5 w-20 rounded bg-white/15 mb-2" />
                      <div className="text-[13px] font-semibold text-[#E8772E]">
                        Sample menu
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <div className="h-2.5 w-24 rounded bg-white/15 mb-2" />
                      <div className="text-[13px] font-semibold text-[#E8772E]">
                        Sample menu
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
