"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface TradingCommandBarProps {
  portfolioValue: number;
  dayPnl: number;
  dayPnlPercent: number;
  availableCash: number;
  activePositions: number;
  openOrders: number;
  marketRegime: string;
  regimeConfidence: number;
  dayExposure: number;
  winRate: number;
}

export function TradingCommandBar({
  portfolioValue,
  dayPnl,
  dayPnlPercent,
  availableCash,
  activePositions,
  openOrders,
  marketRegime,
  regimeConfidence,
  dayExposure,
  winRate,
}: TradingCommandBarProps) {
  const isPositiveDay = dayPnl >= 0;

  return (
    <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden w-full border-b border-[var(--border)] bg-[var(--bg-primary)] scrollbar-hide py-2 px-6 md:px-8 gap-4">
      <CommandCard 
        label="PORTFOLIO VALUE" 
        value={`$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        subValue="Live / Paper"
        accent="blue"
      />
      <CommandCard 
        label="TODAY'S P&L" 
        value={`${isPositiveDay ? "+" : ""}$${dayPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        subValue={`${isPositiveDay ? "+" : ""}${dayPnlPercent.toFixed(2)}%`}
        accent={isPositiveDay ? "green" : "red"}
      />
      <CommandCard 
        label="AVAILABLE CASH" 
        value={`$${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        accent="slate"
      />
      <CommandCard 
        label="BUYING POWER" 
        value={`$${(availableCash * 2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} // Approx 2x margin
        accent="slate"
      />
      <CommandCard 
        label="ACTIVE POSITIONS" 
        value={activePositions.toString().padStart(2, "0")}
        accent="amber"
      />
    
      <CommandCard 
        label="MARKET REGIME" 
        value={marketRegime}
        subValue={`${regimeConfidence}% confidence`}
        accent="purple"
      />
      <CommandCard 
        label="DAY EXPOSURE" 
        value={`${dayExposure.toFixed(1)}%`}
        accent="slate"
      />
      <CommandCard 
        label="WIN RATE" 
        value={`${winRate.toFixed(1)}%`}
        accent="slate"
      />
    </div>
  );
}

function CommandCard({ label, value, subValue, accent }: { label: string; value: string; subValue?: string; accent: "blue" | "green" | "red" | "amber" | "purple" | "slate" }) {
  const accentColors = {
    blue: "border-l-[#3b82f6]",
    green: "border-l-[#22c55e]",
    red: "border-l-[#ef4444]",
    amber: "border-l-[#f59e0b]",
    purple: "border-l-[#8b5cf6]",
    slate: "border-l-transparent",
  };
  
  const valueColors = {
    blue: "text-[var(--text-primary)]",
    green: "text-[var(--positive)]",
    red: "text-[var(--negative)]",
    amber: "text-[var(--text-primary)]",
    purple: "text-[#8b5cf6]",
    slate: "text-[var(--text-primary)]",
  };

  return (
    <div className={cn(
      "flex flex-col justify-center min-w-[160px] max-w-[220px] shrink-0 border-l-2 pl-3 py-1",
      accentColors[accent]
    )}>
      <span className="font-mono text-[11px] tracking-widest text-[var(--text-muted)] uppercase mb-1 whitespace-nowrap">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-sans text-[20px] md:text-[24px] font-bold leading-none tracking-tight", valueColors[accent])}>
          {value}
        </span>
      </div>
      {subValue && (
        <span className={cn(
          "font-mono text-[11px] mt-1 whitespace-nowrap",
          accent === "green" ? "text-[var(--positive)]" : accent === "red" ? "text-[var(--negative)]" : "text-[var(--text-secondary)]"
        )}>
          {subValue}
        </span>
      )}
    </div>
  );
}
