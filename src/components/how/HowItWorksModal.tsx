import React, { useState } from 'react';
import { X, Search, Bike, Store, ShieldCheck } from 'lucide-react';
import { useStore } from '../../lib/store';

export const HowItWorksModal: React.FC = () => {
  const {
    isHowItWorksOpen,
    setIsHowItWorksOpen,
    setActiveView,
    currentUser,
    openSignUp,
  } = useStore();

  const [roleTab, setRoleTab] = useState<'customer' | 'vendor'>('customer');

  if (!isHowItWorksOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#F7F6F2] rounded-3xl border border-[#E6E2DA] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-5 border-b border-[#E6E2DA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-extrabold text-lg text-[#141414]">How CHOP Works</h3>
            <span className="text-[10px] text-[#77736C] bg-[#F0EEE8] px-2 py-0.5 rounded-full font-semibold">
              Ijebu Ode · Ijagun
            </span>
          </div>
          <button
            onClick={() => setIsHowItWorksOpen(false)}
            className="p-1.5 rounded-full text-[#77736C] hover:text-[#191919] hover:bg-[#F0EEE8] transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab toggle */}
        <div className="grid grid-cols-2 p-2 bg-white border-b border-[#E6E2DA] gap-2">
          <button
            onClick={() => setRoleTab('customer')}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${roleTab === 'customer'
              ? 'bg-[#141414] text-white'
              : 'text-[#77736C] hover:bg-[#F7F6F2]'
              }`}
          >
            For Food Lovers &amp; Students
          </button>
          <button
            onClick={() => setRoleTab('vendor')}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${roleTab === 'vendor'
              ? 'bg-[#141414] text-white'
              : 'text-[#77736C] hover:bg-[#F7F6F2]'
              }`}
          >
            For Kitchens &amp; Vendors
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">

          {roleTab === 'customer' ? (
            <div className="space-y-3">
              {[
                {
                  step: '1',
                  icon: <Search className="w-4 h-4 text-[#C45B3A]" />,
                  title: 'Select your hub',
                  body: 'Choose between Ijebu Ode and Ijagun (TASUED) to discover kitchens genuinely available in your delivery zone.',
                },
                {
                  step: '2',
                  icon: <Store className="w-4 h-4 text-[#C45B3A]" />,
                  title: 'Browse &amp; customise your meal',
                  body: 'Select proteins, spice levels, extra plantain or add kitchen instructions — with exact ₦ pricing on every item.',
                },
                {
                  step: '3',
                  icon: <Bike className="w-4 h-4 text-[#C45B3A]" />,
                  title: 'Fast delivery or self-pickup',
                  body: 'Provide your landmark (e.g. Bovas, TASUED Express Gate) and your order is dispatched directly from the kitchen.',
                },
                {
                  step: '4',
                  icon: <ShieldCheck className="w-4 h-4 text-[#C45B3A]" />,
                  title: 'Track your order live',
                  body: 'Watch your order move from preparation through dispatch to delivery in real time — no guessing.',
                },
              ].map(({ step, icon, title, body }) => (
                <div key={step} className="p-4 rounded-2xl bg-white border border-[#E6E2DA] flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F0EEE8] flex items-center justify-center font-bold text-xs shrink-0 text-[#C45B3A]">
                    {step}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#141414]" dangerouslySetInnerHTML={{ __html: title }} />
                    <p className="text-xs text-[#77736C] mt-0.5">{body}</p>
                  </div>
                </div>
              ))}

              <div className="pt-1">
                {!currentUser ? (
                  <button
                    onClick={() => {
                      setIsHowItWorksOpen(false);
                      openSignUp();
                    }}
                    className="w-full py-3 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black transition-all focus:outline-none"
                  >
                    Create Your Account →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsHowItWorksOpen(false);
                      setActiveView('marketplace');
                    }}
                    className="w-full py-3 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black transition-all focus:outline-none"
                  >
                    Start Discovering Food →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                {
                  step: '1',
                  title: 'Submit your kitchen details',
                  body: 'Share your menu, physical address in Ijebu Ode or Ijagun, and typical opening hours via our founding vendor form.',
                },
                {
                  step: '2',
                  title: 'Physical verification',
                  body: 'Our team visits your kitchen in person to verify food safety, correct pricing and authentic local listings.',
                },
                {
                  step: '3',
                  title: 'Receive and manage orders',
                  body: 'Get incoming order alerts, control preparation times, and pause your storefront whenever your kitchen needs a break.',
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="p-4 rounded-2xl bg-white border border-[#E6E2DA] flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F0EEE8] flex items-center justify-center font-bold text-xs shrink-0 text-[#141414]">
                    {step}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#141414]">{title}</h4>
                    <p className="text-xs text-[#77736C] mt-0.5">{body}</p>
                  </div>
                </div>
              ))}

              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsHowItWorksOpen(false);
                    setActiveView('for-vendors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-xl bg-[#141414] text-white text-xs font-semibold hover:bg-black transition-all focus:outline-none"
                >
                  Apply as a Founding Vendor →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
