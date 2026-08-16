"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicScene } from "../components/CinematicScene";
import { DepthLayer } from "../components/DepthLayer";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const badges = gsap.utils.toArray(".noise-badge");
      const analyst = containerRef.current?.querySelector(".hero-analyst");
      const title = containerRef.current?.querySelector(".hero-title");
      const grid = containerRef.current?.querySelector(".hero-grid");

      // Badges (context layer): drift up and dissolve as the reader
      // moves past the "noise" stage of the narrative.
      badges.forEach((badge: any) => {
        gsap.to(badge, {
          y: `-=${40 + Math.random() * 40}`,
          opacity: 0,
          scale: 0.9,
          filter: "blur(3px)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Analyst image (context layer, faster than background, slower than
      // foreground): sinks back and softens — "human observation" receding
      // to make room for "quantitative measurement" in the next scene.
      if (analyst) {
        gsap.to(analyst, {
          y: -120,
          scale: 0.92,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Title (primary layer): stays legible longest, moves least.
      if (title) {
        gsap.to(title, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Background grid: near-static, the slowest layer of all.
      if (grid) {
        gsap.to(grid, {
          y: -15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <CinematicScene
      index={1}
      image="/assests/img1.png"
      position="center"
      title="MARKETS DON'T LACK DATA."
    >
      <div ref={containerRef} className="absolute inset-0" style={{ perspective: "1800px" }}>
        {/* DEPTH LAYER 1 — background grid, barely moves */}
        <div className="hero-grid absolute inset-0 pointer-events-none opacity-[0.06]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hero-grid-pattern" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="var(--text)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
          </svg>
        </div>

        {/* DEPTH LAYER 2 — noise badges, medium speed, dissolving */}
        <Badge x="25%" y="18%" text="WEATHER ALERT" blur={1} opacity={0.6} />
        <Badge x="45%" y="25%" text="NVDA" blur={0} opacity={0.8} />
        <Badge x="60%" y="19%" text="SPORTS RESULTS" blur={2} opacity={0.5} />
        <Badge x="80%" y="20%" text="CEO INTERVIEW" blur={0} opacity={0.9} />
        <Badge x="85%" y="30%" text="EARNINGS BEAT" blur={1} opacity={0.7} />
        <Badge x="12%" y="28%" text="AAPL +2.48%" blur={2} opacity={0.4} />
        <Badge x="40%" y="34%" text="SECTOR ROTATION" blur={3} opacity={0.3} />
        <Badge x="55%" y="38%" text="BREAKING NEWS" blur={0} opacity={1} />
        <Badge x="82%" y="65%" text="SOCIAL TREND" blur={1} opacity={0.6} />
        <Badge x="92%" y="70%" text="RISK ON" blur={2} opacity={0.5} />
        <Badge x="10%" y="58%" text="RATE DECISION" blur={4} opacity={0.2} />
        <Badge x="14%" y="70%" text="POLITICAL HEADLINE" blur={0} opacity={0.8} />
        <Badge x="18%" y="76%" text="FED OUTLOOK" blur={2} opacity={0.5} />
        <Badge x="22%" y="86%" text="MERGER RUMOR" blur={3} opacity={0.3} />
        <Badge x="30%" y="92%" text="BOND YIELDS" blur={1} opacity={0.7} />
        <Badge x="40%" y="68%" text="PRICE DROP" blur={2} opacity={0.4} />
        <Badge x="52%" y="82%" text="MACRO DATA" blur={0} opacity={0.8} />
        <Badge x="68%" y="72%" text="EPS ABOVE ESTIMATE" textClass="text-accent" blur={0} opacity={0.9} />
        <Badge x="65%" y="88%" text="VOLUME SPIKE" blur={1} opacity={0.6} />
        <Badge x="85%" y="80%" text="OIL FUTURES" blur={2} opacity={0.4} />

        {/* DEPTH LAYER 3 — title, primary content, moves least/settles first */}
        <div className="hero-title absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* CinematicScene already renders the title prop; this spacer
              keeps the parallax target present for the primary layer. */}
        </div>
      </div>
    </CinematicScene>
  );
}

function Badge({
  x,
  y,
  text,
  blur = 0,
  opacity = 1,
  textClass = "text-text",
}: {
  x: string;
  y: string;
  text: string;
  blur?: number;
  opacity?: number;
  textClass?: string;
}) {
  return (
    <div
      className="noise-badge absolute bg-surface/90 backdrop-blur-sm shadow-sm border border-border px-3 py-1.5"
      style={{
        left: x,
        top: y,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        transform: "translate(-50%, -50%)",
      }}
    >
      <span className={`font-mono text-[8px] uppercase tracking-widest ${textClass}`}>{text}</span>
    </div>
  );
}
