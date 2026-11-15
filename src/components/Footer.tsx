import { Instagram, MessageCircle } from 'lucide-react';
import { CHOP_CONFIG } from '../config';
import { useReveal } from '../hooks/useReveal';
import { ContactLink } from './ContactLink';

export function Footer() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <footer
      ref={ref}
      className="safe-area-footer relative overflow-hidden bg-[#080706] text-[#F7F1E8] pt-16 pb-10"
    >
      {/* Hairline top border with faint orange gradient line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-white/[0.06] via-[#E8772E]/55 to-white/[0.06]"
      />

      {/* Soft orange glow in bottom-right corner (slow 30s opacity drift) */}
      <div
        aria-hidden="true"
        className="pointer-events-none -bottom-24 -right-24 absolute w-80 h-80 rounded-full bg-[#E8772E]/20 blur-[100px] footer-corner-glow"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/[0.08]">
          {/* Column 1: Wordmark, Brand Meaning, Brand Mission, Launching in */}
          <div
            className={`md:col-span-6 space-y-5 footer-col-reveal ${
              isVisible ? 'is-visible' : ''
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <a
              href="#top"
              className="inline-flex items-center gap-2 font-display text-2xl font-extrabold text-[#F7F1E8]"
            >
              {CHOP_CONFIG.brandName}
              <span
                className="inline-block w-2.5 h-2.5 rounded-full bg-[#E8772E]"
                aria-hidden="true"
              />
            </a>

            <p className="text-[15px] text-[#A89F92] leading-relaxed max-w-md">
              {CHOP_CONFIG.brand.meaning}
            </p>

            <p className="font-display text-lg sm:text-xl font-bold text-[#F7F1E8] leading-snug max-w-lg">
              {CHOP_CONFIG.brand.mission}
            </p>

            {/* Launching in */}
            <div className="pt-2 space-y-2.5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E]">
                Launching in
              </p>
              <ul className="space-y-2 text-[15px]">
                <li className="flex items-center gap-3">
                  <span className="relative flex items-center justify-center w-3 h-3">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[#E8772E]/45 ijebu-home-dot-ring"
                    />
                    <span
                      aria-hidden="true"
                      className="relative w-2 h-2 rounded-full bg-[#E8772E] shadow-[0_0_10px_#E8772E]"
                    />
                  </span>
                  <span className="font-semibold text-[#F7F1E8]">Ijebu Ode</span>
                  <span className="rounded-full border border-[#E8772E]/35 bg-[#E8772E]/12 px-2.5 py-0.5 text-[15px] font-semibold text-[#E8772E]">
                    Home
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-3 h-3">
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full bg-[#3FA66B]"
                    />
                  </span>
                  <span className="font-medium text-[#F7F1E8]">Ijagun (TASUED)</span>
                  <span className="text-[15px] font-medium text-[#3FA66B]">First wave</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div
            className={`md:col-span-3 space-y-4 footer-col-reveal ${
              isVisible ? 'is-visible' : ''
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#A89F92]">
              Explore
            </h3>
            <nav aria-label="Footer explore links" className="flex flex-col gap-3 text-[15px]">
              <a
                href="#how-it-works"
                className="text-[#F7F1E8]/85 hover:text-[#E8772E] transition-colors w-fit"
              >
                How it works
              </a>
              <a
                href="#for-vendors"
                className="text-[#F7F1E8]/85 hover:text-[#E8772E] transition-colors w-fit"
              >
                For vendors
              </a>
              <a
                href="#faq"
                className="text-[#F7F1E8]/85 hover:text-[#E8772E] transition-colors w-fit"
              >
                FAQ
              </a>
              <a
                href="/credits.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7F1E8]/85 hover:text-[#E8772E] transition-colors w-fit"
              >
                Photo credits
              </a>
            </nav>
          </div>

          {/* Column 3: Connect */}
          <div
            className={`md:col-span-3 space-y-4 footer-col-reveal ${
              isVisible ? 'is-visible' : ''
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#A89F92]">
              Connect
            </h3>
            <div className="flex gap-3 text-sm">
              <ContactLink
                href={CHOP_CONFIG.contact.whatsappLink}
                label="WhatsApp"
                className="contact-link group relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-[#F7F1E8]/85 transition-[box-shadow,border-color] duration-[250ms]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </ContactLink>

              <ContactLink
                href={CHOP_CONFIG.contact.instagramLink}
                label="Instagram"
                className="contact-link group relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-[#F7F1E8]/85 transition-[box-shadow,border-color] duration-[250ms]"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </ContactLink>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom-bar pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#A89F92]">
          <p className="text-[15px]">© 2026 CHOP. Built in Ijebu Ode, Ogun State, Nigeria.</p>
          <p className="text-[15px]">Pre-launch. Ordering is coming soon.</p>
        </div>
      </div>
    </footer>
  );
}
