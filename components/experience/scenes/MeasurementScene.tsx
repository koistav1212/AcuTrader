"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CinematicScene } from "../components/CinematicScene";
import { DataCard } from "../components/DataCard";

type CardTone = "blue" | "purple" | "green" | "orange" | "red";

const colorStyles: Record<
  CardTone,
  {
    text: string;
    border: string;
    glow: string;
    fill: string;
    soft: string;
  }
> = {
  blue: {
    text: "#60a5fa",
    border: "rgba(96,165,250,0.55)",
    glow: "0 0 40px rgba(37,99,235,0.20)",
    fill: "#3b82f6",
    soft: "rgba(59,130,246,0.12)",
  },

  purple: {
    text: "#a78bfa",
    border: "rgba(167,139,250,0.55)",
    glow: "0 0 40px rgba(124,58,237,0.22)",
    fill: "#8b5cf6",
    soft: "rgba(139,92,246,0.12)",
  },

  green: {
    text: "#86efac",
    border: "rgba(134,239,172,0.5)",
    glow: "0 0 40px rgba(34,197,94,0.18)",
    fill: "#22c55e",
    soft: "rgba(34,197,94,0.12)",
  },

  orange: {
    text: "#fb923c",
    border: "rgba(251,146,60,0.55)",
    glow: "0 0 40px rgba(249,115,22,0.22)",
    fill: "#f97316",
    soft: "rgba(249,115,22,0.12)",
  },

  red: {
    text: "#fb7185",
    border: "rgba(251,113,133,0.55)",
    glow: "0 0 40px rgba(239,68,68,0.20)",
    fill: "#ef4444",
    soft: "rgba(239,68,68,0.12)",
  },
};

/* ============================================================
   CINEMATIC CARD
============================================================ */

