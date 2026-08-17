"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CinematicScene } from "../components/CinematicScene";

type Tone = "blue" | "purple" | "green" | "orange" | "red";

const toneStyles: Record<
  Tone,
  {
    color: string;
    border: string;
    glow: string;
    soft: string;
  }
> = {
  blue: {
    color: "#3b82f6",
    border: "rgba(59,130,246,0.55)",
    glow: "rgba(59,130,246,0.35)",
    soft: "rgba(59,130,246,0.10)",
  },

  purple: {
    color: "#8b5cf6",
    border: "rgba(139,92,246,0.55)",
    glow: "rgba(139,92,246,0.35)",
    soft: "rgba(139,92,246,0.10)",
  },

  green: {
    color: "#22c55e",
    border: "rgba(34,197,94,0.55)",
    glow: "rgba(34,197,94,0.35)",
    soft: "rgba(34,197,94,0.10)",
  },

  orange: {
    color: "#f97316",
    border: "rgba(249,115,22,0.55)",
    glow: "rgba(249,115,22,0.35)",
    soft: "rgba(249,115,22,0.10)",
  },

  red: {
    color: "#ef4444",
    border: "rgba(239,68,68,0.55)",
    glow: "rgba(239,68,68,0.35)",
    soft: "rgba(239,68,68,0.10)",
  },
};

const SIGNALS = [
  {
    id: "rsi",
    label: "MOMENTUM",
    title: "RSI (14)",
    value: "72.4",
    context: "Overbought momentum",
    tone: "blue" as Tone,
    x: "16%",
    y: "25%",
    depth: 1.8,
  },

  {
    id: "macd",
    label: "TREND",
    title: "MACD HISTOGRAM",
    value: "+1.2",
    context: "Bullish crossover",
    tone: "purple" as Tone,
    x: "13%",
    y: "52%",
    depth: 1.2,
  },

  {
    id: "support",
    label: "PRICE LEVEL",
    title: "SUPPORT",
    value: "$187.40",
    context: "4.1% below spot",
    tone: "green" as Tone,
    x: "16%",
    y: "79%",
    depth: 0.8,
  },

  {
    id: "volatility",
    label: "RISK",
    title: "VOLATILITY",
    value: "14.2",
    context: "Controlled expansion",
    tone: "orange" as Tone,
    x: "52%",
    y: "25%",
    depth: 0.7,
  },

  {
    id: "bollinger",
    label: "RANGE",
    title: "BOLLINGER %B",
    value: "0.82",
    context: "Near upper band",
    tone: "red" as Tone,
    x: "55%",
    y: "52%",
    depth: 1.1,
  },

  {
    id: "volume",
    label: "PARTICIPATION",
    title: "RELATIVE VOLUME",
    value: "1.8x",
    context: "vs. 30-day average",
    tone: "green" as Tone,
    x: "52%",
    y: "79%",
    depth: 1.5,
  },
];

