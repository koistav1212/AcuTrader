"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CinematicScene } from "../components/CinematicScene";
import { DepthLayer } from "../components/DepthLayer";

type NodeTone =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red"
  | "neutral";

const toneStyles: Record<
  NodeTone,
  {
    color: string;
    border: string;
    glow: string;
    background: string;
  }
> = {
  blue: {
    color: "#60a5fa",
    border: "rgba(96,165,250,0.6)",
    glow: "0 0 35px rgba(59,130,246,0.22)",
    background:
      "linear-gradient(145deg, rgba(30,58,138,0.24), rgba(8,15,30,0.72))",
  },

  purple: {
    color: "#a78bfa",
    border: "rgba(167,139,250,0.6)",
    glow: "0 0 35px rgba(139,92,246,0.22)",
    background:
      "linear-gradient(145deg, rgba(76,29,149,0.25), rgba(8,15,30,0.72))",
  },

  green: {
    color: "#4ade80",
    border: "rgba(74,222,128,0.6)",
    glow: "0 0 35px rgba(34,197,94,0.22)",
    background:
      "linear-gradient(145deg, rgba(20,83,45,0.25), rgba(8,15,30,0.72))",
  },

  orange: {
    color: "#fb923c",
    border: "rgba(251,146,60,0.6)",
    glow: "0 0 35px rgba(249,115,22,0.24)",
    background:
      "linear-gradient(145deg, rgba(124,45,18,0.25), rgba(8,15,30,0.72))",
  },

  red: {
    color: "#fb7185",
    border: "rgba(251,113,133,0.6)",
    glow: "0 0 35px rgba(244,63,94,0.22)",
    background:
      "linear-gradient(145deg, rgba(127,29,29,0.25), rgba(8,15,30,0.72))",
  },

  neutral: {
    color: "#d1d5db",
    border: "rgba(255,255,255,0.28)",
    glow: "0 0 30px rgba(255,255,255,0.1)",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(10,15,25,0.75))",
  },
};

