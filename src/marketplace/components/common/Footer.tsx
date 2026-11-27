import React from 'react';
import { useStore } from '../../lib/store';
import { ArrowUpRight, Heart, ShieldCheck } from 'lucide-react';
import { BRAND, SERVICE_LOCATIONS } from '../../lib/constants';

export const Footer: React.FC = () => {
  const { setActiveView, setIsHowItWorksOpen, openSignUp, currentUser, replayIntro } = useStore();

  return (
    <footer className="bg-[#141414] text-[#F7F6F2] pt-16 pb-12 border-t border-[#191919]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand Statement & Wordmark Motif */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-black tracking-tight text-white">
                CHOP<span className="text-[#C45B3A]">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/50 border border-white/15 px-2 py-0.5 rounded-full font-semibold">
                Ijebu Ode &bull; Ijagun
              </span>
            </div>

            <p className="text-[#F7F6F2]/80 text-sm leading-relaxed max-w-sm">
              {BRAND.footerDescription}
            </p>
            
            <p className="font-display font-medium text-xs text-[#C45B3A] tracking-wide">
              {BRAND.motto}
            </p>

            <div className="pt-2">
              <button
                onClick={currentUser ? () => { setActiveView('marketplace'); const el = document.getElementById('food-categories'); el?.scrollIntoView({ behavior: 'smooth' }); } : openSignUp}
                className="inline-flex items-center gap-2 text-xs font-semibold py-2.5 px-4 rounded-full bg-white text-[#141414] hover:bg-[#F0EEE8] transition-all"
              >
                {currentUser ? 'Explore Food Categories' : 'Create Customer Account'}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* Discover */}
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                Discover
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li>
                  <button
                    onClick={() => {
                      setActiveView('marketplace');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Explore Food
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('marketplace');
                      const el = document.getElementById('food-categories');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Food Categories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsHowItWorksOpen(true)}
                    className="hover:text-white transition-colors"
                  >
                    How CHOP Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      replayIntro();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Experience Welcome Story
                  </button>
                </li>
                <li>
                  <span className="text-white/40 cursor-default">
                    Coverage Map
                  </span>
                </li>
              </ul>
            </div>

            {/* For Food Businesses */}
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                Vendors
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li>
                  <button
                    onClick={() => {
                      setActiveView('for-vendors');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#C45B3A] hover:underline transition-colors"
                  >
                    Become a Vendor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveView('for-vendors');
                      const el = document.getElementById('vendor-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Founding Application
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('vendor-workspace')}
                    className="hover:text-white transition-colors"
                  >
                    Vendor Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Service Hubs */}
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                Official Coverage
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li className="flex flex-col">
                  <span className="font-semibold text-white">Ijebu Ode</span>
                  <span className="text-[10px] text-white/50">General Service Location</span>
                </li>
                <li className="flex flex-col mt-2">
                  <span className="font-semibold text-white">Ijagun</span>
                  <span className="text-[10px] text-white/50">TASUED &amp; Surrounds</span>
                </li>
              </ul>
            </div>

            {/* Trust & Operations */}
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                Operations
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li className="flex items-center gap-1.5 text-white/70">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C45B3A]" />
                  <span>Real Local Kitchens</span>
                </li>
                <li className="text-[11px] text-white/50 leading-relaxed">
                  Zero fake inventory. Every vendor verified before public listing.
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Large Display Wordmark "Chop" (AGBARA style) */}
        <div className="pt-10 pb-6 sm:pt-14 sm:pb-8 flex justify-center text-center select-none" aria-hidden="true">
          <span
            className="footer-chop-wordmark inline-block py-2 sm:py-3"
            style={{
              fontFamily: "'Bowlby One', cursive, sans-serif",
              fontSize: 'clamp(4.5rem, 16vw, 13.5rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            <span
              style={{
                color: '#E8693A',
                paintOrder: 'stroke fill',
                WebkitTextStroke: '2px #0B0B0B',
                textShadow: `
                  -1px -1px 0 #F5F3EF, 1px -1px 0 #F5F3EF, -1px 1px 0 #F5F3EF, 1px 1px 0 #F5F3EF,
                  -2px -2px 0 #F5F3EF, 2px -2px 0 #F5F3EF, -2px 2px 0 #F5F3EF, 2px 2px 0 #F5F3EF,
                  0 -2px 0 #F5F3EF, 0 2px 0 #F5F3EF, -2px 0 0 #F5F3EF, 2px 0 0 #F5F3EF
                `,
              }}
            >
              C
            </span>
            <span
              style={{
                color: '#F5F3EF',
                paintOrder: 'stroke fill',
                WebkitTextStroke: '2px #0B0B0B',
                textShadow: `
                  -1px -1px 0 #F5F3EF, 1px -1px 0 #F5F3EF, -1px 1px 0 #F5F3EF, 1px 1px 0 #F5F3EF,
                  -2px -2px 0 #F5F3EF, 2px -2px 0 #F5F3EF, -2px 2px 0 #F5F3EF, 2px 2px 0 #F5F3EF,
                  0 -2px 0 #F5F3EF, 0 2px 0 #F5F3EF, -2px 0 0 #F5F3EF, 2px 0 0 #F5F3EF
                `,
              }}
            >
              hop
            </span>
          </span>
        </div>

        {/* Bottom Bar: Copyright & Subtle Accent Motif */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex flex-wrap items-center gap-2">
            <span>&copy; {new Date().getFullYear()} CHOP Technologies.</span>
            <span>&bull;</span>
            <span>Ijebu Ode &amp; Ijagun, Ogun State.</span>
            {import.meta.env.DEV && (
              <>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => {
                    replayIntro();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors underline decoration-white/30"
                  title="Click to replay the signature animated intro (Dev Only)"
                >
                  Replay Intro
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#C45B3A] fill-[#C45B3A]" />
            <span>for Ijebu food culture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
