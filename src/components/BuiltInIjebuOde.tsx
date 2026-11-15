import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { RevealItem } from './RevealItem';

interface HubNode {
  id: 'ijebu-ode' | 'ijagun';
  name: string;
  phase: string;
  note: string;
}

const HUB_NODES: HubNode[] = [
  {
    id: 'ijebu-ode',
    name: 'Ijebu Ode',
    phase: 'Launch hub',
    note: 'Home base. Full neighbourhood coverage across Sabo, Folagbade, Ita-Osu, Oke-Aje, Bonojo, and GRA.',
  },
  {
    id: 'ijagun',
    name: 'Ijagun (TASUED)',
    phase: 'First wave',
    note: 'Connecting the Ijagun (TASUED) community with nearby food spots, campus cafeterias, and home kitchens.',
  },
];

export function BuiltInIjebuOde() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const [activeHub, setActiveHub] = useState<HubNode['id']>('ijebu-ode');

  const selected = HUB_NODES.find((h) => h.id === activeHub) || HUB_NODES[0];

  return (
    <section
      ref={ref}
      aria-labelledby="ijebu-ode-heading"
      className="relative py-20 lg:py-[120px] overflow-hidden border-t border-[#0E0D0B]/8 dark:border-white/[0.06] bg-[#F7F1E8] dark:bg-[#0E0D0B]"
    >
      {/* Large slowly breathing radial glow centred behind the map */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[8%] -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-[#E8772E]/16 blur-[130px] animate-breathing-glow"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Copy & Interactive Phase Selector */}
          <div className={`lg:col-span-5 space-y-6 ${isVisible ? 'is-visible' : ''}`}>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#E8772E] mb-3">
                Where we start
              </p>
              <h2
                id="ijebu-ode-heading"
                className="heading-wipe font-display font-bold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#0E0D0B] dark:text-[#F7F1E8]"
              >
                Built in Ijebu Ode, for the whole area.
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#574F45] dark:text-[#A89F92] leading-relaxed">
              We start in Ijebu Ode, where food is already loved. Then we grow to Ijagun (TASUED) and across
              Ogun State.
            </p>

            {/* Interactive Zone Pills */}
            <div className="space-y-4 pt-2">
              {HUB_NODES.map((node, idx) => {
                const active = activeHub === node.id;
                return (
                  <RevealItem
                    key={node.id}
                    delay={idx * 80}
                    className="hover-lift w-full"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveHub(node.id)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                        active
                          ? 'border-[#E8772E] bg-[#E8772E]/10'
                          : 'border-[#0E0D0B]/10 dark:border-white/[0.08] hover:border-[#E8772E]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-display text-lg font-bold text-[#0E0D0B] dark:text-[#F7F1E8] flex items-center gap-2">
                          <MapPin
                            className={`w-4 h-4 ${
                              node.id === 'ijebu-ode' ? 'text-[#E8772E]' : 'text-[#3FA66B]'
                            }`}
                            aria-hidden="true"
                          />
                          {node.name}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            node.id === 'ijebu-ode' ? 'text-[#E8772E]' : 'text-[#3FA66B]'
                          }`}
                        >
                          {node.phase}
                        </span>
                      </div>
                      {active && (
                        <p className="mt-2 text-sm text-[#574F45] dark:text-[#A89F92]">
                          {node.note}
                        </p>
                      )}
                    </button>
                  </RevealItem>
                );
              })}
            </div>
          </div>

          {/* Right Stylised SVG Map with Concentric Rings & Drawing Connector */}
          <RevealItem delay={100} className="hover-lift lg:col-span-7">
            <div className="chop-card p-5 sm:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#574F45] dark:text-[#A89F92]">
                  Ogun State · Ijebu Ode &amp; Ijagun (TASUED)
                </span>
                <span className="text-xs font-semibold text-[#E8772E]">
                  {selected.name} — {selected.phase}
                </span>
              </div>

              <svg
                viewBox="0 0 640 420"
                className="w-full h-auto rounded-2xl bg-[#12100D] border border-white/[0.06]"
                role="img"
                aria-label="Stylised map showing Ijebu Ode as the main launch hub, with Ijagun (TASUED) as the first wave point in Ogun State"
              >
                {/* Faint Ogun State Regional Outline */}
                <path
                  d="M40 120 C120 65, 290 50, 440 85 C530 105, 595 160, 605 260 C612 330, 540 375, 430 375 C310 375, 195 360, 105 320 C45 290, 22 195, 40 120 Z"
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />

                {/* Faint concentric rings radiating from Ijebu Ode */}
                <circle cx="300" cy="205" r="95" fill="none" stroke="rgba(232,119,46,0.12)" strokeWidth="1" />
                <circle cx="300" cy="205" r="155" fill="none" stroke="rgba(232,119,46,0.08)" strokeWidth="1" />
                <circle cx="300" cy="205" r="220" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                {/* Ogun State subtle regional label */}
                <text
                  x="76"
                  y="112"
                  fill="rgba(168,159,146,0.38)"
                  fontSize="13"
                  fontWeight="600"
                  letterSpacing="0.16em"
                >
                  OGUN STATE
                </text>

                {/* Subtle Grid Lines */}
                <line x1="0" y1="210" x2="640" y2="210" stroke="rgba(255,255,255,0.04)" />
                <line x1="300" y1="0" x2="300" y2="420" stroke="rgba(255,255,255,0.04)" />

                {/* Arterial roads */}
                <path
                  d="M90 190 Q210 185 300 205 T520 265"
                  fill="none"
                  stroke="rgba(232,119,46,0.22)"
                  strokeWidth="2.5"
                />
                <path
                  d="M300 205 Q265 110 340 48"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                />

                {/* Drawing connector line: Ijebu Ode -> Ijagun (TASUED) */}
                <path
                  d="M300 205 Q375 245 455 275"
                  fill="none"
                  stroke="#3FA66B"
                  strokeWidth="2.5"
                  strokeDasharray="190"
                  strokeDashoffset={isVisible ? 0 : 190}
                  style={{ transition: 'stroke-dashoffset 850ms cubic-bezier(0.16, 1, 0.3, 1) 200ms' }}
                />

                {/* Neighbouring Ijebu Ode neighbourhood markers */}
                {[
                  { x: 238, y: 185, label: 'Sabo' },
                  { x: 266, y: 245, label: 'Folagbade' },
                  { x: 344, y: 170, label: 'Oke-Aje' },
                  { x: 338, y: 235, label: 'Ita-Osu' },
                ].map((hood) => (
                  <g key={hood.label}>
                    <circle cx={hood.x} cy={hood.y} r="3.5" fill="rgba(247,241,232,0.45)" />
                    <text
                      x={hood.x}
                      y={hood.y - 9}
                      textAnchor="middle"
                      fill="rgba(168,159,146,0.75)"
                      fontSize="10"
                      fontWeight="500"
                    >
                      {hood.label}
                    </text>
                  </g>
                ))}

                {/* Main Launch Point: Ijebu Ode with pulsing ring */}
                <g onClick={() => setActiveHub('ijebu-ode')} className="cursor-pointer">
                  <circle
                    cx="300"
                    cy="205"
                    r="38"
                    fill="rgba(232,119,46,0.2)"
                    className="animate-pin-ring"
                  />
                  <circle
                    cx="300"
                    cy="205"
                    r={activeHub === 'ijebu-ode' ? 54 : 44}
                    fill="rgba(232,119,46,0.12)"
                  />
                  <circle
                    cx="300"
                    cy="205"
                    r="28"
                    fill="rgba(232,119,46,0.22)"
                    stroke="#E8772E"
                    strokeWidth="1.5"
                  />
                  <circle cx="300" cy="205" r="11" fill="#E8772E" />
                  <circle cx="300" cy="205" r="4.5" fill="#0E0D0B" />

                  <rect x="225" y="246" width="150" height="32" rx="16" fill="#E8772E" />
                  <text
                    x="300"
                    y="267"
                    textAnchor="middle"
                    fill="#0E0D0B"
                    fontSize="16"
                    fontWeight="800"
                  >
                    Ijebu Ode
                  </text>
                </g>

                {/* First Wave Point: Ijagun (TASUED) */}
                <g onClick={() => setActiveHub('ijagun')} className="cursor-pointer">
                  <circle
                    cx="455"
                    cy="275"
                    r="16"
                    fill="rgba(63,166,107,0.22)"
                    className="animate-pin-ring"
                    style={{ animationDelay: '450ms' }}
                  />
                  <circle
                    cx="455"
                    cy="275"
                    r={activeHub === 'ijagun' ? 22 : 16}
                    fill="rgba(63,166,107,0.18)"
                  />
                  <circle cx="455" cy="275" r="7" fill="#3FA66B" />
                  <text
                    x="455"
                    y="305"
                    textAnchor="middle"
                    fill="#F7F1E8"
                    fontSize="13"
                    fontWeight="700"
                  >
                    Ijagun (TASUED)
                  </text>
                  <text
                    x="455"
                    y="321"
                    textAnchor="middle"
                    fill="#3FA66B"
                    fontSize="10"
                    fontWeight="600"
                  >
                    First wave
                  </text>
                </g>
              </svg>
            </div>
          </RevealItem>
        </div>
      </div>
    </section>
  );
}
