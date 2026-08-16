"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CinematicScene } from "../components/CinematicScene";
import { DataCard } from "../components/DataCard";

export function MeasurementScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".measure-card");
      const numbers = gsap.utils.toArray(".animated-number");
      const gauges = gsap.utils.toArray(".gauge-path");

      // Noise -> processing -> focus entrance (opacity, translateY, scale,
      // rotateX, blur) per the motion-blur system in the brief.
      gsap.set(cards, {
        opacity: 0,
        y: 80,
        scale: 0.94,
        rotateX: 5,
        filter: "blur(12px)",
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: "blur(0px)",
        stagger: 0.09, // 80-140ms window from the brief
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
          end: "top 20%",
          scrub: 1,
        },
      });

      gauges.forEach((gauge: any) => {
        const value = parseInt(gauge.getAttribute("data-value") || "0");
        const offset = 100 - value;
        gsap.to(gauge, {
          strokeDashoffset: offset,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: gauge, start: "top 70%" },
        });
      });

      numbers.forEach((num: any) => {
        const targetValue = parseFloat(num.getAttribute("data-value") || "0");
        const prefix = num.getAttribute("data-prefix") || "";
        const suffix = num.getAttribute("data-suffix") || "";
        const decimals = parseInt(num.getAttribute("data-decimals") || "1");

        gsap.to(num, {
          innerHTML: targetValue,
          duration: 1.5,
          ease: "power2.out",
          snap: { innerHTML: Math.pow(10, -decimals) },
          scrollTrigger: { trigger: num, start: "top 70%" },
          onUpdate: function () {
            num.innerHTML = prefix + parseFloat(num.innerHTML).toFixed(decimals) + suffix;
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <CinematicScene
      index={3}
      image="/assests/img3.png"
      position="left"
      title="FROM INFORMATION TO MEASUREMENT."
    >
      <div
        ref={containerRef}
        className="absolute right-[8%] top-[26%] w-full max-w-2xl"
        style={{ perspective: "1800px" }}
      >
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          <DataCard cardClassName="measure-card" depth="forward" className="border border-border bg-surface p-5 shadow-lg">
            <p className="font-mono text-[9px] text-muted tracking-widest mb-4 uppercase">RSI</p>
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 shrink-0 -rotate-90" viewBox="0 0 36 36">
                <path className="text-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="gauge-path text-accent" data-value="72" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-serif text-xl text-text"><span className="animated-number" data-value="72.4" data-decimals="1">0.0</span></p>
                <p className="font-mono text-[8px] text-muted uppercase">Overbought Zone</p>
              </div>
            </div>
          </DataCard>

          <DataCard cardClassName="measure-card" depth="back" className="border border-border bg-surface p-5 shadow-lg">
            <p className="font-mono text-[9px] text-muted tracking-widest mb-4 uppercase">MACD Histogram</p>
            <div className="flex items-end gap-1 h-10">
              {[2, 4, 8, 12, 18, 24, 16, 10, 5].map((h, i) => (
                <div key={i} className="w-full bg-accent opacity-60" style={{ height: `${h}px` }} />
              ))}
            </div>
            <p className="font-serif text-lg text-text mt-2"><span className="animated-number" data-value="1.2" data-prefix="+" data-decimals="1">0.0</span></p>
          </DataCard>

          <DataCard cardClassName="measure-card" depth="back" className="border border-border bg-surface p-5 shadow-lg">
            <p className="font-mono text-[9px] text-muted tracking-widest mb-4 uppercase">Volatility Index</p>
            <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path
                className="sparkline-path"
                d="M0,10 L10,12 L20,8 L30,15 L40,5 L50,18 L60,2 L70,12 L80,8 L90,14 L100,10"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-serif text-lg text-text mt-2"><span className="animated-number" data-value="14.2" data-decimals="1">0.0</span></p>
          </DataCard>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <DataCard cardClassName="measure-card" depth="forward" className="border border-border bg-surface p-5 shadow-lg">
            <p className="font-mono text-[9px] text-muted tracking-widest mb-4 uppercase">Support</p>
            <p className="font-serif text-2xl text-text"><span className="animated-number" data-value="187.40" data-prefix="$" data-decimals="2">$0.00</span></p>
            <p className="font-mono text-[8px] text-muted uppercase mt-2">−4.1% below spot</p>
          </DataCard>

          <DataCard cardClassName="measure-card" depth="primary" className="border border-border bg-surface p-5 shadow-lg">
            <p className="font-mono text-[9px] text-muted tracking-widest mb-4 uppercase">ATR (14D)</p>
            <p className="font-serif text-2xl text-text"><span className="animated-number" data-value="3.85" data-decimals="2">0.00</span></p>
            <div className="h-[2px] w-full bg-border mt-3">
              <div className="h-full bg-accent" style={{ width: "62%" }} />
            </div>
          </DataCard>

          <DataCard cardClassName="measure-card" depth="forward" className="border border-border bg-surface p-5 shadow-lg">
            <p className="font-mono text-[9px] text-muted tracking-widest mb-4 uppercase">Bollinger %B</p>
            <p className="font-serif text-2xl text-text"><span className="animated-number" data-value="0.82" data-decimals="2">0.00</span></p>
            <p className="font-mono text-[8px] text-muted uppercase mt-2">Near upper band</p>
          </DataCard>
        </div>

        {/* Row 3 — single centered card, intentionally deepest / final */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="col-start-2">
            <DataCard cardClassName="measure-card" depth="deepest" className="border border-border bg-surface p-5 shadow-lg text-center">
              <p className="font-mono text-[9px] text-muted tracking-widest mb-3 uppercase">Relative Volume</p>
              <p className="font-serif text-2xl text-text"><span className="animated-number" data-value="1.8" data-suffix="x" data-decimals="1">0.0x</span></p>
              <p className="font-mono text-[8px] text-muted uppercase mt-2">vs. 30-day average</p>
            </DataCard>
          </div>
        </div>
      </div>
    </CinematicScene>
  );
}
