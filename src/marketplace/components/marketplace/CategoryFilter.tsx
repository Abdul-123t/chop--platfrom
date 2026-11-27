import React from 'react';
import {
  UtensilsCrossed,
  Flame,
  Soup,
  Sparkles,
  FlameKindling,
  Sandwich,
  Coffee,
  Cookie,
  GlassWater,
  Users,
  Salad,
  ArrowRight,
  Store,
} from 'lucide-react';
import { FOOD_CATEGORIES } from '../../lib/constants';
import { useStore } from '../../lib/store';

const iconMap: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Soup: <Soup className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  FlameKindling: <FlameKindling className="w-5 h-5" />,
  Sandwich: <Sandwich className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Cookie: <Cookie className="w-5 h-5" />,
  GlassWater: <GlassWater className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Salad: <Salad className="w-5 h-5" />,
};

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory, approvedVendors, menuItems, setActiveView } = useStore();

  const selectedCatObj = FOOD_CATEGORIES.find(c => c.slug === selectedCategory);
  const activeVendorsInCategory = approvedVendors.filter(v =>
    selectedCategory ? (v.foodCategories?.includes(selectedCategory) || menuItems.some(m => m.vendorId === v.id && m.categorySlug === selectedCategory)) : true
  );

  return (
    <section id="food-categories" className="py-10 sm:py-14 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C45B3A]">
                Food Taxonomy
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#141414]">
              Explore Food Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#77736C] mt-1 max-w-xl">
              Curated flavours crafted by local kitchens across Ijebu Ode and Ijagun. Select a category to see upcoming menus.
            </p>
          </div>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-[#C45B3A] hover:underline self-start sm:self-auto bg-white px-3 py-1.5 rounded-full border border-[#E6E2DA] shadow-xs active:scale-95"
            >
              Reset Category Filter &times;
            </button>
          )}
        </div>

        {/* Category Grid: Responsive 2-col on small mobile, 3-col on tablets, 4-col on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {FOOD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                className={`group text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#141414] text-white border-[#141414] shadow-md ring-2 ring-[#C45B3A]/30'
                    : 'bg-white hover:bg-[#F0EEE8] border-[#E6E2DA] text-[#191919] hover:border-[#141414]/30'
                }`}
              >
                <div>
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected
                        ? 'bg-[#C45B3A] text-white'
                        : 'bg-[#F0EEE8] group-hover:bg-white text-[#C45B3A]'
                    }`}
                  >
                    {iconMap[cat.iconName] || <UtensilsCrossed className="w-5 h-5" />}
                  </div>

                  <h3
                    className={`font-display font-bold text-xs sm:text-sm leading-snug ${
                      isSelected ? 'text-white' : 'text-[#141414]'
                    }`}
                  >
                    {cat.name}
                  </h3>

                  <p
                    className={`text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-white/70' : 'text-[#77736C]'
                    }`}
                  >
                    {cat.tagline}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-current/10 flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span className={isSelected ? 'text-white/60' : 'text-[#77736C] truncate max-w-[85%]'}>
                    {cat.popularItems.slice(0, 2).join(', ')}
                  </span>
                  <span
                    className={`font-bold shrink-0 ${
                      isSelected ? 'text-[#C45B3A]' : 'text-[#141414]'
                    }`}
                  >
                    &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category-Specific Intentional Empty State — Honest & Welcoming */}
        {selectedCategory && selectedCatObj && activeVendorsInCategory.length === 0 && (
          <div className="mt-8 p-8 sm:p-10 rounded-3xl bg-white border border-[#E6E2DA] text-center max-w-2xl mx-auto space-y-4 shadow-xs animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#F0EEE8] text-[#C45B3A] flex items-center justify-center mx-auto shadow-xs">
              {iconMap[selectedCatObj.iconName] || <Store className="w-7 h-7" />}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C45B3A] bg-[#C45B3A]/10 px-3 py-1 rounded-full">
                {selectedCatObj.name}
              </span>
              <h4 className="font-display font-extrabold text-xl sm:text-2xl text-[#141414]">
                Something delicious is waiting to be discovered.
              </h4>
              <p className="text-xs sm:text-sm text-[#77736C] max-w-md mx-auto leading-relaxed">
                We&apos;re welcoming food businesses to CHOP. Check back as more local kitchens and food sellers join.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveView('for-vendors');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3 px-6 rounded-full bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-xs flex items-center gap-2 active:scale-95"
              >
                <Store className="w-4 h-4 text-[#C45B3A]" />
                <span>Become a CHOP Vendor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="py-3 px-5 rounded-full bg-[#F0EEE8] text-[#191919] text-xs sm:text-sm font-semibold hover:bg-[#E6E2DA] transition-colors"
              >
                View all categories
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
