"use client";

import React from "react";
import { useParallax, PARALLAX_PRESETS, ParallaxConfig } from "../hooks/useParallax";

type DepthName = "background" | "context" | "primary";

interface DepthLayerProps extends ParallaxConfig {
  depth?: DepthName;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Wraps a chunk of scene content in a parallax layer. Pass `depth` for one
 * of the three standard speeds, or override any ParallaxConfig field
 * directly (e.g. <DepthLayer depth="context" driftX={-16}>).
 */
export function DepthLayer({
  depth = "context",
  className = "",
  style,
  children,
  ...overrides
}: DepthLayerProps) {
  const config = { ...PARALLAX_PRESETS[depth], ...overrides };
  const ref = useParallax<HTMLDivElement>(config);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
