"use client";

import React, { useState } from "react";
import { ResearchCard } from "./ResearchCard";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  description?: string;
  accent?: "blue" | "green" | "orange" | "purple" | "red";
  detail?: React.ReactNode;
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  change,
  description,
  accent = "blue",
  detail,
  onClick,
}: MetricCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded((prev) => !prev);
    onClick?.();
  };

  return (
    <ResearchCard
      accent={accent}
      className="cursor-pointer p-5"
    >
      <button
        onClick={handleClick}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="metadata-label text-[var(--text-secondary)]">
            {label}
          </span>

          {change && (
            <span
              className="font-mono text-[12px] font-semibold"
              style={{
                color:
                  accent === "green"
                    ? "var(--positive)"
                    : accent === "orange"
                    ? "var(--warning)"
                    : accent === "purple"
                    ? "var(--signal-purple)"
                    : accent === "red"
                    ? "var(--negative)"
                    : "var(--info)",
              }}
            >
              {change}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between">
          <span className="kpi-value">
            {value}
          </span>

          <span className="metadata-label text-[var(--text-muted)]">
            {expanded ? "CLOSE −" : "DETAILS +"}
          </span>
        </div>

        {description && (
          <p className="mt-3 font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </button>

      <div
        className={`
          overflow-hidden
          transition-all duration-300 ease-out
          ${expanded ? "max-h-48 opacity-100 mt-5" : "max-h-0 opacity-0"}
        `}
      >
        <div className="border-t border-[var(--border)] pt-4 mt-4">
          {detail ?? (
            <p className="font-sans text-[13px] leading-relaxed text-[var(--text-secondary)]">
              Historical observations and supporting market context
              will appear here.
            </p>
          )}
        </div>
      </div>
    </ResearchCard>
  );
}
