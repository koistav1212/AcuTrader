"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CinematicScene } from "../components/CinematicScene";
import { DepthLayer } from "../components/DepthLayer";

type BadgeVariant = "pill" | "data" | "alert" | "feature";

type BadgeProps = {
  x: string;
  y: string;
  text: string;
  value?: string;
  supporting?: string;
  opacity?: number;
  blur?: number;
  scale?: number;
  variant?: BadgeVariant;
  accent?: "blue" | "green" | "orange" | "red" | "purple";
};

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const badges = gsap.utils.toArray<HTMLElement>(".noise-badge");

      /* =========================================================
         INITIAL POSITION

         xPercent / yPercent preserve true centered positioning.
         GSAP can now animate x/y without destroying CSS transforms.
      ========================================================= */

      gsap.set(badges, {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 0.7,
        y: 30,
        filter: "blur(10px)",
        transformPerspective: 1000,
        force3D: true,
      });

      /* =========================================================
         SEQUENTIAL CINEMATIC ENTRANCE
      ========================================================= */

      const intro = gsap.timeline({
        delay: 0.25,
      });

      badges.forEach((badge, index) => {
        const targetOpacity = Number(badge.dataset.opacity ?? 1);
        const targetScale = Number(badge.dataset.scale ?? 1);
        const targetBlur = Number(badge.dataset.blur ?? 0);

        intro.to(
          badge,
          {
            opacity: targetOpacity,
            scale: targetScale,
            y: 0,
            filter: `blur(${targetBlur}px)`,
            duration: 0.65,
            ease: "back.out(1.4)",
            force3D: true,
          },
          index * 0.5
        );
      });

      /* =========================================================
         FISH / SHARK MOUSE REACTION

         Cursor = predator.

         Nearby cards calculate distance from cursor.
         The closer the cursor, the stronger they move away.

         When cursor leaves:
         Cards smoothly return to original position.
      ========================================================= */

      const REACTION_RADIUS = 280;
      const MAX_FORCE = 100;

      const moveBadges = (event: MouseEvent) => {
        const container = containerRef.current;

        if (!container) return;

        const containerRect = container.getBoundingClientRect();

        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;

        badges.forEach((badge) => {
          const rect = badge.getBoundingClientRect();

          const badgeX =
            rect.left -
            containerRect.left +
            rect.width / 2;

          const badgeY =
            rect.top -
            containerRect.top +
            rect.height / 2;

          const dx = badgeX - mouseX;
          const dy = badgeY - mouseY;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance < REACTION_RADIUS) {
            const strength =
              1 - distance / REACTION_RADIUS;

            const force =
              strength * MAX_FORCE;

            const safeDistance =
              Math.max(distance, 1);

            const moveX =
              (dx / safeDistance) * force;

            const moveY =
              (dy / safeDistance) * force;

            gsap.to(badge, {
              x: moveX,
              y: moveY,
              scale: 1 + strength * 0.08,
              rotation:
                (moveX / MAX_FORCE) * 5,
              duration: 0.28,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(badge, {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "elastic.out(1, 0.55)",
              overwrite: "auto",
            });
          }
        });
      };

      const resetBadges = () => {
        badges.forEach((badge) => {
          gsap.to(badge, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "elastic.out(1, 0.6)",
            overwrite: "auto",
          });
        });
      };

      const container = containerRef.current;

      container?.addEventListener(
        "mousemove",
        moveBadges
      );

      container?.addEventListener(
        "mouseleave",
        resetBadges
      );

      /* =========================================================
         SCROLL EXIT
         Removed by user request to keep badges visible 
      ========================================================= */

      return () => {
        container?.removeEventListener(
          "mousemove",
          moveBadges
        );

        container?.removeEventListener(
          "mouseleave",
          resetBadges
        );
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <CinematicScene
      index={1}
      image="/assests/img1.png"
      position="right"
      title="MARKETS DON'T LACK DATA."
      fullBleedImage
    >
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          perspective: "1800px",
        }}
      >
        {/* =====================================================
            BACKGROUND GRID
        ====================================================== */}

        <DepthLayer
          depth="background"
          className="
            absolute
            inset-0
            pointer-events-none
            opacity-[0.06]
          "
        >
          <svg
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="hero-grid-pattern"
                width="64"
                height="64"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 64 0 L 0 0 0 64"
                  fill="none"
                  stroke="var(--text)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect
              width="100%"
              height="100%"
              fill="url(#hero-grid-pattern)"
            />
          </svg>
        </DepthLayer>

        {/* =====================================================
            INTERACTIVE FLOATING MARKET SIGNALS
        ====================================================== */}

        <DepthLayer
          depth="context"
          className="
            absolute
            inset-0
            pointer-events-auto
          "
        >
          {/* BACKGROUND BADGES (Muted / Blurred) */}
          <Badge x="24%" y="18%" text="WEATHER ALERT" opacity={0.45} blur={1.5} scale={0.88} variant="pill" accent="blue" />
          <Badge x="61%" y="18%" text="SPORTS RESULTS" opacity={0.45} blur={1.5} scale={0.88} variant="pill" accent="purple" />
          <Badge x="39%" y="34%" text="SECTOR ROTATION" opacity={0.45} blur={1.5} scale={0.88} variant="data" accent="blue" value="Energy" supporting="Outflows accelerating" />
          <Badge x="10%" y="58%" text="RATE DECISION" opacity={0.45} blur={1.5} scale={0.88} variant="data" accent="orange" value="4.75%" supporting="Unchanged" />
          <Badge x="22%" y="86%" text="MERGER RUMOR" opacity={0.45} blur={1.5} scale={0.88} variant="alert" accent="purple" value="Vol. +200%" supporting="Unconfirmed source" />
          <Badge x="85%" y="80%" text="OIL FUTURES" opacity={0.45} blur={1.5} scale={0.88} variant="pill" accent="purple" />

          {/* FOREGROUND BADGES (Vivid / Clear) */}
          <Badge x="45%" y="25%" text="NVDA" opacity={1} blur={0} variant="pill" accent="green" value="+3.82%" />
          <Badge x="80%" y="20%" text="CEO INTERVIEW" opacity={1} blur={0} variant="alert" accent="orange" value="Live" supporting="Discussing Q3 guidance" />
          <Badge x="86%" y="30%" text="EARNINGS BEAT" opacity={1} blur={0} variant="alert" accent="green" value="+$0.15" supporting="Market reacted positively" />
          <Badge x="12%" y="29%" text="AAPL +2.48%" opacity={1} blur={0} variant="pill" accent="green" />
          <Badge x="55%" y="39%" text="BREAKING NEWS" opacity={1} blur={0} variant="feature" accent="red" value="Market Risk" supporting="Major bank reports unexpected losses" />
          <Badge x="82%" y="64%" text="SOCIAL TREND" opacity={1} blur={0} variant="data" accent="purple" value="AI Surge" supporting="Trending globally" />
          <Badge x="92%" y="70%" text="RISK ON" opacity={1} blur={0} variant="pill" accent="green" />
          <Badge x="14%" y="70%" text="POLITICAL RISK" opacity={1} blur={0} variant="pill" accent="red" />
          <Badge x="18%" y="76%" text="FED OUTLOOK" opacity={1} blur={0} variant="data" accent="blue" value="Neutral" supporting="Priced in 2 cuts" />
          <Badge x="30%" y="92%" text="BOND YIELDS" opacity={1} blur={0} variant="pill" accent="orange" />
          <Badge x="40%" y="68%" text="PRICE DROP" opacity={1} blur={0} variant="alert" accent="red" value="-12.4%" supporting="Below 50d moving average" />
          <Badge x="52%" y="82%" text="MACRO DATA" opacity={1} blur={0} variant="data" accent="blue" value="2.1%" supporting="GDP Growth" />
          <Badge x="68%" y="72%" text="EPS ABOVE ESTIMATE" opacity={1} blur={0} variant="feature" accent="green" value="+$1.2B" supporting="Revenue above estimates" />
          <Badge x="65%" y="88%" text="VOLUME SPIKE" opacity={1} blur={0} variant="feature" accent="orange" value="+245%" supporting="Institutional block trades" />
        </DepthLayer>

        {/* =====================================================
            TITLE PARALLAX TARGET
        ====================================================== */}

        <div
          className="
            hero-title
            absolute
            inset-0
            pointer-events-none
          "
        />
      </div>
    </CinematicScene>
  );
}

