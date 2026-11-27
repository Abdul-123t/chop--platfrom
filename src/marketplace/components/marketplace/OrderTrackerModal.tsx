import React from 'react';
import { X, Clock, CheckCircle2, AlertTriangle, Package, Bike, Store, MapPin } from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatNaira, SERVICE_LOCATIONS } from '../../lib/constants';
import { OrderStatus } from '../../types';

const LIFECYCLE_STEPS: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'pending_acceptance', label: 'Order Sent', description: 'Waiting for vendor confirmation' },
  { key: 'accepted', label: 'Accepted', description: 'Kitchen acknowledged order' },
  { key: 'preparing', label: 'Preparing', description: 'Freshly cooking your meal' },
  { key: 'ready_for_pickup', label: 'Ready', description: 'Packaged & waiting for dispatch' },
  { key: 'out_for_delivery', label: 'Dispatched', description: 'Local rider en route' },
  { key: 'completed', label: 'Completed', description: 'Delivered / collected' },
];

export const OrderTrackerModal: React.FC = () => {
  const {
    isOrderTrackerOpen,
    setIsOrderTrackerOpen,
    activeOrderToTrack,
    setActiveOrderToTrack,
  } = useStore();

  if (!isOrderTrackerOpen || !activeOrderToTrack) return null;

  const currentStepIndex = LIFECYCLE_STEPS.findIndex(s => s.key === activeOrderToTrack.status);
  const isCancelled = activeOrderToTrack.status === 'cancelled';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#F7F6F2] rounded-3xl border border-[#E6E2DA] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E6E2DA] bg-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736C]">
              Real-time Order Tracker
            </span>
            <h3 className="font-display font-extrabold text-lg text-[#141414]">
              Order #{activeOrderToTrack.orderNumber}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsOrderTrackerOpen(false);
              setActiveOrderToTrack(null);
            }}
            className="p-1.5 rounded-full text-[#77736C] hover:text-[#191919] hover:bg-[#F0EEE8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border ${
            isCancelled 
              ? 'bg-red-50 border-red-200 text-red-900' 
              : 'bg-white border-[#E6E2DA] text-[#141414]'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {isCancelled ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <Clock className="w-5 h-5 text-[#C45B3A]" />
              )}
              <h4 className="font-display font-bold text-base">
                {isCancelled ? 'Order Cancelled' : LIFECYCLE_STEPS[currentStepIndex]?.label || 'Active'}
              </h4>
            </div>
            <p className="text-xs text-[#77736C]">
              {isCancelled
                ? activeOrderToTrack.rejectionReason || 'The kitchen was unable to fulfill this order.'
                : LIFECYCLE_STEPS[currentStepIndex]?.description}
            </p>
          </div>

          {/* Stepper Progress */}
          {!isCancelled && (
            <div className="p-4 rounded-2xl bg-white border border-[#E6E2DA] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C] block mb-2">
                Order Lifecycle
              </span>

              <div className="space-y-4">
                {LIFECYCLE_STEPS.map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={step.key} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-[#C45B3A] text-white ring-4 ring-[#C45B3A]/20'
                              : isDone
                              ? 'bg-[#141414] text-white'
                              : 'bg-[#F0EEE8] text-[#77736C]'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        {idx < LIFECYCLE_STEPS.length - 1 && (
                          <div
                            className={`w-0.5 h-6 mt-1 ${
                              currentStepIndex > idx ? 'bg-[#141414]' : 'bg-[#E6E2DA]'
                            }`}
                          />
                        )}
                      </div>

                      <div className="pt-0.5">
                        <p
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-[#C45B3A]'
                              : isDone
                              ? 'text-[#141414]'
                              : 'text-[#77736C]'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[11px] text-[#77736C]">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details & Summary */}
          <div className="p-4 rounded-2xl bg-white border border-[#E6E2DA] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C] block">
              Items & Kitchen
            </span>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#141414] pb-2 border-b border-[#E6E2DA]">
              <Store className="w-4 h-4 text-[#C45B3A]" />
              <span>{activeOrderToTrack.vendorName}</span>
              <span className="text-[#77736C] font-normal">
                ({SERVICE_LOCATIONS[activeOrderToTrack.locationArea].name})
              </span>
            </div>

            <div className="space-y-2">
              {activeOrderToTrack.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#191919]">{item.quantity}x {item.name}</span>
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <p className="text-[10px] text-[#77736C]">
                        {item.selectedOptions.map(o => o.choiceName).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-medium text-[#191919]">{formatNaira(item.itemTotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E6E2DA] space-y-1 text-xs">
              <div className="flex justify-between text-[#77736C]">
                <span>Delivery / Logistics</span>
                <span>{formatNaira(activeOrderToTrack.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-sm text-[#141414] pt-1">
                <span>Total</span>
                <span className="text-[#C45B3A]">{formatNaira(activeOrderToTrack.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          {activeOrderToTrack.deliveryDetails && (
            <div className="p-4 rounded-2xl bg-white border border-[#E6E2DA] space-y-1 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#77736C] block mb-1">
                Delivery Destination
              </span>
              <div className="flex items-start gap-1.5 text-[#191919]">
                <MapPin className="w-3.5 h-3.5 text-[#C45B3A] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{activeOrderToTrack.deliveryDetails.street}</p>
                  {activeOrderToTrack.deliveryDetails.hostelOrBuilding && (
                    <p className="text-[#77736C]">{activeOrderToTrack.deliveryDetails.hostelOrBuilding}</p>
                  )}
                  <p className="text-[#77736C]">Landmark: {activeOrderToTrack.deliveryDetails.landmark}</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
