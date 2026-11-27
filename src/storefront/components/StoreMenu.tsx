import { UtensilsCrossed } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';
import { cardClass } from '../../components/ui/styles';
import type { StoreItem, StoreSection } from '../types';
import { MenuItemCard } from './MenuItemCard';

interface StoreMenuProps {
  sections: StoreSection[];
  canOrder: boolean;
  quantityOf: (itemId: string) => number;
  onChange: (item: StoreItem, quantity: number) => void;
}

export function StoreMenu({ sections, canOrder, quantityOf, onChange }: StoreMenuProps) {
  if (sections.length === 0) {
    return (
      <EmptyState icon={UtensilsCrossed} title="Menu coming soon">
        This food spot has not added dishes yet.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-3 min-w-0">
      {sections.length > 1 && (
        <nav aria-label="Menu sections" className="sticky top-14 z-20 -mx-3 px-3 sm:mx-0 sm:px-0 py-2 bg-[#F7F1E8]/95 dark:bg-[#0E0D0B]/95 backdrop-blur">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#section-${section.id}`}
                className="shrink-0 rounded-full border border-[#0E0D0B]/12 dark:border-white/12 px-3 py-1.5 text-[13px] font-semibold hover:border-[#E8772E] hover:text-[#E8772E]"
              >
                {section.name}
              </a>
            ))}
          </div>
        </nav>
      )}
      {sections.map((section) => (
        <div key={section.id} id={`section-${section.id}`} className={`${cardClass} px-4 pt-3 scroll-mt-28`}>
          <h2 className="text-[17px] font-extrabold tracking-tight">{section.name}</h2>
          <ul className="divide-y divide-[#0E0D0B]/[0.06] dark:divide-white/[0.06]">
            {section.items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                canOrder={canOrder}
                quantity={quantityOf(item.id)}
                onChange={(quantity) => onChange(item, quantity)}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
