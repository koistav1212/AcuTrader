"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicScene } from "../components/CinematicScene";

type CardColor =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red";

const colorStyles = {
  blue: {
    accent: "#2563eb",
    soft: "rgba(37, 99, 235, 0.10)",
    glow: "rgba(37, 99, 235, 0.18)",
  },

  purple: {
    accent: "#7c3aed",
    soft: "rgba(124, 58, 237, 0.10)",
    glow: "rgba(124, 58, 237, 0.18)",
  },

  green: {
    accent: "#16a34a",
    soft: "rgba(22, 163, 74, 0.10)",
    glow: "rgba(22, 163, 74, 0.18)",
  },

  orange: {
    accent: "#ea580c",
    soft: "rgba(234, 88, 12, 0.10)",
    glow: "rgba(234, 88, 12, 0.18)",
  },

  red: {
    accent: "#dc2626",
    soft: "rgba(220, 38, 38, 0.10)",
    glow: "rgba(220, 38, 38, 0.18)",
  },
};

function LiveBars({
  color = "blue",
  bars = 8,
}: {
  color?: CardColor;
  bars?: number;
}) {
  const style = colorStyles[color];

  return (
    <div className="mt-5 flex h-10 items-end gap-1.5">
      {Array.from({ length: bars }).map((_, index) => (
        <div
          key={index}
          className="live-bar flex-1 rounded-t-sm"
          style={{
            background: style.accent,
            opacity: 0.85,
            animationDelay: `${index * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
}

function LiveLine({
  color = "blue",
}: {
  color?: CardColor;
}) {
  const style = colorStyles[color];

  return (
    <svg
      className="mt-5 h-12 w-full overflow-visible"
      viewBox="0 0 300 60"
      preserveAspectRatio="none"
    >
      <path
        d="M0 48
           L30 42
           L55 45
           L85 30
           L110 37
           L140 22
           L170 30
           L200 15
           L230 25
           L265 10
           L300 18"
        fill="none"
        stroke={style.accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="live-line"
      />

      <path
        d="M0 48
           L30 42
           L55 45
           L85 30
           L110 37
           L140 22
           L170 30
           L200 15
           L230 25
           L265 10
           L300 18"
        fill="none"
        stroke={style.accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 12"
        className="live-line-pulse"
      />
    </svg>
  );
}

function LiveProgress({
  color = "green",
  value = 78,
}: {
  color?: CardColor;
  value?: number;
}) {
  const style = colorStyles[color];

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#374151]">
          Signal Strength
        </span>

        <span
          className="font-mono text-[14px] font-bold"
          style={{ color: style.accent }}
        >
          {value}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.08]">
        <div
          className="live-progress h-full rounded-full"
          style={{
            width: `${value}%`,
            background: style.accent,
          }}
        />
      </div>
    </div>
  );
}

function DataCard({
  title,
  subtitle,
  color = "blue",
  children,
}: {
  title: string;
  subtitle: string;
  color?: CardColor;
  children: React.ReactNode;
}) {
  const style = colorStyles[color];

  return (
    <div
      className="data-card relative overflow-hidden rounded-[20px] border bg-white/92 p-6 backdrop-blur-xl"
      style={{
        borderColor: `${style.accent}45`,
        boxShadow: `0 14px 40px rgba(0,0,0,0.10),
                    0 0 30px ${style.glow}`,
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-[4px]"
        style={{
          background: style.accent,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          background: `radial-gradient(circle at 80% 0%, ${style.accent}, transparent 55%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{
              background: style.accent,
              boxShadow: `0 0 12px ${style.accent}`,
            }}
          />

          <p
            className="font-mono text-[14px] font-bold uppercase tracking-[0.16em]"
            style={{ color: style.accent }}
          >
            {title}
          </p>
        </div>

        <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#4b5563]">
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
}

export function SignalScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const leftCards = gsap.utils.toArray(".left-card");
      const rightCards = gsap.utils.toArray(".right-card");

      gsap.set(leftCards, {
        opacity: 0,
        x: -70,
      });

      gsap.set(rightCards, {
        opacity: 0,
        x: 70,
      });

      gsap.to(leftCards, {
        opacity: 1,
        x: 0,
        stagger: 0.18,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      gsap.to(rightCards, {
        opacity: 1,
        x: 0,
        stagger: 0.18,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      gsap.set(".flow-container", { opacity: 0 });
      gsap.to(".flow-container", {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      const flowPaths = gsap.utils.toArray<SVGPathElement>(".data-flow");
      flowPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 0.4,
        });
      });

      gsap.to(".ai-core", {
        scale: 1.04,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <CinematicScene
      index={2}
      image="/assests/img2.png"
      position="center"
      title="RAW SIGNALS ISOLATED."
      id="scene-1"
    >
      <div
        ref={containerRef}
        className="absolute inset-0 z-10"
      >

        {/* LEFT HEADING */}

        <div className="absolute left-[3.5%] top-[14%] z-20">
          <p className="font-mono text-[14px] font-bold uppercase tracking-[0.18em] text-[#1f2937]">
            WE COLLECT DATA
          </p>

          <p className="mt-3 max-w-[240px] text-[14px] font-medium leading-relaxed text-[#4b5563]">
            From thousands of market and news sources, continuously in real time.
          </p>
        </div>


        {/* RIGHT HEADING */}

        <div className="absolute right-[3.5%] top-[14%] z-20 text-right">
          <p className="font-mono text-[14px] font-bold uppercase tracking-[0.18em] text-[#1f2937]">
            WE DELIVER CLARITY
          </p>

          <p className="ml-auto mt-3 max-w-[250px] text-[14px] font-medium leading-relaxed text-[#4b5563]">
            Raw information transformed into clear, actionable intelligence.
          </p>
        </div>

        {/* ================= DATA FLOW MESH ================= */}
        
        <div className="flow-container absolute inset-0 z-10 pointer-events-none">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
          >
            {/* LEFT → CENTER */}
            <path
              className="data-flow"
              d="M340 300 C 500 300 600 415 700 415"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              className="data-flow"
              d="M340 500 C 500 500 600 415 700 415"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              opacity="0.75"
            />
            <path
              className="data-flow"
              d="M340 700 C 500 700 600 415 700 415"
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
              opacity="0.75"
            />

            {/* CENTER → RIGHT */}
            <path
              className="data-flow"
              d="M900 415 C 1000 415 1100 300 1230 300"
              fill="none"
              stroke="#22C55E"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              className="data-flow"
              d="M900 415 C 1000 415 1100 500 1230 500"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              opacity="0.75"
            />
            <path
              className="data-flow"
              d="M900 415 C 1000 415 1100 700 1230 700"
              fill="none"
              stroke="#22C55E"
              strokeWidth="2"
              opacity="0.75"
            />
          </svg>
        </div>


        {/* ================= LEFT CARDS ================= */}

        <div className="absolute left-[3%] top-[24%] z-20 flex w-[18%] flex-col gap-4">

          <div className="left-card">
            <DataCard
              title="Market Data"
              subtitle="Prices, volume, order flow and market momentum."
              color="blue"
            >
              <LiveLine color="blue" />
            </DataCard>
          </div>


          <div className="left-card">
            <DataCard
              title="News & Media"
              subtitle="Financial news, earnings and market-moving events."
              color="purple"
            >
              <LiveBars color="purple" />
            </DataCard>
          </div>


          <div className="left-card">
            <DataCard
              title="Macro Signals"
              subtitle="Rates, CPI, employment and central bank activity."
              color="orange"
            >
              <LiveLine color="orange" />
            </DataCard>
          </div>

        </div>


        {/* ================= AI PROCESSING CORE ================= */}

        <div className="ai-core absolute left-1/2 top-[46%] z-30 w-[230px] -translate-x-1/2 -translate-y-1/2">

          <div className="rounded-[28px] border border-purple-300 bg-white/90 p-7 text-center shadow-[0_20px_60px_rgba(124,58,237,0.15)] backdrop-blur-xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-lg text-2xl">
              ◉
            </div>

            <p className="mt-5 font-mono text-[14px] font-bold tracking-[0.14em] text-[#4c1d95]">
              AI PROCESSING
            </p>

            <p className="mt-3 text-[14px] leading-relaxed text-[#4b5563]">
              Filter noise. Rank relevance. Connect context. Score impact.
            </p>

          </div>

        </div>


        {/* ================= RIGHT CARDS ================= */}

        <div className="absolute right-[3%] top-[24%] z-20 flex w-[20%] flex-col gap-4">

          <div className="right-card">
            <DataCard
              title="Market Overview"
              subtitle="AAPL"
              color="green"
            >
              <div className="mt-3 flex items-end justify-between">
                <span className="text-[18px] font-semibold text-[#374151]">
                  Bullish
                </span>

                <span className="font-mono text-[24px] font-bold text-green-600">
                  +2.48%
                </span>
              </div>

              <LiveLine color="green" />
            </DataCard>
          </div>


          <div className="right-card">
            <DataCard
              title="AI Insights"
              subtitle="Earnings momentum and institutional accumulation detected."
              color="purple"
            >
              <LiveBars color="purple" />
            </DataCard>
          </div>


          <div className="right-card">
            <DataCard
              title="Trading Opportunity"
              subtitle="Momentum continuation setup identified."
              color="green"
            >
              <LiveProgress
                color="green"
                value={78}
              />
            </DataCard>
          </div>

        </div>

      </div>
    </CinematicScene>
  );
}