"use client";

import React from "react";

export type CardDepth = "forward" | "primary" | "back" | "deepest";

const DEPTH_OFFSET: Record<CardDepth, { z: number; rotateX: number; rotateY: number }> = {
  forward: { z: 20, rotateX: -1, rotateY: 1 },
  primary: { z: 0, rotateX: 0, rotateY: 0 },
  back: { z: -20, rotateX: 1, rotateY: -1 },
  deepest: { z: -36, rotateX: 1.5, rotateY: 0 },
};

interface DataCardProps {
  /** className on the .data-card / .measure-card element the scene's
   *  GSAP timeline queries — keep this so scroll entrance still targets it. */
  cardClassName: string;
  depth?: CardDepth;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * A single card in the 3D data-table cluster (see MeasurementScene).
 * Depth is a fixed compositional offset (not scroll-linked) — it just
 * gives the cluster believable perspective once cards have settled in.
 * The entrance animation itself (opacity/blur/translateY/rotateX) is
 * still driven by the parent scene's GSAP timeline via `cardClassName`.
 */
export function DataCard({
  cardClassName,
  depth = "primary",
  className = "",
  style,
  children,
}: DataCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const offset = DEPTH_OFFSET[depth];
  
  return (
    <div
      className={cardClassName}
      style={{
        transform: `translateZ(${offset.z}px) rotateX(${offset.rotateX}deg) rotateY(${offset.rotateY}deg)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <div 
        className={`cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${className} ${
          isExpanded ? "scale-[1.03] shadow-2xl z-50 relative bg-surface/95" : "hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {children}
        
        {/* Expanded state detail panel */}
        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-32 opacity-100 mt-4 pt-4 border-t border-border" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <p className="font-mono text-[9px] text-muted-faint uppercase mb-1">Historical Context</p>
          <p className="text-xs text-muted leading-relaxed">
            This metric has breached this threshold 3 times in the last 12 months. 
            Historically, it precedes a median reversion within 14 trading days.
          </p>
        </div>
      </div>
    </div>
  );
}
