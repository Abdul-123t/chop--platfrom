import { useEffect, useState } from 'react';
import { CHOP_CONFIG } from '../config';
import { useReveal } from '../hooks/useReveal';
import { RevealItem } from './RevealItem';

export function WaitlistCounter() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  const count = CHOP_CONFIG.waitlistCount;
  const threshold = CHOP_CONFIG.displayThreshold;
  const goal = Math.max(1, CHOP_CONFIG.launchGoal);
  const meetsThreshold = count >= threshold;
  const targetPercentage = Math.min(100, Math.round((count / goal) * 100));

  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayPercentage(targetPercentage);
      setDisplayCount(count);
      return;
    }

    const duration = 850;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercentage(Math.round(eased * targetPercentage));
      setDisplayCount(Math.round(eased * count));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isVisible, targetPercentage, count]);

  return (
    <section
      ref={ref}
      aria-labelledby="counter-heading"
      className="relative py-16 lg:py-24 border-t border-[#0E0D0B]/10 bg-gradient-to-b from-[#F7F1E8] via-[#F2E9DB] to-[#EDE1CF] text-[#0E0D0B]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <RevealItem className="hover-lift rounded-[24px] border border-[#0E0D0B]/10 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_40px_-16px_rgba(14,13,11,0.1)] p-7 sm:p-10 lg:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-7">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#B9441A] mb-2">
                Launching in Ijebu Ode
              </p>
              <h2
                id="counter-heading"
                className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B]"
              >
                The Ijebu Ode waitlist is growing.
              </h2>
            </div>

            <div className="md:text-right">
              {meetsThreshold ? (
                <p className="font-display text-3xl sm:text-4xl font-extrabold tabular-nums text-[#E8772E]">
                  {displayCount.toLocaleString()}{' '}
                  <span className="text-base font-medium text-[#574F45]">
                    / {goal.toLocaleString()} joined
                  </span>
                </p>
              ) : (
                <p className="font-display text-lg font-bold text-[#B9441A]">
                  Be among the first to join.
                </p>
              )}
            </div>
          </div>

          {meetsThreshold && (
            <>
              <div
                role="progressbar"
                aria-valuenow={targetPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Waitlist progress toward Ijebu Ode launch goal: ${targetPercentage}%`}
                className="h-3.5 w-full rounded-full bg-[#0E0D0B]/10 overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E8772E] to-[#B9441A] origin-left transition-transform duration-700 ease-out"
                  style={{
                    transform: `scaleX(${isVisible ? Math.max(0.04, targetPercentage / 100) : 0})`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[15px] text-[#574F45]">
                <span>Starting in Ijebu Ode</span>
                <span className="font-semibold tabular-nums text-[#0E0D0B]">
                  {displayPercentage}% of launch goal
                </span>
              </div>
            </>
          )}
        </RevealItem>
      </div>
    </section>
  );
}
