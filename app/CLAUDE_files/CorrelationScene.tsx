"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CinematicScene } from "../components/CinematicScene";
import { DepthLayer } from "../components/DepthLayer";

export function CorrelationScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray(".correlation-node");
      const paths = gsap.utils.toArray(".correlation-path");

      gsap.set(nodes, { opacity: 0, scale: 0.5 });
      paths.forEach((path: any) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      gsap.to(nodes, {
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "top 30%",
          scrub: 1,
        },
      });

      paths.forEach((path: any) => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 40%",
            end: "center center",
            scrub: 1,
          },
        });
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
      <div ref={containerRef} className="absolute inset-0">
        {/* DEPTH LAYER 1 — background coordinates, near-static */}
        <DepthLayer depth="background" className="absolute inset-0 pointer-events-none opacity-[0.15]">
          <span className="absolute left-[6%] top-[12%] font-mono text-[8px] tracking-widest text-muted">
            r = 0.847 / n = 252 / p &lt; 0.001
          </span>
          <span className="absolute right-[8%] bottom-[10%] font-mono text-[8px] tracking-widest text-muted">
            LOOKBACK: 90D · REFRESH: 15MIN
          </span>
        </DepthLayer>

        {/* SVG Drawing Layer */}
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" preserveAspectRatio="xMidYMid slice">
          <path className="correlation-path" d="M 30% 40% L 50% 60%" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
          <path className="correlation-path" d="M 50% 60% L 70% 30%" fill="none" stroke="var(--accent)" strokeWidth="1" />
          <path className="correlation-path" d="M 30% 40% L 70% 30%" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
          <path className="correlation-path" d="M 20% 70% L 50% 60%" fill="none" stroke="var(--accent)" strokeWidth="1" />
          <path className="correlation-path" d="M 80% 65% L 70% 30%" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 4" />
        </svg>

        {/* Nodes */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Node x="30%" y="40%" label="YIELD CURVE" value="-0.85" />
          <Node x="50%" y="60%" label="AAPL" value="TARGET" isTarget />
          <Node x="70%" y="30%" label="TECH SECTOR" value="+0.92" />
          <Node x="20%" y="70%" label="CONSUMER CPI" value="-0.41" />
          <Node x="80%" y="65%" label="SUPPLY CHAIN" value="+0.68" />
        </div>
      </div>
    </CinematicScene>
  );
}

function Node({ x, y, label, value, isTarget = false }: { x: string; y: string; label: string; value: string; isTarget?: boolean }) {
  return (
    <div
      className={`correlation-node absolute flex flex-col items-center justify-center p-3 rounded-full backdrop-blur-md border ${
        isTarget ? "bg-surface text-text border-border w-24 h-24" : "bg-surface/60 text-muted border-border/50 w-20 h-20"
      }`}
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <span className="font-mono text-[8px] tracking-widest uppercase text-center leading-tight mb-1">{label}</span>
      <span className={`font-serif ${isTarget ? "text-lg text-accent" : "text-sm text-text"}`}>{value}</span>
    </div>
  );
}
