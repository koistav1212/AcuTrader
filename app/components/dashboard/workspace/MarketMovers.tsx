"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { useMarketMovers } from "@/app/hooks/useMarketMovers";

interface Mover {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  volume?: string | number;
  changePercent?: number;
}

export function MarketMovers() {
  const { data, isLoading } = useMarketMovers();

  if (isLoading) {
    return <div className="p-4 animate-pulse bg-[var(--surface-solid)] rounded-md border border-[var(--border)] h-[120px]">Loading movers...</div>;
  }

  const gainers: Mover[] = data?.gainers?.slice(0, 10) || [];
  const losers: Mover[] = data?.losers?.slice(0, 10) || [];
  const active: Mover[] = data?.active?.slice(0, 10) || [];

  return (
    <div className="flex flex-col gap-6 p-4 border border-[var(--border)] bg-[var(--surface-solid)] rounded-md shadow-sm">
      <MoversRow title="TOP GAINERS" items={gainers} />
      <MoversRow title="TOP LOSERS" items={losers} />
      <MoversRow title="MOST ACTIVE" items={active} />
    </div>
  );
}

function formatVolume(vol: number | string | undefined): string {
  if (vol === undefined || vol === null) return "N/A";
  const num = typeof vol === "string" ? parseFloat(vol.replace(/,/g, "")) : vol;
  if (isNaN(num)) return vol.toString();
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toString();
}

function formatPrice(price: number): string {
  if (price < 1) return price.toPrecision(4);
  return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function MoverCard({ item }: { item: Mover }) {
  const changePercent = item.changePercent ?? item.change;
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  
  const colorClass = isPositive 
    ? "text-[var(--positive)]" 
    : isNegative 
      ? "text-[var(--negative)]" 
      : "text-[var(--text-secondary)]";
      
  const arrow = isPositive ? "↑" : isNegative ? "↓" : "";
  const sign = isPositive ? "+" : "";

  return (
    <div className="flex flex-col min-w-[220px] max-w-[220px] p-3 rounded border border-[var(--border)] bg-[var(--surface-muted)] hover:bg-[var(--surface)] transition-colors shrink-0">
      <div className="font-sans text-[14px] font-bold text-[var(--text-primary)] truncate">
        {item.symbol}
      </div>
      <div className="font-sans text-[12px] text-[var(--text-secondary)] truncate mb-3">
        {item.name || "\u00A0"}
      </div>
      
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-[13px] font-semibold text-[var(--text-primary)]">
          ${formatPrice(item.price)}
        </span>
        <span className={cn("font-mono text-[13px] font-semibold", colorClass)}>
          {arrow} {sign}{changePercent.toFixed(2)}%
        </span>
      </div>
      <div className="font-mono text-[11px] text-[var(--text-muted)]">
        Volume {formatVolume(item.volume)}
      </div>
    </div>
  );
}

function MoversRow({ title, items }: { title: string, items: Mover[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <h3 className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase border-b border-[var(--border)] pb-2 mb-3">
        {title}
      </h3>
      <div 
        className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" 
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, idx) => (
          <MoverCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}