export function SynthesisScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".signal-card");
      const lines = gsap.utils.toArray<SVGPathElement>(".signal-line");
      const dots = gsap.utils.toArray<HTMLElement>(".signal-dot");

      /* -------------------------------------------------------
         INITIAL STATES
      ------------------------------------------------------- */

      gsap.set(cards, {
        opacity: 0,
        scale: 0.75,
        filter: "blur(10px)",
      });

      gsap.set(".synthesis-core", {
        opacity: 0,
        scale: 0.55,
        filter: "blur(10px)",
      });

      gsap.set(dots, {
        scale: 0,
        opacity: 0,
      });

      /* -------------------------------------------------------
         SVG LINE DRAWING
      ------------------------------------------------------- */

      lines.forEach((line) => {
        const length = line.getTotalLength();

        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });

        gsap.to(line, {
          strokeDashoffset: 0,
          opacity: 0.7,
          ease: "power2.out",

          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "center center",
            scrub: 1,
          },
        });
      });

      /* -------------------------------------------------------
         SIGNAL CARD REVEAL
      ------------------------------------------------------- */

      cards.forEach((card, index) => {
        const side =
          index % 2 === 0 ? -1 : 1;

        gsap.fromTo(
          card,
          {
            x: side * 90,
            y: 45,
            rotateZ: side * 3,
            opacity: 0,
            scale: 0.75,
            filter: "blur(10px)",
          },
          {
            x: 0,
            y: 0,
            rotateZ: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "power3.out",

            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "center center",
              scrub: 1,
            },
          }
        );
      });

      /* -------------------------------------------------------
         CORE REVEAL
      ------------------------------------------------------- */

      gsap.to(".synthesis-core", {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",

        ease: "back.out(1.4)",

        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 62%",
          end: "center center",
          scrub: 1,
        },
      });

      /* -------------------------------------------------------
         CONNECTION DOTS
      ------------------------------------------------------- */

      gsap.to(dots, {
        scale: 1,
        opacity: 1,
        stagger: 0.08,

        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 58%",
          end: "center center",
          scrub: 1,
        },
      });

      /* -------------------------------------------------------
         SUBTLE FLOATING MOTION
      ------------------------------------------------------- */

      cards.forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -9 : 9,
          duration: 2.5 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.15,
        });
      });

      /* -------------------------------------------------------
         PARALLAX
      ------------------------------------------------------- */

      const onMove = (event: MouseEvent) => {
        if (!containerRef.current) return;

        const rect =
          containerRef.current.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        cards.forEach((card) => {
          const depth =
            Number(card.dataset.depth || 1);

          gsap.to(card, {
            x: x * depth * 18,
            y: y * depth * 14,
            duration: 1.2,
            ease: "power3.out",
          });
        });

        gsap.to(".synthesis-core", {
          x: x * 10,
          y: y * 8,
          duration: 1.3,
          ease: "power3.out",
        });

        gsap.to(".network-layer", {
          x: x * -7,
          y: y * -5,
          duration: 1.5,
          ease: "power3.out",
        });
      };

      const element = containerRef.current;

      element?.addEventListener("mousemove", onMove);

      return () => {
        element?.removeEventListener(
          "mousemove",
          onMove
        );
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <CinematicScene
      index={5}
      image="/assests/img5.png"
      position="right"
      title="MULTIPLE SIGNALS. ONE MARKET THESIS."
    >
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          perspective: "1800px",
        }}
      >
        {/* =====================================================
            BACKGROUND CONTEXT
        ====================================================== */}

        <div className="absolute left-[4%] bottom-[6%] z-[5] max-w-[240px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-slate-400">
            MULTI-SOURCE SYNTHESIS
          </p>

          <p className="mt-3 font-mono text-[10px] leading-relaxed text-[var(--text-secondary)] font-medium">
            Technical momentum, volatility,
            price structure and participation
            are evaluated simultaneously.
          </p>
        </div>

        {/* =====================================================
            NETWORK SVG
        ====================================================== */}

        <svg
          className="
            network-layer
            absolute
            inset-0
            z-10
            h-full
            w-full
            pointer-events-none
          "
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          {/* Center point approximately left of subject */}

          <path
            className="signal-line"
            d="M 256 225 C 320 280, 480 380, 544 468"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.2"
          />

          <path
            className="signal-line"
            d="M 208 468 C 300 468, 420 468, 544 468"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.2"
          />

          <path
            className="signal-line"
            d="M 256 711 C 320 650, 480 550, 544 468"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.2"
          />

          <path
            className="signal-line"
            d="M 832 225 C 780 280, 620 380, 544 468"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.2"
          />

          <path
            className="signal-line"
            d="M 880 468 C 780 468, 660 468, 544 468"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.2"
          />

          <path
            className="signal-line"
            d="M 832 711 C 780 650, 620 550, 544 468"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.2"
          />

          {/* CENTER NODE */}

          <circle
            cx="544"
            cy="468"
            r="6"
            fill="rgba(255,255,255,0.9)"
          />

          <circle
            cx="544"
            cy="468"
            r="14"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />
        </svg>

        {/* =====================================================
            CENTRAL SYNTHESIS CIRCLE
        ====================================================== */}

        <div
          className="
            synthesis-core
            absolute
            left-[34%]
            top-[52%]
            z-30
            flex
            h-[178px]
            w-[178px]
            -translate-x-1/2
            -translate-y-1/2
            flex-col
            items-center
            justify-center
            rounded-full
            border
          "
        >
          {/* Glow rings */}

          <div className="absolute inset-[-14px] rounded-full border border-white/[0.08]" />

          <div className="absolute inset-[-32px] rounded-full border border-white/[0.04]" />

          <div
            className="
              absolute
              inset-0
              rounded-full
              bg-black/45
              
            "
          />

          {/* Inner content */}

          <div className="relative z-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-400">
              SYNTHESIS
            </p>

            <p className="mt-3 font-serif text-[30px] text-white">
              BULLISH
            </p>

            <div className="mx-auto mt-3 h-px w-[54px] bg-white/20" />

            <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-slate-400">
              AAPL · 84%
            </p>
          </div>

          {/* Pulse */}

          <div className="core-pulse absolute inset-0 rounded-full border border-orange-400/40" />
        </div>

        {/* =====================================================
            SIGNAL CARDS
        ====================================================== */}

        {SIGNALS.map((signal) => (
          <SignalCard
            key={signal.id}
            {...signal}
          />
        ))}

        {/* =====================================================
            SYNTHESIS RESULT TEXT
        ====================================================== */}

        <div
          className="
            absolute
            left-[34%]
            bottom-[6%]
            z-20
            w-[310px]
            -translate-x-1/2
            text-center
          "
        >
          <div className="mx-auto h-px w-[55px] bg-white/20" />

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--text-secondary)] font-medium">
            CONSOLIDATED THESIS
          </p>

          <p className="mt-3 font-serif text-[20px] leading-[1.35] text-white/85">
            Momentum, trend and participation
            converge into a structured
            bullish market read.
          </p>

          <p className="mt-3 font-mono text-[10px] leading-relaxed text-[var(--text-secondary)] font-medium">
            6 independent measurements ·
            confidence adjusted ·
            risk weighted
          </p>
        </div>
      </div>

      <style jsx>{`
        .signal-card {
          will-change: transform, opacity, filter;
        }

        .network-layer {
          will-change: transform;
        }

        .synthesis-core {
          will-change: transform, opacity, filter;

          background:
            radial-gradient(
              circle at 30% 25%,
              rgba(255, 255, 255, 0.12),
              transparent 38%
            ),
            radial-gradient(
              circle at center,
              rgba(30, 30, 35, 0.96),
              rgba(5, 5, 7, 0.96)
            );

          box-shadow:
            0 0 45px rgba(255, 255, 255, 0.05),
            0 0 90px rgba(249, 115, 22, 0.08),
            inset 0 0 30px rgba(255, 255, 255, 0.04);
        }

        .core-pulse {
          animation: corePulse 3.5s ease-in-out infinite;
        }

        @keyframes corePulse {
          0% {
            transform: scale(0.94);
            opacity: 0.15;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.65;
          }

          100% {
            transform: scale(0.94);
            opacity: 0.15;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .core-pulse {
            animation: none;
          }
        }
      `}</style>
    </CinematicScene>
  );
}

