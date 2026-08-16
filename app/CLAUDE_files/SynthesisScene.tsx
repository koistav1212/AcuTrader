"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CinematicScene } from "../components/CinematicScene";

const FRAGMENTS = [
  { label: "RSI", value: "72.4", from: { x: -220, y: -80 } },
  { label: "MACD", value: "+1.2", from: { x: 200, y: -120 } },
  { label: "YIELD CURVE", value: "−0.85", from: { x: -260, y: 60 } },
  { label: "TECH SECTOR", value: "+0.92", from: { x: 240, y: 100 } },
  { label: "SUPPLY CHAIN", value: "+0.68", from: { x: -180, y: 160 } },
];

export function SynthesisScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const fragments = gsap.utils.toArray(".synth-fragment");
      const panel = containerRef.current?.querySelector(".synth-panel");

      fragments.forEach((frag: any, i) => {
        const fx = parseFloat(frag.dataset.fromX);
        const fy = parseFloat(frag.dataset.fromY);
        gsap.set(frag, { x: fx, y: fy, opacity: 0.9, filter: "blur(2px)" });
        gsap.to(frag, {
          x: 0,
          y: 0,
          opacity: 0,
          filter: "blur(6px)",
          scale: 0.6,
          ease: "power2.in",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "center center",
            scrub: 1,
          },
        });
      });

      if (panel) {
        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.9, filter: "blur(8px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 55%",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }
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
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
        {FRAGMENTS.map((f, i) => (
          <div
            key={i}
            className="synth-fragment absolute font-mono text-[9px] tracking-widest uppercase text-muted bg-surface/80 border border-border px-3 py-1.5"
            data-from-x={f.from.x}
            data-from-y={f.from.y}
          >
            {f.label} <span className="text-accent">{f.value}</span>
          </div>
        ))}

        <div className="synth-panel border border-border bg-surface p-8 w-[28rem] shadow-2xl relative z-10">
          <p className="font-mono text-[9px] tracking-[0.3em] text-muted uppercase mb-3">Consolidated Read</p>
          <h3 className="font-serif text-3xl text-text leading-tight">
            Signals converge on a single bullish read for AAPL.
          </h3>
          <p className="font-mono text-[10px] text-muted mt-4 leading-relaxed">
            Technical momentum, cross-asset correlation, and institutional flow
            are pointing the same direction — the model resolves five inputs
            into one structured position.
          </p>
        </div>
      </div>
    </CinematicScene>
  );
}