function MeasureCard({
  children,
  tone = "blue",
  className = "",
  depth = "forward",
}: {
  children: React.ReactNode;
  tone?: CardTone;
  className?: string;
  depth?: "forward" | "back" | "primary" | "deepest";
}) {
  const style = colorStyles[tone];

  return (
    <DataCard
      cardClassName={`measure-card parallax-card ${className}`}
      depth={depth}
      className="
        relative
        flex
        h-[180px]
        w-[220px]
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        px-6
        py-5
        backdrop-blur-xl
        transition-shadow
        duration-500
      "
      style={{
        borderColor: style.border,
        background: `
          linear-gradient(
            135deg,
            rgba(8,12,20,0.88),
            rgba(10,14,24,0.72)
          )
        `,
        boxShadow: style.glow,
      }}
    >
      {/* TOP COLOR ACCENT */}

      <div
        className="absolute left-0 top-0 h-[2px] w-full"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${style.fill},
            transparent
          )`,
        }}
      />

      {/* AMBIENT COLOR */}

      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl"
        style={{
          background: style.soft,
        }}
      />

      {children}
    </DataCard>
  );
}

/* ============================================================
   LIVE PROGRESS
============================================================ */

function LiveProgress({
  color = "green",
  value = 78,
}: {
  color?: CardTone;
  value?: number;
}) {
  const style = colorStyles[color];

  return (
    <div className="mt-auto pt-4">
      <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="live-progress h-full rounded-full"
          style={{
            width: `${value}%`,
            background: style.fill,
            boxShadow: `0 0 14px ${style.fill}`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   LIVE BARS
============================================================ */

function LiveBars({
  color = "blue",
  bars = 8,
}: {
  color?: CardTone;
  bars?: number;
}) {
  const style = colorStyles[color];

  return (
    <div className="mt-auto flex h-[55px] items-end gap-[5px]">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="live-bar flex-1 rounded-t-sm"
          style={{
            height: `${30 + ((i * 19) % 55)}%`,
            background: `linear-gradient(
              to top,
              ${style.fill},
              ${style.text}
            )`,
            boxShadow: `0 0 12px ${style.fill}55`,
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${1.4 + (i % 3) * 0.25}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   LIVE LINE
============================================================ */

function LiveLine({
  color = "blue",
}: {
  color?: CardTone;
}) {
  const style = colorStyles[color];

  return (
    <div className="mt-auto pt-4">
      <svg
        className="h-[46px] w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 100 20"
      >
        <path
          d="
            M0,15
            L8,13
            L16,14
            L24,9
            L32,12
            L40,6
            L48,10
            L56,5
            L64,8
            L72,4
            L80,7
            L88,3
            L100,5
          "
          fill="none"
          stroke={style.fill}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="live-line"
          style={{
            filter: `drop-shadow(0 0 5px ${style.fill})`,
          }}
        />
      </svg>
    </div>
  );
}

/* ============================================================
   COMPONENT
============================================================ */

export function MeasurementScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".measure-card");
      const numbers =
        gsap.utils.toArray<HTMLElement>(".animated-number");

      /* --------------------------------------------------------
         CINEMATIC ENTRANCE
      -------------------------------------------------------- */

      gsap.set(cards, {
        opacity: 0,
        scale: 0.82,
        y: 60,
        filter: "blur(14px)",
      });

      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });

      /* --------------------------------------------------------
         FLOATING IDLE MOTION
      -------------------------------------------------------- */

      cards.forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -8 : 8,
          duration: 3 + (index % 3) * 0.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.18,
        });
      });

      /* --------------------------------------------------------
         NUMBER COUNTERS
      -------------------------------------------------------- */

      numbers.forEach((num) => {
        const targetValue = parseFloat(
          num.getAttribute("data-value") || "0"
        );

        const prefix =
          num.getAttribute("data-prefix") || "";

        const suffix =
          num.getAttribute("data-suffix") || "";

        const decimals = parseInt(
          num.getAttribute("data-decimals") || "1"
        );

        const counter = {
          value: 0,
        };

        gsap.to(counter, {
          value: targetValue,
          duration: 1.8,
          ease: "power3.out",

          scrollTrigger: {
            trigger: num,
            start: "top 85%",
          },

          onUpdate: () => {
            num.innerHTML =
              prefix +
              counter.value.toFixed(decimals) +
              suffix;
          },
        });
      });

      /* --------------------------------------------------------
         MOUSE PARALLAX
      -------------------------------------------------------- */

      const handleMouseMove = (event: MouseEvent) => {
        if (!containerRef.current) return;

        const rect =
          containerRef.current.getBoundingClientRect();

        const mouseX =
          (event.clientX - rect.left) / rect.width - 0.5;

        const mouseY =
          (event.clientY - rect.top) / rect.height - 0.5;

        cards.forEach((card, index) => {
          const depth =
            1 + (index % 4) * 0.35;

          gsap.to(card, {
            x: mouseX * 30 * depth,
            y: mouseY * 22 * depth,
            rotateY: mouseX * 4,
            rotateX: -mouseY * 3,
            duration: 1.2,
            ease: "power3.out",
          });
        });
      };

      const container = containerRef.current;

      container?.addEventListener(
        "mousemove",
        handleMouseMove
      );

      return () => {
        container?.removeEventListener(
          "mousemove",
          handleMouseMove
        );
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <CinematicScene
      index={3}
      image="/assests/img3.png"
      position="center"
      title="FROM INFORMATION TO MEASUREMENT."
    >
      {/* ======================================================
          CINEMATIC CARD FIELD
      ======================================================= */}

      <div
        ref={containerRef}
        className="
          absolute
          inset-0
          z-30
          pointer-events-auto
        "
        style={{
          perspective: "1800px",
        }}
      >
        {/* ====================================================
            LEFT — RSI
        ===================================================== */}

        <div
          className="
            absolute
            left-[8%]
            top-[38%]
            z-20
            rotate-[-7deg]
          "
        >
          <MeasureCard
            tone="blue"
            depth="forward"
            className="card-left"
          >
            <p
              className="
                font-mono
                text-[12px]
                font-bold
                uppercase
                tracking-[0.18em]
              "
              style={{
                color: colorStyles.blue.text,
              }}
            >
              RSI
            </p>

            <div className="mt-5 flex items-center gap-4">
              <svg
                className="h-[60px] w-[60px] shrink-0 -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="
                    M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831
                  "
                  fill="none"
                  stroke="rgba(59,130,246,0.18)"
                  strokeWidth="3"
                />

                <path
                  className="gauge-path"
                  strokeDasharray="100"
                  strokeDashoffset="28"
                  d="
                    M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831
                  "
                  fill="none"
                  stroke={colorStyles.blue.fill}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <div>
                <p className="text-[26px] font-bold text-white">
                  <span
                    className="animated-number"
                    data-value="72.4"
                    data-decimals="1"
                  >
                    0.0
                  </span>
                </p>

                <p className="mt-1 text-[14px] text-slate-300">
                  Overbought
                </p>
              </div>
            </div>

            <LiveLine color="blue" />
          </MeasureCard>
        </div>

        {/* ====================================================
            LEFT LOWER — MACD
        ===================================================== */}

        <div
          className="
            absolute
            bottom-[11%]
            left-[23%]
            z-20
            rotate-[-5deg]
          "
        >
          <MeasureCard
            tone="purple"
            depth="back"
          >
            <p
              className="
                font-mono
                text-[12px]
                font-bold
                uppercase
                tracking-[0.15em]
              "
              style={{
                color: colorStyles.purple.text,
              }}
            >
              MACD HISTOGRAM
            </p>

            <LiveBars
              color="purple"
              bars={8}
            />

            <p className="mt-2 text-[24px] font-bold text-white">
              <span
                className="animated-number"
                data-value="1.2"
                data-prefix="+"
                data-decimals="1"
              >
                +0.0
              </span>
            </p>
          </MeasureCard>
        </div>

        {/* ====================================================
            CENTER LEFT — SUPPORT
        ===================================================== */}

        <div
          className="
            absolute
            left-[25%]
            top-[32%]
            z-20
            rotate-[3deg]
          "
        >
          <MeasureCard
            tone="green"
            depth="primary"
          >
            <p
              className="
                font-mono
                text-[12px]
                font-bold
                uppercase
                tracking-[0.16em]
              "
              style={{
                color: colorStyles.green.text,
              }}
            >
              SUPPORT
            </p>

            <p className="mt-5 text-[26px] font-bold text-white">
              <span
                className="animated-number"
                data-value="187.4"
                data-prefix="$"
                data-decimals="2"
              >
                $0.00
              </span>
            </p>

            <p className="mt-1 text-[14px] text-slate-300">
              −4.1% below spot
            </p>

            <LiveLine color="green" />
          </MeasureCard>
        </div>

        {/* ====================================================
            TOP RIGHT — VOLATILITY
        ===================================================== */}

        <div
          className="
            absolute
            right-[17%]
            top-[15%]
            z-20
            rotate-[-5deg]
          "
        >
          <MeasureCard
            tone="orange"
            depth="back"
          >
            <p
              className="
                font-mono
                text-[12px]
                font-bold
                uppercase
                tracking-[0.15em]
              "
              style={{
                color: colorStyles.orange.text,
              }}
            >
              VOLATILITY INDEX
            </p>

            <LiveLine color="orange" />

            <p className="mt-2 text-[26px] font-bold text-white">
              <span
                className="animated-number"
                data-value="14.2"
                data-decimals="1"
              >
                0.0
              </span>
            </p>
          </MeasureCard>
        </div>

        {/* ====================================================
            CENTER RIGHT — ATR
        ===================================================== */}

        <div
          className="
            absolute
            right-[20%]
            top-[40%]
            z-30
            rotate-[2deg]
          "
        >
          <MeasureCard
            tone="orange"
            depth="primary"
          >
            <p
              className="
                font-mono
                text-[12px]
                font-bold
                uppercase
                tracking-[0.15em]
              "
              style={{
                color: colorStyles.orange.text,
              }}
            >
              ATR (14D)
            </p>

            <p className="mt-5 text-[26px] font-bold text-white">
              <span
                className="animated-number"
                data-value="3.85"
                data-decimals="2"
              >
                0.00
              </span>
            </p>

            <p className="mt-1 text-[14px] text-slate-300">
              Active volatility
            </p>

            <LiveProgress
              color="orange"
              value={62}
            />
          </MeasureCard>
        </div>

        {/* ====================================================
            FAR RIGHT — BOLLINGER
        ===================================================== */}

        <div
          className="
            absolute
            right-[4%]
            top-[29%]
            z-20
            rotate-[-5deg]
          "
        >
          <MeasureCard
            tone="red"
            depth="forward"
          >
            <p
              className="
                font-mono
                text-[12px]
                font-bold
                uppercase
                tracking-[0.15em]
              "
              style={{
                color: colorStyles.red.text,
              }}
            >
              BOLLINGER %B
            </p>

            <p className="mt-5 text-[26px] font-bold text-white">
              <span
                className="animated-number"
                data-value="0.82"
                data-decimals="2"
              >
                0.00
              </span>
            </p>

            <p className="mt-1 text-[14px] text-slate-300">
              Near upper band
            </p>

            <LiveLine color="red" />
          </MeasureCard>
        </div>

        {/* ====================================================
            BOTTOM RIGHT — RELATIVE VOLUME
        ===================================================== */}

        <div
          className="
            absolute
            bottom-[14%]
            right-[10%]
            z-20
            rotate-[3deg]
          "
        >
          <MeasureCard
            tone="green"
            depth="deepest"
          >
            <p
              className="
                font-mono
                text-[12px]
                font-bold
                uppercase
                tracking-[0.15em]
              "
              style={{
                color: colorStyles.green.text,
              }}
            >
              RELATIVE VOLUME
            </p>

            <p className="mt-4 text-[26px] font-bold text-white">
              <span
                className="animated-number"
                data-value="1.8"
                data-suffix="x"
                data-decimals="1"
              >
                0.0x
              </span>
            </p>

            <p className="mt-1 text-[14px] text-slate-300">
              vs. 30-day average
            </p>

            <LiveBars
              color="green"
              bars={7}
            />
          </MeasureCard>
        </div>
      </div>

      {/* ======================================================
          CARD + DATA ANIMATIONS
      ======================================================= */}

      <style jsx>{`
        .measure-card {
          will-change: transform, opacity, filter;
          transform-style: preserve-3d;
        }

        /* ----------------------------------------------
           LIVE PROGRESS
        ---------------------------------------------- */

        .live-progress {
          animation: progressPulse 2.8s ease-in-out infinite;
          transform-origin: left center;
        }

        @keyframes progressPulse {
          0% {
            transform: scaleX(0.68);
            opacity: 0.65;
          }

          50% {
            transform: scaleX(1);
            opacity: 1;
          }

          100% {
            transform: scaleX(0.8);
            opacity: 0.75;
          }
        }

        /* ----------------------------------------------
           LIVE BARS
        ---------------------------------------------- */

        .live-bar {
          animation-name: liveBars;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          transform-origin: bottom;
        }

        @keyframes liveBars {
          0% {
            transform: scaleY(0.4);
            opacity: 0.6;
          }

          25% {
            transform: scaleY(1);
            opacity: 1;
          }

          50% {
            transform: scaleY(0.65);
            opacity: 0.75;
          }

          75% {
            transform: scaleY(1.15);
            opacity: 1;
          }

          100% {
            transform: scaleY(0.4);
            opacity: 0.6;
          }
        }

        /* ----------------------------------------------
           LIVE SPARKLINE
        ---------------------------------------------- */

        .live-line {
          stroke-dasharray: 150;
          stroke-dashoffset: 150;

          animation:
            drawLine 3.5s ease-in-out infinite alternate,
            linePulse 2.5s ease-in-out infinite;
        }

        @keyframes drawLine {
          0% {
            stroke-dashoffset: 150;
          }

          70% {
            stroke-dashoffset: 0;
          }

          100% {
            stroke-dashoffset: -20;
          }
        }

        @keyframes linePulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }

        /* ----------------------------------------------
           MOBILE FALLBACK
        ---------------------------------------------- */

        @media (max-width: 1100px) {
          .measure-card {
            transform: none !important;
          }
        }
      `}</style>
    </CinematicScene>
  );
}