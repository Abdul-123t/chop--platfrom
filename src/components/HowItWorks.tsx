import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { RevealItem } from './RevealItem';

const STEPS = [
  {
    targetNum: 1,
    title: "Discover what's around you in Ijebu Ode.",
    description:
      'See nearby bukas, grills, bakeries, shawarma spots, and home kitchens in one organised feed.',
    comingSoon: false,
  },
  {
    targetNum: 2,
    title: 'Explore food businesses and their menus.',
    description:
      'Check opening hours, neighbourhoods, dishes, and prices without hunting through old status updates.',
    comingSoon: false,
  },
  {
    targetNum: 3,
    title: 'Order directly from your favourite spots.',
    description:
      'Direct ordering and delivery checkout open next, right after our Ijebu Ode discovery rollout.',
    comingSoon: true,
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const [counts, setCounts] = useState<number[]>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return [1, 2, 3];
    }
    return [0, 0, 0];
  });

  useEffect(() => {
    if (!isVisible) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCounts([1, 2, 3]);
      return;
    }

    const timers: number[] = [];
    STEPS.forEach((step, idx) => {
      const t = window.setTimeout(() => {
        setCounts((prev) => {
          const next = [...prev];
          next[idx] = step.targetNum;
          return next;
        });
      }, 180 + idx * 180);
      timers.push(t);
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [isVisible]);

  return (
    <section
      ref={ref}
      aria-labelledby="how-it-works-heading"
      className="relative py-20 lg:py-[120px] overflow-hidden border-t border-[#0E0D0B]/10 bg-[#F7F1E8] text-[#0E0D0B]"
    >
      {/* Faint topographic line pattern in ember at ~6-7% opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 topographic-pattern"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className={`max-w-2xl mb-12 lg:mb-16 ${isVisible ? 'is-visible' : ''}`}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#B9441A] mb-3">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B]"
          >
            Three steps to better eating in Ijebu Ode.
          </h2>
        </div>

        <div className={`relative ${isVisible ? 'is-visible' : ''}`}>
          {/* Connecting thin line drawn from step 1 to step 3 */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-9 left-[8%] right-[8%] h-px bg-[#0E0D0B]/12 overflow-hidden"
          >
            <div className="step-connector h-full w-full bg-gradient-to-r from-[#E8772E] via-[#B9441A] to-[#3FA66B]" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 relative z-10">
            {STEPS.map((step, idx) => (
              <RevealItem
                key={step.targetNum}
                delay={idx * 80}
                className="hover-lift rounded-[24px] border border-[#0E0D0B]/10 bg-gradient-to-b from-white/95 to-[#EFE7DA]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_38px_-14px_rgba(14,13,11,0.1)] p-7 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span
                      className={`font-display text-5xl sm:text-6xl font-extrabold tabular-nums leading-none transition-colors duration-500 ${
                        counts[idx] > 0 ? 'text-[#E8772E]' : 'text-[#0E0D0B]/20'
                      }`}
                    >
                      0{counts[idx]}
                    </span>
                    {step.comingSoon && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3FA66B]/15 border border-[#3FA66B]/30 px-3 py-1 text-xs font-semibold text-[#236B42]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3FA66B]" aria-hidden="true" />
                        Coming soon
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#0E0D0B] leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base text-[#574F45] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
