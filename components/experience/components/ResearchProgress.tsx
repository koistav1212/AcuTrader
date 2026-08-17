"use client";

import React from "react";

const STAGE_LABELS = [
  "RAW SIGNAL",
  "SIGNAL DECOMPOSITION",
  "QUANTITATIVE MEASUREMENT",
  "CORRELATION DETECTED",
  "MULTI-SOURCE SYNTHESIS",
  "STRUCTURED RESEARCH",
  "INVESTMENT THESIS",
];

interface ResearchProgressProps {
  currentSection: number; // 1-indexed
  total?: number;
}

/**
 * Fixed bottom-right index that tracks which scene is currently active.
 * currentSection is driven by ResearchExperience's ScrollTrigger.onEnter
 * callbacks — no scroll listener lives here, this just renders state.
 */
export function ResearchProgress({ currentSection, total = 7 }: ResearchProgressProps) {
  const label = STAGE_LABELS[currentSection - 1] ?? STAGE_LABELS[0];

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-2 pointer-events-none mix-blend-difference text-surface">
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-80">
        {label}
      </span>
      <span className="font-serif text-2xl tabular-nums">
        {String(currentSection).padStart(2, "0")}
        <span className="text-xs font-mono opacity-50"> / {String(total).padStart(2, "0")}</span>
      </span>
      <div className="h-[2px] w-24 bg-surface/25 overflow-hidden">
        <div
          className="h-full bg-surface transition-[width] duration-500 ease-out"
          style={{ width: `${(currentSection / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
