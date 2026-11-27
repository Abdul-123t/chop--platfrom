import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Plus,
  Minus,
  AlertCircle,
  PauseCircle,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatNaira, SERVICE_LOCATIONS } from '../../lib/constants';
import { MenuItem, MenuItemOption, SelectedOption } from '../../types';

export const StorefrontModal: React.FC = () => {
  const {
    selectedVendorStorefront,
    setSelectedVendorStorefront,
    menuItems,
    addToCart,
  } = useStore();

  const [activeItemForCustomization, setActiveItemForCustomization] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!selectedVendorStorefront) return null;

  const vendor = selectedVendorStorefront;
  const vendorMenu = menuItems.filter(m => m.vendorId === vendor.id);

  const openCustomization = (item: MenuItem) => {
    setActiveItemForCustomization(item);
    setQuantity(1);
    setSelectedOptions([]);
    setSpecialInstructions('');
  };

  const handleOptionToggle = (option: MenuItemOption, choiceName: string, priceDelta: number) => {
    setSelectedOptions(prev => {
      // Remove previous selection for this option group
      const filtered = prev.filter(o => o.optionName !== option.name);
      return [...filtered, { optionName: option.name, choiceName, priceDelta }];
    });
  };

  const handleAddToCart = () => {
    if (!activeItemForCustomization) return;

    const optionsDelta = selectedOptions.reduce((acc, opt) => acc + opt.priceDelta, 0);
    const itemTotal = (activeItemForCustomization.price + optionsDelta) * quantity;

    addToCart({
      cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: activeItemForCustomization.id,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      name: activeItemForCustomization.name,
      unitPrice: activeItemForCustomization.price,
      quantity,
      selectedOptions,
      specialInstructions: specialInstructions.trim() || undefined,
      itemTotal,
    });

    setActiveItemForCustomization(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#F7F6F2] rounded-3xl border border-[#E6E2DA] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 relative">
        
        {/* Vendor Header Cover & Badge */}
        <div className="relative bg-[#141414] text-white p-6 sm:p-8">
          <button
            onClick={() => setSelectedVendorStorefront(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C45B3A] text-white">
                  {SERVICE_LOCATIONS[vendor.locationArea].name}
                </span>
                {vendor.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] text-white/90">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Kitchen
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                {vendor.businessName}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-md">
                {vendor.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C45B3A]" />
                  {vendor.address}{vendor.landmark ? ` (${vendor.landmark})` : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {vendor.openingHours}
                </span>
              </div>
            </div>

            {/* Pause Store Alert */}
            {vendor.isPaused && (
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2">
                <PauseCircle className="w-5 h-5 shrink-0 text-amber-300" />
                <span>Store currently taking a break. New orders paused.</span>
              </div>
            )}
          </div>
        </div>

        {/* Storefront Menu Items */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#141414]">
              Available Menu
            </h3>
            <span className="text-xs text-[#77736C]">
              {vendorMenu.length} verified item{vendorMenu.length !== 1 ? 's' : ''}
            </span>
          </div>

          {vendorMenu.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E6E2DA] p-6 text-xs text-[#77736C] space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-[#77736C]" />
              <p className="font-semibold text-[#141414]">Menu being curated</p>
              <p>This kitchen is finalizing its daily specials. Check back shortly!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vendorMenu.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-[#E6E2DA] flex flex-col justify-between hover:border-[#141414]/30 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display font-bold text-sm text-[#141414]">
                        {item.name}
                      </h4>
                      <span className="font-display font-bold text-xs text-[#C45B3A]">
                        {formatNaira(item.price)}
                      </span>
                    </div>
                    <p className="text-xs text-[#77736C] mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#E6E2DA] flex items-center justify-between">
                    <span className="text-[10px] text-[#77736C]">
                      Prep ~{item.preparationMinutes} mins
                    </span>
                    <button
                      type="button"
                      disabled={vendor.isPaused || !item.isAvailable}
                      onClick={() => openCustomization(item)}
                      className="py-1.5 px-3 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black disabled:opacity-40 transition-all flex items-center gap-1"
                    >
                      <span>Order</span>
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customization Modal Sub-Sheet */}
        {activeItemForCustomization && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E6E2DA] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-display text-lg font-bold text-[#141414]">
                    {activeItemForCustomization.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#C45B3A]">
                    Base: {formatNaira(activeItemForCustomization.price)}
                  </p>
                </div>
                <button
                  onClick={() => setActiveItemForCustomization(null)}
                  className="p-1 rounded-full text-[#77736C] hover:bg-[#F0EEE8]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              {activeItemForCustomization.options && activeItemForCustomization.options.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#E6E2DA]">
                  {activeItemForCustomization.options.map((opt) => (
                    <div key={opt.id} className="space-y-1.5">
                      <span className="text-xs font-bold text-[#141414] block">
                        {opt.name}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {opt.choices.map((choice) => {
                          const isSelected = selectedOptions.some(
                            o => o.optionName === opt.name && o.choiceName === choice.name
                          );

                          return (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() => handleOptionToggle(opt, choice.name, choice.priceDelta)}
                              className={`p-2 rounded-xl text-left text-xs border transition-all ${
                                isSelected
                                  ? 'bg-[#141414] text-white border-[#141414]'
                                  : 'bg-[#F7F6F2] text-[#191919] border-[#E6E2DA]'
                              }`}
                            >
                              <div className="font-semibold">{choice.name}</div>
                              {choice.priceDelta > 0 && (
                                <div className="text-[10px] opacity-80">+{formatNaira(choice.priceDelta)}</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Kitchen Note */}
              <div>
                <label className="block text-xs font-semibold text-[#191919] mb-1">
                  Special Kitchen Instructions
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Less pepper, separate stew, extra spoon..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
                />
              </div>

              {/* Quantity and Add Button */}
              <div className="pt-2 border-t border-[#E6E2DA] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-[#F0EEE8] p-1.5 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 rounded bg-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C45B3A]" />
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
