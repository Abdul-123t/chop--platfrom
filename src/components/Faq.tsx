import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CHOP_CONFIG } from '../config';
import { useReveal } from '../hooks/useReveal';
import { RevealItem } from './RevealItem';

const FAQ_ITEMS = [
  {
    id: 'what-is-chop',
    question: 'What is CHOP?',
    answer:
      'CHOP is a food discovery platform that helps you find the food businesses around you in one organised place, starting with Ijebu Ode. Ordering is coming soon.',
  },
  {
    id: 'when-launch',
    question: 'When does CHOP launch?',
    answer:
      "We are launching in phases, starting with Ijebu Ode. Join the waitlist and we'll message you on WhatsApp when it opens in your area.",
  },
  {
    id: 'where-start',
    question: 'Where will CHOP start?',
    answer:
      "Ijebu Ode first, then Ijagun (TASUED) and nearby areas. We'll expand across Ogun State from there.",
  },
  {
    id: 'is-it-free',
    question: 'Is it free to join?',
    answer: `Joining the waitlist is free. ${CHOP_CONFIG.pricingSentence}`,
  },
  {
    id: 'list-business',
    question: 'How do I list my food business?',
    answer:
      'Tap "Apply as a food business" and fill in the short form. Our team will reach out on WhatsApp.',
  },
  {
    id: 'order-now',
    question: 'Can I order now?',
    answer:
      'Not yet. Ordering is coming soon. For now, you can discover food businesses and join the waitlist.',
  },
];

export function Faq() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={ref}
      aria-labelledby="faq-heading"
      className="relative py-20 lg:py-[120px] bg-[#F7F1E8] dark:bg-[#0E0D0B]"
    >
      {/* Thin top gradient border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E8772E]/55 to-transparent"
      />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <div className={`mb-10 lg:mb-12 ${isVisible ? 'is-visible' : ''}`}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E] mb-3">
            Questions
          </p>
          <h2
            id="faq-heading"
            className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B] dark:text-[#F7F1E8]"
          >
            Straight answers about CHOP in Ijebu Ode.
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-btn-${item.id}`;

            return (
              <RevealItem
                key={item.id}
                delay={idx * 80}
                className="hover-lift chop-card overflow-hidden"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                  >
                    <span className="font-display text-lg sm:text-xl font-bold text-[#0E0D0B] dark:text-[#F7F1E8]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#E8772E] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                {/* Smooth height animation via CSS grid-template-rows */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-base text-[#574F45] dark:text-[#A89F92] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
