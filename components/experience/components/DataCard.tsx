"use client";

import React, { useState } from "react";

export type CardDepth =
  | "forward"
  | "primary"
  | "back"
  | "deepest";

const DEPTH_OFFSET: Record<
  CardDepth,
  {
    z: number;
    rotateX: number;
    rotateY: number;
  }
> = {
  forward: {
    z: 20,
    rotateX: -1,
    rotateY: 1,
  },

  primary: {
    z: 0,
    rotateX: 0,
    rotateY: 0,
  },

  back: {
    z: -20,
    rotateX: 1,
    rotateY: -1,
  },

  deepest: {
    z: -36,
    rotateX: 1.5,
    rotateY: 0,
  },
};

interface DataCardProps {
  cardClassName: string;

  depth?: CardDepth;

  className?: string;

  style?: React.CSSProperties;

  children: React.ReactNode;

  expandable?: boolean;

  detail?: React.ReactNode;

  accent?:
    | "blue"
    | "green"
    | "orange"
    | "purple";
}

const accentMap = {
  blue: "var(--signal-blue)",
  green: "var(--signal-green)",
  orange: "var(--signal-orange)",
  purple: "var(--signal-purple)",
};

export function DataCard({
  cardClassName,
  depth = "primary",
  className = "",
  style,
  children,
  expandable = true,
  detail,
  accent = "blue",
}: DataCardProps) {
  const [isExpanded, setIsExpanded] =
    useState(false);

  const offset = DEPTH_OFFSET[depth];

  return (
    <div
      className={cardClassName}
      style={{
        transform:
          `translateZ(${offset.z}px) ` +
          `rotateX(${offset.rotateX}deg) ` +
          `rotateY(${offset.rotateY}deg)`,

        transformStyle: "preserve-3d",

        ...style,
      }}
    >
      <div
        onClick={() => {
          if (expandable) {
            setIsExpanded(
              (prev) => !prev
            );
          }
        }}
        className={`
          relative overflow-hidden
          border border-[var(--border)]
          bg-[var(--surface)]
          backdrop-blur-md

          transition-all duration-300
          ease-[cubic-bezier(0.16,1,0.3,1)]

          ${
            expandable
              ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(20,25,30,0.1)]"
              : ""
          }

          ${
            isExpanded
              ? "relative z-50 scale-[1.025] shadow-[0_24px_70px_rgba(20,25,30,0.16)]"
              : ""
          }

          ${className}
        `}
      >

        {/* SIGNAL EDGE */}

        <div
          className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500"
          style={{
            background:
              accentMap[accent],
            width: isExpanded
              ? "100%"
              : undefined,
          }}
        />

        <div className="relative">
          {children}
        </div>

        {expandable && (
          <div
            className={`
              overflow-hidden
              transition-all duration-300 ease-out

              ${
                isExpanded
                  ? "mt-4 max-h-48 opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >

            <div className="border-t border-[var(--border)] px-4 pt-4 pb-2">

              <p className="research-label mb-2">
                CONTEXT
              </p>

              {detail ?? (
                <p className="font-mono text-[10px] leading-relaxed text-[var(--text-secondary)]">
                  Additional historical context and analytical
                  interpretation associated with this signal.
                </p>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