/* =========================================================
   BADGE COMPONENT
========================================================= */

function Badge({
  x,
  y,
  text,
  value,
  supporting,
  opacity = 1,
  blur = 0,
  scale = 1,
  variant = "pill",
  accent = "blue",
}: BadgeProps) {
  // --- PALETTES ---
  const ACCENTS = {
    green: {
      background: "linear-gradient(135deg, rgba(0, 255, 136, 0.20), rgba(0, 45, 24, 0.82))",
      border: "rgba(0, 255, 136, 0.75)",
      glow: "0 0 12px rgba(0,255,136,0.45), 0 0 35px rgba(0,255,136,0.22)",
      primary: "#36FF9A",
      secondary: "#A7FFD2"
    },
    red: {
      background: "linear-gradient(135deg, rgba(255, 45, 55, 0.22), rgba(55, 5, 8, 0.88))",
      border: "rgba(255, 65, 75, 0.80)",
      glow: "0 0 14px rgba(255,45,55,0.50), 0 0 40px rgba(255,45,55,0.22)",
      primary: "#FF4D5A",
      secondary: "#FFB3B8"
    },
    blue: {
      background: "linear-gradient(135deg, rgba(45, 130, 255, 0.20), rgba(5, 20, 55, 0.88))",
      border: "rgba(75, 150, 255, 0.75)",
      glow: "0 0 12px rgba(45,130,255,0.45), 0 0 35px rgba(45,130,255,0.18)",
      primary: "#55A6FF",
      secondary: "#B8D9FF"
    },
    purple: {
      background: "linear-gradient(135deg, rgba(175, 80, 255, 0.22), rgba(45, 8, 70, 0.88))",
      border: "rgba(190, 100, 255, 0.80)",
      glow: "0 0 14px rgba(175,80,255,0.50), 0 0 40px rgba(175,80,255,0.20)",
      primary: "#C176FF",
      secondary: "#E2C7FF"
    },
    orange: {
      background: "linear-gradient(135deg, rgba(255, 125, 20, 0.22), rgba(70, 25, 0, 0.88))",
      border: "rgba(255, 140, 35, 0.85)",
      glow: "0 0 14px rgba(255,125,20,0.55), 0 0 42px rgba(255,125,20,0.22)",
      primary: "#FF982F",
      secondary: "#FFD0A0"
    }
  };

  const theme = ACCENTS[accent];

  // --- VARIANTS ---
  const variantStyles = {
    pill: {
      container: "rounded-full px-[18px] py-[10px]",
      valueSize: "text-[20px]"
    },
    data: {
      container: "w-[180px] min-h-[82px] rounded-[10px] p-[16px]",
      valueSize: "text-[20px]"
    },
    alert: {
      container: "w-[220px] min-h-[130px] rounded-[14px] p-[20px]",
      valueSize: "text-[20px]"
    },
    feature: {
      container: "w-[250px] min-h-[150px] rounded-[16px] p-[24px]",
      valueSize: "text-[26px]"
    }
  };

  const activeVariant = variantStyles[variant];

  // Provide initial scale and blur values for GSAP targeting via datasets
  return (
    <div
      className={`noise-badge absolute select-none will-change-transform border backdrop-blur-[14px] flex flex-col justify-between ${activeVariant.container}`}
      data-opacity={opacity}
      data-scale={scale}
      data-blur={blur}
      style={{
        left: x,
        top: y,
        background: theme.background,
        borderColor: theme.border,
        boxShadow: theme.glow,
        filter: `blur(${blur}px)`,
        transform: `scale(${scale}) translate(-50%, -50%)`,
        opacity: opacity,
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          {variant !== "pill" && (
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: theme.primary, opacity: 0.8 }}
            />
          )}
          <span
            className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: theme.secondary }}
          >
            {text}
          </span>
          {variant === "pill" && value && (
            <span
              className="font-mono text-[11px] font-bold ml-1"
              style={{ color: theme.primary }}
            >
              {value}
            </span>
          )}
        </div>

        {variant !== "pill" && value && (
          <div
            className={`font-mono font-medium leading-[1] tracking-[-0.02em] ${activeVariant.valueSize}`}
            style={{ color: theme.primary }}
          >
            {value}
          </div>
        )}

        {supporting && (
          <div
            className="text-[11px] leading-[1.4] opacity-75 mt-1"
            style={{ color: theme.secondary }}
          >
            {supporting}
          </div>
        )}
      </div>

      {variant === "feature" && (
        <div className="mt-4 flex h-8 items-end gap-[3px] opacity-80">
          {[35, 55, 40, 80, 60, 90, 72, 100].map((h, i) => (
            <div
              key={i}
              className="w-full"
              style={{ height: `${h}%`, backgroundColor: theme.primary }}
            />
          ))}
        </div>
      )}
    </div>
  );
}