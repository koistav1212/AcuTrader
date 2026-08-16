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
  const offset = DEPTH_OFFSET[depth];
  return (
    <div
      className={`${cardClassName} ${className}`}
      style={{
        transform: `translateZ(${offset.z}px) rotateX(${offset.rotateX}deg) rotateY(${offset.rotateY}deg)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
