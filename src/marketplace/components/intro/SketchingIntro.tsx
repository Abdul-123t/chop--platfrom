import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useStore } from '../../lib/store';
import { Play, FastForward } from 'lucide-react';

// Total animation duration: ~4.0 seconds (3,300ms narrative sequence + 700ms smooth fadeout into marketplace)
const FADEOUT_START_MS = 3300;
const FADEOUT_TRANSITION_MS = 700;

export const SketchingIntro: React.FC = () => {
  const { hasSeenIntro, dismissIntro, replayIntro } = useStore();
  const [fadingOut, setFadingOut] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  // Expose replay function globally for developer QA & console testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __CHOP_REPLAY_INTRO__: () => void }).__CHOP_REPLAY_INTRO__ = replayIntro;
    }
  }, [replayIntro]);

  // Clean finish handler with smooth transition into marketplace
  const handleFinish = useCallback((fast: boolean = false) => {
    setFadingOut(true);
    const transitionTime = fast ? 150 : FADEOUT_TRANSITION_MS;
    finishTimeoutRef.current = setTimeout(() => {
      dismissIntro();
      setFadingOut(false);
    }, transitionTime);
  }, [dismissIntro]);

  // Master ~4.0-second sequence timer
  useEffect(() => {
    if (hasSeenIntro) return;

    if (prefersReducedMotion) {
      // Immediate clean transition for reduced-motion users (no motion/delays)
      timeoutRef.current = setTimeout(() => {
        handleFinish(true);
      }, 400);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Sequence unfolds naturally in CSS; trigger smooth 700ms fadeout at 3,300ms
    timeoutRef.current = setTimeout(() => {
      handleFinish(false);
    }, FADEOUT_START_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    };
  }, [hasSeenIntro, prefersReducedMotion, handleFinish]);

  // If already dismissed, render a developer replay button ONLY in development mode
  if (hasSeenIntro) {
    if (!import.meta.env.DEV) return null;
    return (
      <aside
        aria-label="Developer testing controls"
        className="fixed bottom-20 right-4 z-30 opacity-60 hover:opacity-100 transition-opacity hidden sm:block"
      >
        <button
          type="button"
          onClick={replayIntro}
          className="flex items-center gap-1.5 text-[11px] font-bold text-[#141414] bg-white/95 backdrop-blur-md border border-[#E6E2DA] px-3 py-1.5 rounded-full shadow-xs hover:border-[#141414]/40 active:scale-95 transition-all"
          title="Developer QA: Replay signature intro animation (4s)"
        >
          <Play className="w-3 h-3 text-[#C45B3A] fill-[#C45B3A]" />
          <span>Replay Intro (4s)</span>
        </button>
      </aside>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#F7F6F2] transition-opacity duration-700 ease-in-out select-none overflow-hidden ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="Welcome to CHOP"
    >
      {/* ── Precision Keyframe Animations (0.0s – 4.0s Timeline) ── */}
      <style>{`
        /* 0–400ms: Warm background fades in softly */
        @keyframes chopBgEntrance {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        /* 400–1,500ms: Hand-drawn bowl is gradually sketched */
        @keyframes chopDrawBowlGradual {
          0% {
            stroke-dashoffset: 450;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes chopDrawBowlFootGradual {
          0% {
            stroke-dashoffset: 140;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        /* Surrounding cultural sketches draw naturally alongside bowl */
        @keyframes chopDrawAccentGradual {
          0% {
            stroke-dashoffset: 260;
            opacity: 0;
            transform: scale(0.96);
          }
          20% {
            opacity: 0.85;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.85;
            transform: scale(1);
          }
        }

        /* 1,000–1,900ms: Three elegant steam strokes rise naturally */
        @keyframes chopSteamRiseNatural {
          0% {
            stroke-dashoffset: 120;
            opacity: 0;
            transform: translateY(12px);
          }
          25% {
            opacity: 0.95;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.85;
            transform: translateY(-5px);
          }
        }

        /* 1,500–2,600ms: CHOP wordmark reveals itself smoothly */
        @keyframes chopWordmarkRevealSmooth {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* 2,400–3,300ms: "Good food, closer to you." appears and settles */
        @keyframes chopTaglineRevealSmooth {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Subtle top progress bar (0 to 3,300ms) */
        @keyframes chopProgressPaced {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        /* ── CSS Class Declarations mapped to 4.0s Timeline ── */

        /* 400–1,500ms: Bowl Rim (duration: 1.05s, delay: 0.40s -> ends 1.45s) */
        .chop4s-bowl-rim {
          stroke-dasharray: 450;
          stroke-dashoffset: 450;
          animation: chopDrawBowlGradual 1.05s cubic-bezier(0.22, 1, 0.36, 1) 0.40s forwards;
          will-change: stroke-dashoffset;
        }

        /* 400–1,500ms: Bowl Body (duration: 1.08s, delay: 0.42s -> ends 1.50s) */
        .chop4s-bowl-body {
          stroke-dasharray: 450;
          stroke-dashoffset: 450;
          animation: chopDrawBowlGradual 1.08s cubic-bezier(0.22, 1, 0.36, 1) 0.42s forwards;
          will-change: stroke-dashoffset;
        }

        /* 400–1,500ms: Bowl Glaze Accent (duration: 0.95s, delay: 0.50s -> ends 1.45s) */
        .chop4s-bowl-accent {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: chopDrawBowlGradual 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.50s forwards;
          will-change: stroke-dashoffset;
        }

        /* 400–1,500ms: Bowl Foot (duration: 0.85s, delay: 0.58s -> ends 1.43s) */
        .chop4s-bowl-foot {
          stroke-dasharray: 140;
          stroke-dashoffset: 140;
          animation: chopDrawBowlFootGradual 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.58s forwards;
          will-change: stroke-dashoffset;
        }

        /* Cultural accents (duration: 0.92s, delay: 0.52s -> ends 1.44s) */
        .chop4s-accent {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: chopDrawAccentGradual 0.92s cubic-bezier(0.22, 1, 0.36, 1) 0.52s forwards;
          will-change: stroke-dashoffset;
        }

        /* 1,000–1,900ms: Steam 1 Left (duration: 0.85s, delay: 1.00s -> ends 1.85s) */
        .chop4s-steam-1 {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: chopSteamRiseNatural 0.85s cubic-bezier(0.25, 1, 0.5, 1) 1.00s forwards;
          will-change: stroke-dashoffset, transform;
        }

        /* 1,000–1,900ms: Steam 2 Center (duration: 0.88s, delay: 1.04s -> ends 1.92s) */
        .chop4s-steam-2 {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: chopSteamRiseNatural 0.88s cubic-bezier(0.25, 1, 0.5, 1) 1.04s forwards;
          will-change: stroke-dashoffset, transform;
        }

        /* 1,000–1,900ms: Steam 3 Right (duration: 0.85s, delay: 1.08s -> ends 1.93s) */
        .chop4s-steam-3 {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: chopSteamRiseNatural 0.85s cubic-bezier(0.25, 1, 0.5, 1) 1.08s forwards;
          will-change: stroke-dashoffset, transform;
        }

        /* 1,500–2,600ms: CHOP Wordmark (duration: 1.10s, delay: 1.50s -> ends 2.60s) */
        .chop4s-wordmark {
          opacity: 0;
          animation: chopWordmarkRevealSmooth 1.10s cubic-bezier(0.16, 1, 0.3, 1) 1.50s forwards;
          will-change: opacity, transform;
        }

        /* 2,400–3,300ms: Tagline & Location (duration: 0.90s, delay: 2.40s -> ends 3.30s) */
        .chop4s-tagline {
          opacity: 0;
          animation: chopTaglineRevealSmooth 0.90s cubic-bezier(0.22, 1, 0.36, 1) 2.40s forwards;
          will-change: opacity, transform;
        }

        /* Top Progress Bar: 0ms to 3,300ms */
        .chop4s-progress {
          animation: chopProgressPaced 3.30s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }
      `}</style>

      {/* ── Top Bar: Subtle Progress Line & Instant Touch-Friendly Skip Button ── */}
      <header className="w-full max-w-xl px-6 pt-5 sm:pt-7 flex items-center justify-between relative z-20">
        <div className="flex-1 max-w-[120px] sm:max-w-[180px] bg-[#E6E2DA]/80 h-1 rounded-full overflow-hidden">
          <div className="h-full bg-[#C45B3A] rounded-full chop4s-progress" />
        </div>

        {/* Immediate Skip Button — Always Interactive */}
        <button
          type="button"
          onClick={() => handleFinish(true)}
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#141414] hover:text-[#C45B3A] bg-white/95 hover:bg-white border border-[#E6E2DA] hover:border-[#141414]/30 py-2 px-4 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer min-h-[40px]"
          aria-label="Skip welcome animation"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5 text-[#C45B3A]" />
        </button>
      </header>

      {/* ── Center Stage: Authentic Hand-Drawn Cultural Sketching SVG ── */}
      <main className="w-full max-w-md sm:max-w-lg px-4 flex flex-col items-center justify-center my-auto relative">
        <div className="w-68 h-68 sm:w-80 sm:h-80 md:w-88 md:h-88 relative flex items-center justify-center">
          <svg
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-xs"
            aria-hidden="true"
          >
            {/* Guide line & connector */}
            <line
              x1="60"
              y1="220"
              x2="260"
              y2="220"
              stroke="#E6E2DA"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="chop4s-accent"
            />
            <path
              d="M 50 170 C 80 120, 240 120, 270 170"
              stroke="#C45B3A"
              strokeWidth="1.8"
              strokeDasharray="3 3"
              className="chop4s-accent"
              opacity="0.75"
            />

            {/* Cultural Food Details (Pepper, Fish, Plantain, Spoon, Rice) */}
            {/* Ata Rodo (Pepper Outline) */}
            <g className="chop4s-accent">
              <path
                d="M 70 120 C 60 105, 75 90, 85 95 C 95 100, 100 115, 85 130 C 78 138, 72 135, 70 120 Z"
                stroke="#C45B3A"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 85 95 C 88 88, 92 85, 96 86"
                stroke="#141414"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Fish Outline */}
            <g className="chop4s-accent">
              <path
                d="M 220 100 C 240 92, 260 105, 255 118 C 248 126, 230 120, 220 100 Z"
                stroke="#141414"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 255 110 L 268 104 M 255 110 L 268 116"
                stroke="#141414"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="230" cy="105" r="1.5" fill="#141414" />
            </g>

            {/* Golden Plantain */}
            <g className="chop4s-accent">
              <path
                d="M 52 175 C 55 160, 68 155, 75 165 C 82 175, 70 190, 58 185 Z"
                stroke="#C45B3A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Traditional Serving Spoon */}
            <g className="chop4s-accent">
              <path
                d="M 245 160 C 255 155, 265 165, 260 175 C 255 182, 246 178, 245 160 Z"
                stroke="#141414"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 258 175 L 275 200"
                stroke="#141414"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Rice grains */}
            <g className="chop4s-accent">
              <path d="M 105 145 C 108 143, 111 146, 110 148" stroke="#141414" strokeWidth="2" strokeLinecap="round" />
              <path d="M 215 145 C 218 143, 221 146, 220 148" stroke="#141414" strokeWidth="2" strokeLinecap="round" />
              <path d="M 160 140 C 162 138, 164 140, 163 142" stroke="#C45B3A" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* 400–1,500ms: Hand-Drawn Ceramic Bowl */}
            {/* Bowl Rim */}
            <path
              d="M 75 185 C 115 170, 205 170, 245 185"
              stroke="#141414"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chop4s-bowl-rim"
            />
            {/* Bowl Body Contour */}
            <path
              d="M 78 185 C 88 235, 232 235, 242 185"
              stroke="#141414"
              strokeWidth="3.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chop4s-bowl-body"
            />
            {/* Subtle Terracotta Glaze Line on Bowl */}
            <path
              d="M 95 198 C 125 220, 195 220, 225 198"
              stroke="#C45B3A"
              strokeWidth="2"
              strokeLinecap="round"
              className="chop4s-bowl-accent"
            />
            {/* Sturdy Foot */}
            <path
              d="M 125 235 L 195 235"
              stroke="#141414"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="chop4s-bowl-foot"
            />

            {/* 1,000–1,900ms: Three Rising Steam Strokes */}
            {/* Steam 1: Left ribbon */}
            <path
              d="M 125 165 C 118 145, 132 130, 122 105"
              stroke="#C45B3A"
              strokeWidth="3"
              strokeLinecap="round"
              className="chop4s-steam-1"
            />
            {/* Steam 2: Center elevated graceful ribbon */}
            <path
              d="M 160 158 C 154 135, 168 120, 158 92"
              stroke="#C45B3A"
              strokeWidth="3.2"
              strokeLinecap="round"
              className="chop4s-steam-2"
            />
            {/* Steam 3: Right delicate ribbon */}
            <path
              d="M 195 165 C 202 145, 188 130, 198 105"
              stroke="#C45B3A"
              strokeWidth="3"
              strokeLinecap="round"
              className="chop4s-steam-3"
            />
          </svg>
        </div>

        {/* 1,500–2,600ms: CHOP Wordmark Reveal */}
        <div className="chop4s-wordmark flex flex-col items-center mt-2 sm:mt-3">
          <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#141414] leading-none">
            CHOP<span className="text-[#C45B3A]">.</span>
          </span>
        </div>

        {/* 2,400–3,300ms: Brand Message & Tagline */}
        <div className="chop4s-tagline flex flex-col items-center mt-2.5 sm:mt-3.5 space-y-0.5">
          <p className="font-display text-sm sm:text-base font-bold text-[#141414] tracking-wide">
            Good food, closer to you.
          </p>
          <p className="text-[10px] sm:text-xs font-semibold text-[#77736C] uppercase tracking-widest">
            Ijebu Ode &bull; Ijagun
          </p>
        </div>
      </main>

      {/* ── Bottom Section: Subtle Cultural Anchor ── */}
      <footer className="w-full max-w-md px-6 pb-6 sm:pb-8 text-center relative z-20">
        <span className="text-[10px] sm:text-[11px] font-medium text-[#77736C]/70 tracking-wider uppercase">
          Fresh &bull; Local &bull; Verified
        </span>
      </footer>
    </div>
  );
};