export function CorrelationScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>(
        ".correlation-node"
      );

      const paths = gsap.utils.toArray<SVGPathElement>(
        ".correlation-path"
      );

      const particles = gsap.utils.toArray<HTMLElement>(
        ".correlation-particle"
      );

      const kpis = gsap.utils.toArray<HTMLElement>(
        ".correlation-kpi"
      );

      /* -----------------------------------------------
         INITIAL STATE
      ------------------------------------------------ */

      gsap.set(nodes, {
        opacity: 0,
        scale: 0.65,
        filter: "blur(8px)",
      });

      gsap.set(kpis, {
        opacity: 0,
        y: 25,
        filter: "blur(8px)",
      });

      paths.forEach((path) => {
        const length = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      /* -----------------------------------------------
         NODE ENTRANCE
      ------------------------------------------------ */

      gsap.to(nodes, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.1,
        ease: "back.out(1.6)",

        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "top 25%",
          scrub: 1,
        },
      });

      /* -----------------------------------------------
         KPI ENTRANCE
      ------------------------------------------------ */

      gsap.to(kpis, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.08,
        ease: "power3.out",

        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 62%",
          end: "top 30%",
          scrub: 1,
        },
      });

      /* -----------------------------------------------
         CONNECTION DRAWING
      ------------------------------------------------ */

      paths.forEach((path, index) => {
        gsap.to(path, {
          strokeDashoffset: 0,

          ease: "power2.out",

          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${55 - index * 3}%`,
            end: "center center",
            scrub: 1,
          },
        });
      });

      /* -----------------------------------------------
         FLOATING PARTICLES
      ------------------------------------------------ */

      particles.forEach((particle, index) => {
        gsap.to(particle, {
          x: `${(index % 2 === 0 ? 1 : -1) * (15 + index * 4)}`,
          y: `${index % 2 === 0 ? -18 : 18}`,
          duration: 2.5 + index * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      /* -----------------------------------------------
         INDIVIDUAL NODE FLOATING MOTION
      ------------------------------------------------ */

      nodes.forEach((node, index) => {
        if (node.classList.contains("target-node")) return;

        gsap.to(node, {
          y: index % 2 === 0 ? -10 : 10,
          x: index % 3 === 0 ? 5 : -4,
          duration: 3.5 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      /* -----------------------------------------------
         TARGET PULSE
      ------------------------------------------------ */

      gsap.to(".target-ring", {
        scale: 1.25,
        opacity: 0,
        duration: 2.2,
        repeat: -1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <CinematicScene
      index={4}
      image="/assests/img4.png"
      position="center"
      title="CORRELATION DETECTION."
    >
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
      >
        {/* =====================================================
            BACKGROUND DATA CONTEXT
        ====================================================== */}

        <DepthLayer
          depth="background"
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
        >
          <div className="absolute left-[6%] top-[18%]">
            <p className="font-mono text-[12px] tracking-[0.2em] text-slate-500">
              MULTIVARIATE SIGNAL NETWORK
            </p>

            <p className="mt-2 max-w-[260px] text-[14px] leading-relaxed text-slate-400">
              Detecting hidden relationships between macro,
              sector and market-level variables.
            </p>
          </div>

          <div className="absolute right-[6%] bottom-[12%] text-right">
            <p className="font-mono text-[12px] tracking-[0.18em] text-slate-500">
              LOOKBACK: 90 DAYS
            </p>

            <p className="mt-2 font-mono text-[12px] tracking-[0.18em] text-slate-500">
              REFRESH: 15 MINUTES
            </p>
          </div>

          <span className="absolute left-[42%] top-[14%] font-mono text-[12px] tracking-[0.2em] text-slate-500">
            CORRELATION MATRIX / LIVE
          </span>

          <span className="absolute right-[20%] top-[20%] font-mono text-[12px] tracking-[0.18em] text-slate-500">
            CONFIDENCE &gt; 0.80
          </span>
        </DepthLayer>

        {/* =====================================================
            CONNECTION NETWORK
        ====================================================== */}

        <svg
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
            h-full
            w-full
          "
          preserveAspectRatio="none"
        >
          {/* CPI → TARGET */}

          <path
            className="correlation-path"
            d="M 20% 68% C 32% 63%, 38% 59%, 50% 57%"
            fill="none"
            stroke="rgba(96,165,250,0.55)"
            strokeWidth="1.2"
          />

          {/* YIELD → TARGET */}

          <path
            className="correlation-path"
            d="M 31% 39% C 38% 42%, 43% 49%, 50% 57%"
            fill="none"
            stroke="rgba(167,139,250,0.5)"
            strokeWidth="1.2"
            strokeDasharray="5 6"
          />

          {/* TARGET → TECH */}

          <path
            className="correlation-path"
            d="M 50% 57% C 57% 46%, 61% 34%, 69% 29%"
            fill="none"
            stroke="rgba(74,222,128,0.55)"
            strokeWidth="1.2"
          />

          {/* TARGET → SUPPLY */}

          <path
            className="correlation-path"
            d="M 50% 57% C 63% 58%, 72% 60%, 81% 66%"
            fill="none"
            stroke="rgba(251,146,60,0.55)"
            strokeWidth="1.2"
          />

          {/* TECH → SUPPLY */}

          <path
            className="correlation-path"
            d="M 69% 29% C 76% 37%, 79% 50%, 81% 66%"
            fill="none"
            stroke="rgba(251,113,133,0.35)"
            strokeWidth="1"
            strokeDasharray="3 7"
          />

          {/* YIELD → TECH */}

          <path
            className="correlation-path"
            d="M 31% 39% C 46% 24%, 58% 21%, 69% 29%"
            fill="none"
            stroke="rgba(167,139,250,0.22)"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
        </svg>

        {/* =====================================================
            FLOATING SIGNAL PARTICLES
        ====================================================== */}

        <div
          className="
            correlation-particle
            absolute
            left-[36%]
            top-[48%]
            z-20
            h-2
            w-2
            rounded-full
            bg-blue-400
            shadow-[0_0_18px_rgba(96,165,250,0.9)]
          "
        />

        <div
          className="
            correlation-particle
            absolute
            left-[62%]
            top-[42%]
            z-20
            h-2
            w-2
            rounded-full
            bg-green-400
            shadow-[0_0_18px_rgba(74,222,128,0.9)]
          "
        />

        <div
          className="
            correlation-particle
            absolute
            left-[72%]
            top-[52%]
            z-20
            h-2
            w-2
            rounded-full
            bg-orange-400
            shadow-[0_0_18px_rgba(251,146,60,0.9)]
          "
        />

        <div
          className="
            correlation-particle
            absolute
            left-[42%]
            top-[34%]
            z-20
            h-2
            w-2
            rounded-full
            bg-purple-400
            shadow-[0_0_18px_rgba(167,139,250,0.9)]
          "
        />

        {/* =====================================================
            CORRELATION NODES
        ====================================================== */}

        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* LEFT SIDE */}

          <CorrelationNode
            x="20%"
            y="68%"
            label="CONSUMER CPI"
            value="-0.41"
            tone="blue"
            size="medium"
            metric="INVERSE"
          />

          <CorrelationNode
            x="31%"
            y="39%"
            label="YIELD CURVE"
            value="-0.85"
            tone="purple"
            size="medium"
            metric="STRONG"
          />

          {/* CENTRAL TARGET */}

          <TargetNode />

          {/* RIGHT SIDE */}

          <CorrelationNode
            x="69%"
            y="29%"
            label="TECH SECTOR"
            value="+0.92"
            tone="green"
            size="medium"
            metric="HIGH"
          />

          <CorrelationNode
            x="81%"
            y="66%"
            label="SUPPLY CHAIN"
            value="+0.68"
            tone="orange"
            size="medium"
            metric="POSITIVE"
          />

          {/* EXTRA CONTEXT BUBBLES */}

          <CorrelationNode
            x="60%"
            y="74%"
            label="EARNINGS"
            value="+0.74"
            tone="green"
            size="small"
            metric="SIGNAL"
          />

          <CorrelationNode
            x="78%"
            y="43%"
            label="VIX"
            value="-0.57"
            tone="red"
            size="small"
            metric="RISK"
          />

          <CorrelationNode
            x="42%"
            y="77%"
            label="LIQUIDITY"
            value="+0.61"
            tone="blue"
            size="small"
            metric="FLOW"
          />
        </div>

        {/* =====================================================
            LEFT CONTEXT KPI STACK
        ====================================================== */}

        <div className="absolute left-[5%] bottom-[15%] z-40 space-y-3">
          <CorrelationKPI
            label="NETWORK STRENGTH"
            value="0.84"
            detail="HIGH CONVICTION"
            tone="blue"
          />

          <CorrelationKPI
            label="SIGNALS ANALYZED"
            value="24"
            detail="ACTIVE VARIABLES"
            tone="purple"
          />
        </div>

        {/* =====================================================
            RIGHT INTELLIGENCE PANEL
        ====================================================== */}

        <div
          className="
            correlation-kpi
            absolute
            right-[5%]
            bottom-[14%]
            z-40
            w-[250px]
            rounded-sm
            border
            border-white/[0.14]
            bg-black/[0.45]
            p-5
            backdrop-blur-xl
            shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          "
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[12px] font-bold tracking-[0.16em] text-slate-300">
              CORRELATION STATUS
            </p>

            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          <p className="mt-4 text-[22px] font-bold text-white">
            87%
          </p>

          <p className="mt-1 text-[14px] leading-relaxed text-slate-400">
            High-confidence relationships detected across
            macro and market signals.
          </p>

          <div className="mt-4 h-[5px] overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="
                correlation-strength
                h-full
                w-[87%]
                rounded-full
                bg-gradient-to-r
                from-blue-400
                via-purple-400
                to-green-400
              "
            />
          </div>
        </div>

        {/* =====================================================
            TOP RIGHT MICRO KPI
        ====================================================== */}

        <div
          className="
            correlation-kpi
            absolute
            right-[18%]
            top-[17%]
            z-40
            rounded-sm
            border
            border-white/[0.12]
            bg-black/[0.3]
            px-5
            py-4
            backdrop-blur-md
          "
        >
          <p className="font-mono text-[12px] tracking-[0.15em] text-slate-400">
            STRONGEST LINK
          </p>

          <p className="mt-2 text-[22px] font-bold text-green-400">
            +0.92
          </p>

          <p className="mt-1 text-[14px] text-slate-400">
            AAPL ↔ TECH SECTOR
          </p>
        </div>

        {/* =====================================================
            LIVE STATUS
        ====================================================== */}

        <div
          className="
            absolute
            bottom-[9%]
            left-1/2
            z-40
            -translate-x-1/2
            text-center
          "
        >
          <p className="font-mono text-[12px] tracking-[0.22em] text-slate-500">
            RELATIONSHIP ENGINE ACTIVE
          </p>

          <p className="mt-2 text-[14px] text-slate-400">
            Mapping dependencies beyond isolated market signals.
          </p>
        </div>

        {/* =====================================================
            STYLES
        ====================================================== */}

        <style jsx>{`
          .correlation-node {
            will-change: transform, opacity, filter;
          }

          .correlation-path {
            filter: drop-shadow(0 0 4px currentColor);
          }

          .correlation-strength {
            animation: correlationPulse 2.8s ease-in-out infinite;
            transform-origin: left center;
          }

          @keyframes correlationPulse {
            0% {
              transform: scaleX(0.82);
              opacity: 0.65;
            }

            50% {
              transform: scaleX(1);
              opacity: 1;
            }

            100% {
              transform: scaleX(0.9);
              opacity: 0.8;
            }
          }

          .target-core {
            animation: targetGlow 3s ease-in-out infinite;
          }

          @keyframes targetGlow {
            0%,
            100% {
              box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.15),
                0 0 35px rgba(96, 165, 250, 0.15);
            }

            50% {
              box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.3),
                0 0 60px rgba(96, 165, 250, 0.35);
            }
          }

          .target-ring {
            transform-origin: center;
          }

          @media (min-width: 1024px) {
            .small-label {
              font-size: 12px;
            }

            .body-small {
              font-size: 14px;
            }

            .card-title {
              font-size: 14px;
              font-weight: 700;
            }

            .card-value {
              font-size: 22px;
              font-weight: 700;
            }
          }
        `}</style>
      </div>
    </CinematicScene>
  );
}

/* ============================================================
   CORRELATION NODE
============================================================ */

function CorrelationNode({
  x,
  y,
  label,
  value,
  tone,
  metric,
  size = "medium",
}: {
  x: string;
  y: string;
  label: string;
  value: string;
  tone: NodeTone;
  metric: string;
  size?: "small" | "medium";
}) {
  const style = toneStyles[tone];

  const sizeClass =
    size === "small"
      ? "h-[105px] w-[105px]"
      : "h-[140px] w-[140px]";

  return (
    <div
      className={`
        correlation-node
        absolute
        flex
        flex-col
        items-center
        justify-center
        rounded-full
        border
        backdrop-blur-xl
        ${sizeClass}
      `}
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        borderColor: style.border,
        background: style.background,
        boxShadow: style.glow,
      }}
    >
      {/* LIVE OUTER RING */}

      <div
        className="
          absolute
          inset-[7px]
          rounded-full
          border
          opacity-40
        "
        style={{
          borderColor: style.color,
        }}
      />

      <p
        className="
          relative
          z-10
          max-w-[90px]
          text-center
          font-mono
          text-[12px]
          font-bold
          leading-tight
          tracking-[0.13em]
        "
        style={{
          color: style.color,
        }}
      >
        {label}
      </p>

      <p
        className="
          relative
          z-10
          mt-2
          text-[22px]
          font-bold
          text-white
        "
      >
        {value}
      </p>

      <span className="relative z-10 mt-1 text-[12px] text-slate-400">
        {metric}
      </span>
    </div>
  );
}

/* ============================================================
   CENTRAL TARGET NODE
============================================================ */

function TargetNode() {
  return (
    <div
      className="
        correlation-node
        target-node
        absolute
        left-[50%]
        top-[57%]
        z-50
        flex
        h-[165px]
        w-[165px]
        items-center
        justify-center
        rounded-full
      "
      style={{
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* EXPANDING PULSE */}

      <div
        className="
          target-ring
          absolute
          inset-0
          rounded-full
          border
          border-blue-400/40
        "
      />

      <div
        className="
          absolute
          inset-[-18px]
          rounded-full
          border
          border-blue-400/10
        "
      />

      {/* MAIN TARGET */}

      <div
        className="
          target-core
          relative
          flex
          h-[125px]
          w-[125px]
          flex-col
          items-center
          justify-center
          rounded-full
          border
          border-white/[0.3]
          bg-black/[0.6]
          backdrop-blur-xl
        "
      >
        <span className="font-mono text-[12px] tracking-[0.2em] text-blue-300">
          TARGET
        </span>

        <span className="mt-2 font-serif text-[26px] text-white">
          AAPL
        </span>

        <span className="mt-2 text-[12px] text-slate-400">
          Primary asset
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   KPI COMPONENT
============================================================ */

function CorrelationKPI({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: NodeTone;
}) {
  const style = toneStyles[tone];

  return (
    <div
      className="
        correlation-kpi
        w-[210px]
        rounded-sm
        border
        bg-black/[0.38]
        p-4
        backdrop-blur-xl
      "
      style={{
        borderColor: style.border,
        boxShadow: style.glow,
      }}
    >
      <p
        className="
          font-mono
          text-[12px]
          font-bold
          tracking-[0.14em]
        "
        style={{
          color: style.color,
        }}
      >
        {label}
      </p>

      <div className="mt-2 flex items-end justify-between">
        <p className="text-[22px] font-bold text-white">
          {value}
        </p>

        <p className="text-[12px] text-slate-400">
          {detail}
        </p>
      </div>

      <div className="mt-3 h-[3px] w-full bg-white/[0.08]">
        <div
          className="h-full w-[72%]"
          style={{
            background: style.color,
            boxShadow: `0 0 10px ${style.color}`,
          }}
        />
      </div>
    </div>
  );
}