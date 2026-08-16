"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ParallaxConfig {
  /** 0 = pinned to background (near-static), 1 = moves at full scroll speed. */
  speed?: number;
  /** Which axis the parallax drift applies to. */
  axis?: "x" | "y" | "both";
  /** Max px of vertical drift across the trigger's scroll range. */
  distance?: number;
  /** Optional horizontal drift in px, independent of `distance`. */
  driftX?: number;
  /** Optional subtle rotation (deg) tied to scroll progress. */
  rotate?: number;
  /** Scrub smoothing — higher = lazier/heavier follow. */
  scrub?: number | boolean;
  trigger?: React.RefObject<HTMLElement>;
  start?: string;
  end?: string;
}

/**
 * Attaches a scroll-scrubbed transform to `ref`. All work happens via
 * gsap.quickTo/ScrollTrigger transforms (translate3d), never React state,
 * so scroll never causes a re-render.
 */
export function useParallax<T extends HTMLElement>(
  config: ParallaxConfig = {}
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      speed = 0.3,
      distance = 80,
      driftX = 0,
      rotate = 0,
      scrub = 1,
      trigger,
      start = "top bottom",
      end = "bottom top",
    } = config;

    const triggerEl = trigger?.current ?? el.closest(".scene-section") ?? el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          y: distance * speed,
          x: driftX ? driftX * speed : 0,
          rotate: rotate ? rotate * speed : 0,
        },
        {
          y: -distance * speed,
          x: driftX ? -driftX * speed : 0,
          rotate: rotate ? -rotate * speed : 0,
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            start,
            end,
            scrub,
          },
        }
      );
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * Convenience preset matching the three-depth-layer system from the design
 * brief: background (0.15), contextual data (0.35-0.4), primary content (0.65).
 */
export const PARALLAX_PRESETS: Record<string, ParallaxConfig> = {
  background: { speed: 0.15, distance: 40, scrub: 1.4 },
  context: { speed: 0.35, distance: 90, driftX: 24, scrub: 1 },
  primary: { speed: 0.65, distance: 140, scrub: 0.6 },
};
