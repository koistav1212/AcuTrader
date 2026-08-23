"use client";

import React, { useRef } from "react";
import { CinematicScene } from "../components/CinematicScene";

export function ThesisScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  return (
    <CinematicScene
      index={7}
      image="/assests/img1.png"
      position="right"
      title="INVESTMENT THESIS."
    >
      <div
        ref={sceneRef}
        className="absolute inset-0 overflow-hidden w-full h-full"
      >
        {/* =====================================================
            LEFT — CONSOLIDATED THESIS PANEL
        ====================================================== */}

        <div
          className="
            thesis-panel
            absolute
            left-[13%]
            top-[30%]
            z-20
            w-[390px]
            border
            border-white/10
            bg-[#171c24]/95
            px-7
            py-6
            shadow-[0_25px_70px_rgba(0,0,0,0.28)]
            
          "
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate-400">
                CONSOLIDATED INVESTMENT READ
              </p>

              <h2 className="mt-3 font-serif text-[42px] leading-[0.9] text-white">
                APPLE
                <br />
                INC.
              </h2>

              <p className="mt-3 font-mono text-[10px] tracking-[0.28em] text-slate-400">
                AAPL / NASDAQ / EQUITY RESEARCH
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-secondary)] font-medium">
                PLATFORM
                <br />
                CONFIDENCE
              </p>

              <p className="confidence-number mt-2 font-serif text-[46px] leading-none text-[#8fb6f4]">
                78%
              </p>
            </div>
          </div>

          {/* STATUS BLOCKS */}
          <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
            <div className="border border-[#4d8ee8]/60 bg-black/10 px-3 py-3">
              <span className="block font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">TECHNICAL</span>
              <span className="mt-2 block font-mono text-[10px] tracking-[0.2em] text-[#76a9f7]">BULLISH</span>
            </div>

            <div className="border border-[#4fae82]/60 bg-black/10 px-3 py-3">
              <span className="block font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">FLOW</span>
              <span className="mt-2 block font-mono text-[10px] tracking-[0.2em] text-[#72d69e]">POSITIVE</span>
            </div>

            <div className="border border-[#d48642]/60 bg-black/10 px-3 py-3">
              <span className="block font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">RISK</span>
              <span className="mt-2 block font-mono text-[10px] tracking-[0.2em] text-[#e3a363]">MANAGED</span>
            </div>
          </div>

          {/* CONFIDENCE TRAJECTORY */}
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)] font-medium">
                Confidence trajectory
              </p>

              <span className="font-mono text-[10px] text-[#72d69e]">
                +12.4%
              </span>
            </div>

            <div className="relative h-[72px] border-b border-l border-white/[0.12]">
              <svg
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 50"
              >
                <line
                  x1="0"
                  y1="25"
                  x2="100"
                  y2="25"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />

                <path
                  className="chart-path"
                  d="M0,43
                     C12,42 18,38 28,31
                     C38,23 48,20 58,25
                     C68,30 76,28 84,20
                     C91,14 96,8 100,4"
                  fill="none"
                  stroke="#8fb6f4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* POSITION */}
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)] font-medium">
                Position bias
              </p>

              <p className="mt-2 font-mono text-[10px] tracking-[0.22em] text-[#72d69e]">
                LONG / CONSTRUCTIVE
              </p>
            </div>

            <button
              className="
                border
                border-white/15
                bg-white/[0.03]
                px-5
                py-3
                font-mono
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-slate-300
                transition-all
                duration-300
                hover:border-[#8fb6f4]/60
                hover:bg-[#8fb6f4]/10
              "
            >
              VIEW STRATEGY →
            </button>
          </div>
        </div>

        {/* =====================================================
            FLOATING KPI — TECHNICAL
        ====================================================== */}

        <div
          className="
            thesis-kpi
            absolute
            left-[43%]
            top-[32%]
            z-20
            w-[180px]
            border
            border-blue-400/30
            bg-[#182131]/90
            p-5
            
          "
        >
          <div className="h-[2px] w-9 bg-blue-400" />

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-blue-300">
            Technical Alignment
          </p>

          <p className="mt-2 font-serif text-[30px] text-white">
            4 / 5
          </p>

          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">
            timeframes bullish
          </p>
        </div>

        {/* =====================================================
            FLOATING KPI — INSTITUTIONAL FLOW
        ====================================================== */}

        <div
          className="
            thesis-kpi
            absolute
            left-[61%]
            top-[23%]
            z-20
            w-[180px]
            border
            border-emerald-400/30
            bg-[#16261f]/90
            p-5
            
          "
        >
          <div className="h-[2px] w-9 bg-emerald-400" />

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
            Institutional Flow
          </p>

          <p className="mt-2 font-serif text-[30px] text-white">
            +18%
          </p>

          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">
            accumulation trend
          </p>
        </div>

        {/* =====================================================
            FLOATING KPI — RISK REWARD
        ====================================================== */}

        <div
          className="
            thesis-kpi
            absolute
            right-[8%]
            top-[36%]
            z-20
            w-[180px]
            border
            border-orange-400/30
            bg-[#2a2018]/90
            p-5
            
          "
        >
          <div className="h-[2px] w-9 bg-orange-400" />

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-orange-300">
            Risk / Reward
          </p>

          <p className="mt-2 font-serif text-[30px] text-white">
            2.8x
          </p>

          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">
            favorable structure
          </p>
        </div>

        {/* =====================================================
            FLOATING KPI — MARKET REGIME
        ====================================================== */}

        <div
          className="
            thesis-kpi
            absolute
            left-[49%]
            bottom-[13%]
            z-20
            w-[180px]
            border
            border-violet-400/30
            bg-[#1d172b]/90
            p-5
            
          "
        >
          <div className="h-[2px] w-9 bg-violet-400" />

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-violet-300">
            Market Regime
          </p>

          <p className="mt-2 font-serif text-[28px] text-white">
            BULLISH
          </p>

          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">
            risk appetite stable
          </p>
        </div>

        {/* =====================================================
            FLOATING KPI — CATALYST SCORE
        ====================================================== */}

        <div
          className="
            thesis-kpi
            absolute
            right-[15%]
            bottom-[12%]
            z-20
            w-[180px]
            border
            border-emerald-400/30
            bg-[#13251e]/90
            p-5
            
          "
        >
          <div className="h-[2px] w-9 bg-emerald-400" />

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
            Catalyst Score
          </p>

          <p className="mt-2 font-serif text-[30px] text-white">
            7.8
          </p>

          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">
            next 90 days
          </p>
        </div>

        {/* =====================================================
            CONNECTING SIGNAL LINES
        ====================================================== */}

        <svg
          className="
            pointer-events-none
            absolute
            inset-0
            z-[15]
            h-full
            w-full
          "
          preserveAspectRatio="none"
        >
          <path
            d="M41 48 C48 48, 48 31, 53 31"
            fill="none"
            stroke="rgba(96,165,250,0.6)"
            strokeWidth="1"
          />

          <circle
            cx="41%"
            cy="48%"
            r="4"
            fill="#60a5fa"
          />

          <path
            d="M52 49 C59 43, 65 34, 79 28"
            fill="none"
            stroke="rgba(251,146,60,0.7)"
            strokeWidth="1"
          />

          <circle
            cx="52%"
            cy="49%"
            r="4"
            fill="#fb923c"
          />

          <path
            d="M45 69 C56 74, 64 76, 75 77"
            fill="none"
            stroke="rgba(139,92,246,0.7)"
            strokeWidth="1"
          />

          <circle
            cx="45%"
            cy="69%"
            r="4"
            fill="#8b5cf6"
          />

          <path
            d="M47 67 C56 58, 63 58, 73 70"
            fill="none"
            stroke="rgba(74,222,128,0.6)"
            strokeWidth="1"
          />

          <circle
            cx="47%"
            cy="67%"
            r="4"
            fill="#4ade80"
          />
        </svg>

        {/* =====================================================
            AMBIENT OVERLAY
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[5]
            bg-[radial-gradient(circle_at_58%_45%,rgba(91,130,180,0.06),transparent_32%)]
          "
        />
      </div>
    </CinematicScene>
  );
}

/* ============================================================
   SIGNAL BOX
============================================================ */

function SignalBox({
  tone,
  label,
  value,
}: {
  tone: "blue" | "green" | "orange";
  label: string;
  value: string;
}) {
  const tones = {
    blue: {
      border: "border-blue-400/35",
      text: "text-blue-300",
    },

    green: {
      border: "border-emerald-400/35",
      text: "text-emerald-300",
    },

    orange: {
      border: "border-orange-400/35",
      text: "text-orange-300",
    },
  };

  return (
    <div
      className={`
        border
        ${tones[tone].border}
        bg-black/10
        px-3
        py-3
      `}
    >
      <p className="font-mono text-[10px] tracking-[0.18em] text-[var(--text-secondary)] font-medium">
        {label}
      </p>

      <p
        className={`
          mt-2
          font-mono
          text-[10px]
          tracking-[0.2em]
          ${tones[tone].text}
        `}
      >
        {value}
      </p>
    </div>
  );
}