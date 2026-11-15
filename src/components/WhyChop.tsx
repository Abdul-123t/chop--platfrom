import { HeartHandshake, Search, Store } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { MobileCardAccent } from './MobileCardAccent';
import { RevealItem } from './RevealItem';

const PILLARS = [
  {
    title: 'For customers',
    icon: Search,
    glowClass: 'bg-[#E8772E]/20 -top-10 -left-10',
    copy: "Stop scrolling through scattered WhatsApp statuses and Instagram posts. Find what's near you in one place.",
  },
  {
    title: 'For food businesses',
    icon: Store,
    glowClass: 'bg-[#B9441A]/24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    copy: 'Get found by people nearby, not only by the people who already follow you.',
  },
  {
    title: 'For the community',
    icon: HeartHandshake,
    glowClass: 'bg-[#E8772E]/18 -bottom-10 -right-10',
    copy: 'One trusted, organised home for the food that makes Ijebu Ode what it is.',
  },
];

export function WhyChop() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="why-chop-heading"
      className="relative py-20 lg:py-[120px] overflow-clip border-t border-[#0E0D0B]/8 dark:border-white/[0.06] bg-[#EFE7DA] dark:bg-[#0E0D0B]"
    >
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className={`max-w-2xl mb-12 lg:mb-14 ${isVisible ? 'is-visible' : ''}`}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E] mb-3">
            Why CHOP
          </p>
          <h2
            id="why-chop-heading"
            className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B] dark:text-[#F7F1E8]"
          >
            Food discovery in Ijebu Ode, finally organised.
          </h2>
        </div>

        <div className="mobile-card-deck grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <RevealItem
                key={pillar.title}
                delay={idx * 80}
                stackIndex={idx}
                className="mobile-deck-card relative"
              >
                {/* Distinct per-card soft orange or ember glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute w-56 h-56 rounded-full blur-[65px] ${pillar.glowClass}`}
                />

                <article className="relative h-full chop-card chop-card-interactive p-5 md:p-8 flex flex-col justify-between">
                  <MobileCardAccent icon={Icon} />
                  <p className="mobile-card-eyebrow">Why CHOP</p>
                  <div>
                    <div className="hidden md:flex w-11 h-11 rounded-full bg-[#E8772E]/12 border border-[#E8772E]/25 items-center justify-center text-[#E8772E] mb-6">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-[#0E0D0B] dark:text-[#F7F1E8]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-[#574F45] dark:text-[#A89F92] leading-relaxed">
                      {pillar.copy}
                    </p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
