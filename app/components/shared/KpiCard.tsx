"use client";

import React from "react";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  subtitle?: string;
  value: string;
  accent?: string; // gradient override
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  subtitle,
  value,
  accent = "",
  icon: Icon,
  change,
  isPositive: explicitPositive,
}) => {
  const isPositive = explicitPositive !== undefined ? explicitPositive : change?.startsWith("+");

  // Accent logic:
  // - Daily P&L uses profit/loss colors
  // - Otherwise fallback to accent or brand accent
  const accentStyles =
    title.includes("Daily P&L")
      ? isPositive
        ? "from-[var(--profit)] to-[var(--accent)]"
        : "from-[var(--loss)] to-red-600"
      : accent
      ? accent
      : "from-[var(--accent)] to-[var(--accent-hover)]";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--border)]/30 p-[1px] shadow-xl">
      {/* Inner Card */}
      <div className="flex h-full flex-col justify-between rounded-2xl bg-[var(--card)] px-5 py-4 transition-colors">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              {title}
            </p>

            {subtitle && (
              <p className="mt-1 text-[0.7rem] text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon */}
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accentStyles}`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Main Value */}
        <p className="mt-4 text-3xl font-semibold text-[var(--text)]">
          {value}
        </p>

        {/* Change Indicator */}
        {change && (
          <div
            className={`mt-2 flex items-center text-xs font-semibold ${
              isPositive ? "text-[var(--profit)]" : "text-[var(--loss)]"
            }`}
          >
            {isPositive ? (
              <ChevronUp className="w-4 h-4 mr-1" />
            ) : (
              <ChevronDown className="w-4 h-4 mr-1" />
            )}
            {change} Today
          </div>
        )}
      </div>
    </div>
  );
};
