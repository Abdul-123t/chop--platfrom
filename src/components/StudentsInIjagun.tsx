import { ArrowRight, ChefHat, Flame, GraduationCap } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { MobileCardAccent } from './MobileCardAccent';
import { RevealItem } from './RevealItem';

interface StudentsInIjagunProps {
  onJoinWaitlist: () => void;
}

const STUDENT_HIGHLIGHTS = [
  {
    icon: GraduationCap,
    title: 'Cafeterias and campus food',
    description: 'Find quick, affordable plates near campus.',
  },
  {
    icon: Flame,
    title: 'Street food and grills',
    description: 'Find the suya and grill stands you already love.',
  },
  {
    icon: ChefHat,
    title: 'Online sellers',
    description: 'Find home cooks and online sellers who deliver to students.',
  },
];

export function StudentsInIjagun({ onJoinWaitlist }: StudentsInIjagunProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="students-ijagun-heading"
      className="relative py-20 lg:py-[120px] overflow-clip border-t border-[#0E0D0B]/8 dark:border-white/[0.06] bg-[#EFE7DA] dark:bg-[#0E0D0B]"
    >
      {/* Faint grid of hairlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hairline-grid"
      />

      {/* Soft ember glow in the top-right corner, slowly drifting */}
      <div
        aria-hidden="true"
        className="pointer-events-none -top-24 -right-20 absolute w-[480px] h-[480px] rounded-full bg-[#B9441A]/24 blur-[125px] animate-slow-glow"
      />

      <div
        className={`relative max-w-[1200px] mx-auto px-4 sm:px-6 waitlist-explainer-reveal ${
          isVisible ? 'is-visible' : ''
        }`}
      >
        <div className={`max-w-2xl mb-12 lg:mb-14 ${isVisible ? 'is-visible' : ''}`}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E] mb-3">
            For students in Ijagun (TASUED)
          </p>
          <h2
            id="students-ijagun-heading"
            className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B] dark:text-[#F7F1E8]"
          >
            Something good is coming to Ijagun (TASUED).
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#574F45] dark:text-[#A89F92] leading-relaxed">
            CHOP is launching in Ijagun (TASUED), so you can find the food you already eat,
            from cafeterias, street food stands and online sellers, in one place. Join the waitlist
            and be among the first to know when it opens.
          </p>
        </div>

        <div className="mobile-card-deck grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {STUDENT_HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <RevealItem
                key={item.title}
                delay={idx * 80}
                stackIndex={idx}
                className="mobile-deck-card h-full"
              >
                <article className="chop-card chop-card-interactive p-5 md:p-8 flex h-full flex-col justify-between">
                  <MobileCardAccent icon={Icon} />
                  <p className="mobile-card-eyebrow">Ijagun (TASUED)</p>
                  <div>
                    <div className="hidden md:flex w-11 h-11 rounded-full bg-[#E8772E]/14 border border-[#E8772E]/25 items-center justify-center text-[#E8772E] mb-6">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-[#0E0D0B] dark:text-[#F7F1E8] leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-[#574F45] dark:text-[#A89F92] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </div>

        <div className="section-action-group mt-10">
          <button
            type="button"
            onClick={onJoinWaitlist}
            className="btn-primary-chop inline-flex items-center justify-center gap-2 rounded-full bg-[#E8772E] hover:bg-[#B9441A] active:scale-[0.98] text-[#0E0D0B] font-semibold text-base px-7 py-3.5 transition-all whitespace-nowrap cursor-pointer"
          >
            <span>Join the waitlist</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