/* ============================================================
   SIGNAL CARD
============================================================ */

function SignalCard({
  label,
  title,
  value,
  context,
  tone,
  x,
  y,
  depth,
}: {
  label: string;
  title: string;
  value: string;
  context: string;
  tone: Tone;
  x: string;
  y: string;
  depth: number;
}) {
  const style = toneStyles[tone];

  return (
    <div
      className="
        signal-card
        absolute
        z-20
        w-[185px]
        overflow-hidden
        rounded-[3px]
        border
        px-5
        py-4
        
      "
      data-depth={depth}
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        borderColor: style.border,

        background: `
          linear-gradient(
            135deg,
            ${style.soft},
            rgba(5, 7, 10, 0.88)
          )
        `,

        boxShadow: `
          0 16px 50px rgba(0,0,0,0.35),
          0 0 28px ${style.glow}
        `,
      }}
    >
      {/* TOP ACCENT */}

      <div
        className="absolute left-0 top-0 h-[2px] w-full"
        style={{
          background: style.color,
          boxShadow: `0 0 12px ${style.glow}`,
        }}
      />

      <p
        className="font-mono text-[10px] uppercase tracking-[0.28em]"
        style={{
          color: style.color,
        }}
      >
        {label}
      </p>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
        {title}
      </p>

      <div className="mt-3 flex items-end justify-between">
        <p className="font-serif text-[26px] leading-none text-white">
          {value}
        </p>

        <div
          className="mb-1 h-[6px] w-[6px] rounded-full signal-dot"
          style={{
            background: style.color,
            boxShadow: `0 0 10px ${style.glow}`,
          }}
        />
      </div>

      <p className="mt-3 border-t border-white/[0.08] pt-3 font-mono text-[10px] leading-relaxed text-white/40">
        {context}
      </p>
    </div>
  );
}