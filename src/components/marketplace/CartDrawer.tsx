import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MapPin,
  CreditCard,
  Building,
  Phone,
  User,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatNaira, SERVICE_LOCATIONS } from '../../lib/constants';
import { LocationArea } from '../../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    selectedLocation,
    placeOrder,
  } = useStore();

  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [orderLocation, setOrderLocation] = useState<LocationArea>(
    selectedLocation === 'ijagun' ? 'ijagun' : 'ijebu-ode'
  );

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [street, setStreet] = useState('');
  const [hostelOrBuilding, setHostelOrBuilding] = useState('');
  const [landmark, setLandmark] = useState('');
  const [directions, setDirections] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave' | 'cash_on_delivery'>('cash_on_delivery');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCartDrawerOpen) return null;

  const currentDeliveryCharge = fulfillmentType === 'delivery' 
    ? SERVICE_LOCATIONS[orderLocation].deliveryBaseFee 
    : 0;
  const currentTotal = cartSubtotal + currentDeliveryCharge;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter customer name and phone number.');
      return;
    }

    if (fulfillmentType === 'delivery') {
      if (!street.trim() || !landmark.trim()) {
        setErrorMsg('Please provide your street/address and a recognisable landmark for delivery.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || `${customerPhone.trim()}@customer.chop.ng`,
        fulfillmentType,
        locationArea: orderLocation,
        deliveryDetails: fulfillmentType === 'delivery' ? {
          street: street.trim(),
          hostelOrBuilding: hostelOrBuilding.trim() || undefined,
          landmark: landmark.trim(),
          directions: directions.trim() || undefined,
          recipientName: customerName.trim(),
          recipientPhone: customerPhone.trim(),
        } : undefined,
        paymentMethod,
      });

      setIsCartDrawerOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#F7F6F2] h-full shadow-2xl flex flex-col border-l border-[#E6E2DA] overflow-hidden animate-in slide-in-from-right duration-250">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E6E2DA] bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C45B3A]" />
            <span className="font-display font-extrabold text-lg text-[#141414]">
              Your Cart
            </span>
            <span className="text-xs text-[#77736C]">
              ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-full text-[#77736C] hover:text-[#191919] hover:bg-[#F0EEE8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-white border border-[#E6E2DA] flex items-center justify-center mx-auto text-[#77736C]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-display text-base font-semibold text-[#141414]">
                Your cart is empty
              </p>
              <p className="text-xs text-[#77736C] max-w-xs mx-auto">
                Explore local categories and founding vendors to start building your meal.
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#77736C]">
                    Kitchen: {cart[0].vendorName}
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-[#77736C] hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl bg-white border border-[#E6E2DA] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-display font-bold text-sm text-[#141414]">
                          {item.name}
                        </h4>
                        <span className="text-xs font-semibold text-[#C45B3A]">
                          {formatNaira(item.unitPrice)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#77736C] hover:text-red-500 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customizations display */}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="text-[11px] text-[#77736C] bg-[#F7F6F2] p-2 rounded-lg space-y-0.5">
                        {item.selectedOptions.map((opt, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{opt.optionName}: {opt.choiceName}</span>
                            {opt.priceDelta > 0 && <span>+{formatNaira(opt.priceDelta)}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[11px] italic text-[#77736C]">
                        Note: &ldquo;{item.specialInstructions}&rdquo;
                      </p>
                    )}

                    {/* Quantity Selector & Item Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E6E2DA]/60">
                      <div className="flex items-center gap-2 bg-[#F0EEE8] rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          className="p-1 rounded bg-white text-[#191919] hover:bg-[#F7F6F2]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          className="p-1 rounded bg-white text-[#191919] hover:bg-[#F7F6F2]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-display font-bold text-sm text-[#141414]">
                        {formatNaira(item.itemTotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-[#E6E2DA]">
                <h3 className="font-display text-sm font-bold text-[#141414]">
                  Fulfillment & Delivery Details
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Fulfillment Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      fulfillmentType === 'delivery'
                        ? 'bg-[#141414] text-white border-[#141414]'
                        : 'bg-white text-[#191919] border-[#E6E2DA]'
                    }`}
                  >
                    Local Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      fulfillmentType === 'pickup'
                        ? 'bg-[#141414] text-white border-[#141414]'
                        : 'bg-white text-[#191919] border-[#E6E2DA]'
                    }`}
                  >
                    Self Pickup
                  </button>
                </div>

                {/* Location Area Selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77736C] mb-1">
                    Service Area <span className="text-[#C45B3A]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderLocation('ijebu-ode')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                        orderLocation === 'ijebu-ode'
                          ? 'bg-[#141414] text-white border-[#141414]'
                          : 'bg-white text-[#191919] border-[#E6E2DA]'
                      }`}
                    >
                      Ijebu Ode (₦600)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderLocation('ijagun')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                        orderLocation === 'ijagun'
                          ? 'bg-[#141414] text-white border-[#141414]'
                          : 'bg-white text-[#191919] border-[#E6E2DA]'
                      }`}
                    >
                      Ijagun (₦450)
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Full Name <span className="text-[#C45B3A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Bukola"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#191919] mb-1">
                      Phone Number <span className="text-[#C45B3A]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="080 000 0000"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Specific Delivery Address Fields (only for delivery) */}
                {fulfillmentType === 'delivery' && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-white border border-[#E6E2DA]">
                    <div>
                      <label className="block text-xs font-semibold text-[#191919] mb-1">
                        Street Address / Building <span className="text-[#C45B3A]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. 14 Folagbade Street or New Road"
                        className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#191919] mb-1">
                        Hostel / Estate / Room (if applicable)
                      </label>
                      <input
                        type="text"
                        value={hostelOrBuilding}
                        onChange={(e) => setHostelOrBuilding(e.target.value)}
                        placeholder="e.g. Harmony Villa Hostel, Room 12"
                        className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#191919] mb-1">
                        Recognisable Landmark <span className="text-[#C45B3A]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Opposite Bovas Filling Station / Near TASUED Gate"
                        className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2DA] text-xs text-[#191919] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Options */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77736C] mb-1">
                    Payment Method
                  </label>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E6E2DA] cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={() => setPaymentMethod('cash_on_delivery')}
                        className="text-[#C45B3A]"
                      />
                      <span className="font-semibold text-[#191919]">Pay on Delivery / Collection</span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E6E2DA] cursor-pointer text-xs">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'paystack'}
                          onChange={() => setPaymentMethod('paystack')}
                          className="text-[#C45B3A]"
                        />
                        <span className="font-medium text-[#191919]">Paystack (Card / Bank Transfer)</span>
                      </div>
                      <span className="text-[10px] text-[#77736C] bg-[#F0EEE8] px-1.5 py-0.5 rounded">
                        Integration Ready
                      </span>
                    </label>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E6E2DA] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#77736C]">
                    <span>Items Subtotal</span>
                    <span>{formatNaira(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#77736C]">
                    <span>
                      {fulfillmentType === 'delivery' ? `Delivery Fee (${SERVICE_LOCATIONS[orderLocation].name})` : 'Pickup'}
                    </span>
                    <span>{formatNaira(currentDeliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between font-display font-bold text-base text-[#141414] pt-2 border-t border-[#E6E2DA]">
                    <span>Total Payable</span>
                    <span className="text-[#C45B3A]">{formatNaira(currentTotal)}</span>
                  </div>
                </div>

                {/* Submit Order */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#141414] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <span>Place Order &bull; {formatNaira(currentTotal)}</span>
                  )}
                </button>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
