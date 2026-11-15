import { MouseEvent, useState } from 'react';
import {
  Building2,
  ChefHat,
  Coffee,
  Croissant,
  Flame,
  GraduationCap,
  Home,
  Pizza,
  Sandwich,
  Soup,
} from 'lucide-react';
import { FOOD_CATEGORIES } from '../config';
import { useReveal } from '../hooks/useReveal';
import { MobileCardAccent } from './MobileCardAccent';
import { RevealItem } from './RevealItem';

const CATEGORY_ICONS: Record<string, typeof Soup> = {
  'local-bukas': Soup,
  restaurants: Building2,
  'street-food-grills': Flame,
  'cafeterias-campus': GraduationCap,
  'shawarma-fast-food': Sandwich,
  pizzerias: Pizza,
  bakeries: Croissant,
  'small-chops': Coffee,
  'home-kitchens': Home,
  'online-caterers': ChefHat,
};

export function Categories() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const [cursor, setCursor] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  return (
    <section
      ref={ref}
      aria-labelledby="categories-heading"
      className="relative py-20 lg:py-[120px] overflow-clip border-t border-[#0E0D0B]/8 dark:border-white/[0.06] bg-[#F7F1E8] dark:bg-[#0E0D0B]"
    >
      {/* Static ambient glow on mobile */}
      <div
        aria-hidden="true"
        className="pointer-events-none lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#E8772E]/12 blur-[100px]"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div
          className={`max-w-2xl mb-12 lg:mb-14 ${isVisible ? 'is-visible' : ''}`}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E] mb-3">
            What you&apos;ll find in Ijebu Ode
          </p>
          <h2
            id="categories-heading"
            className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B] dark:text-[#F7F1E8]"
          >
            Every kind of food, in one place.
          </h2>
        </div>

        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursor((prev) => ({ ...prev, active: false }))}
          className="relative"
        >
          {/* Desktop Cursor-Following Spotlight */}
          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute -top-[180px] -left-[180px] w-[360px] h-[360px] rounded-full bg-[#E8772E]/15 blur-[95px] transition-opacity duration-300"
            style={{
              opacity: cursor.active ? 1 : 0,
              transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
            }}
          />

          <div className="mobile-card-deck relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-5">
            {FOOD_CATEGORIES.map((cat, idx) => {
              const Icon = CATEGORY_ICONS[cat.id] || Soup;
              return (
                <RevealItem
                  key={cat.id}
                  delay={idx * 80}
                  stackIndex={idx}
                  className="mobile-deck-card h-full"
                >
                  <div
                    tabIndex={0}
                    className="group chop-card chop-card-interactive flex min-h-[168px] h-full flex-col justify-between p-5 focus:outline-none md:p-6"
                  >
                    <MobileCardAccent icon={Icon} />
                    <p className="mobile-card-eyebrow">{cat.shortLabel}</p>
                    <div className="hidden md:flex w-10 h-10 rounded-full bg-[#E8772E]/12 border border-[#E8772E]/25 items-center justify-center text-[#E8772E] transition-all duration-200 group-hover:bg-[#E8772E] group-hover:text-[#0E0D0B] group-hover:rotate-6">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>

                    <div className="mt-5">
                      <h3 className="font-display text-lg font-bold text-[#0E0D0B] dark:text-[#F7F1E8] leading-snug">
                        {cat.label}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#574F45] dark:text-[#A89F92] opacity-85 transition-all duration-200">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
