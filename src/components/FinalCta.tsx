import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

interface FinalCtaProps {
  onJoinCustomer: () => void;
  onJoinVendor: () => void;
}

export function FinalCta({ onJoinCustomer, onJoinVendor }: FinalCtaProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="final-cta-heading"
      className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#E8772E] via-[#D4621E] to-[#B9441A] text-[#0E0D0B]"
    >
      {/* Grain overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 film-grain opacity-55" />

      {/* Large soft light sweep across the band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-2xl animate-cta-sweep"
      />

      {/* Faint oversized CHOP wordmark watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span className="font-display font-extrabold text-[150px] sm:text-[240px] lg:text-[320px] tracking-tighter text-[#0E0D0B]/[0.06] leading-none">
          CHOP
        </span>
      </div>

      <div
        className={`relative max-w-[1200px] mx-auto px-4 sm:px-6 text-center space-y-6 ${
          isVisible ? 'is-visible' : ''
        }`}
      >
        <h2
          id="final-cta-heading"
          className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B] max-w-3xl mx-auto"
        >
          Be first in line in Ijebu Ode.
        </h2>

        <p className="text-base sm:text-lg font-medium text-[#0E0D0B]/85 max-w-xl mx-auto">
          Join the waitlist and we&apos;ll reach you on WhatsApp when CHOP opens.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={onJoinCustomer}
            className="hero-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0E0D0B] hover:bg-[#1E1B17] active:scale-[0.98] text-[#F7F1E8] font-semibold text-base px-8 py-4 transition-all whitespace-nowrap cursor-pointer shadow-xl"
          >
            <span>Join the waitlist</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onJoinVendor}
            className="hero-cta w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-[#0E0D0B]/35 hover:border-[#0E0D0B] active:scale-[0.98] text-[#0E0D0B] font-semibold text-base px-8 py-4 transition-all whitespace-nowrap cursor-pointer"
          >
            Register your food business
          </button>
        </div>
      </div>
    </section>
  );
}
