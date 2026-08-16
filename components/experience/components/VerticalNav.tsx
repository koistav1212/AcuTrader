"use client";

import React from "react";

const NAV_ITEMS = [
  "INITIALIZATION",
  "RAW SIGNAL",
  "QUANTITATIVE",
  "CORRELATION",
  "SYNTHESIS",
  "RESEARCH",
  "THESIS",
];

export function VerticalNav({ currentSection }: { currentSection: number }) {
  const handleScrollTo = (index: number) => {
    const scene = document.getElementById(`scene-${index}`);
    if (!scene) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Research sections"
      className="fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 font-mono text-[9px] tracking-widest md:block"
    >
      <ol className="flex flex-col gap-4">
      {NAV_ITEMS.map((item, idx) => {
        const isActive = currentSection === idx + 1;
        
        return (
          <li key={item} className="relative">
            <button
            type="button"
            key={idx} 
            onClick={() => handleScrollTo(idx)}
            aria-current={isActive ? "step" : undefined}
            aria-label={`Go to section ${idx + 1}: ${item}`}
            className={`pointer-events-auto group flex min-h-6 items-center gap-3 text-left transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
              isActive ? "text-text opacity-100" : "text-muted opacity-40 hover:opacity-80"
            }`}
          >
            {/* The Node Indicator */}
            <div className="relative flex items-center justify-center w-4 h-4">
              <div className={`absolute w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                isActive ? "bg-accent" : "bg-muted group-hover:bg-text"
              }`} />
              {isActive && (
                <div className="absolute w-3 h-3 rounded-full border border-accent opacity-50 animate-ping" style={{ animationDuration: '3s' }} />
              )}
            </div>
            
            {/* The Line Connector (except last item) */}
            {idx < NAV_ITEMS.length - 1 && (
              <div className="absolute left-[7px] top-[14px] w-[1px] h-6 bg-border -z-10" />
            )}

            {/* The Label */}
            <span className={`transition-all duration-500 ${isActive ? "font-bold tracking-[0.25em]" : ""}`}>
              {String(idx + 1).padStart(2, "0")} {isActive && item}
            </span>
            </button>
          </li>
        );
      })}
      </ol>
    </nav>
  );
}
