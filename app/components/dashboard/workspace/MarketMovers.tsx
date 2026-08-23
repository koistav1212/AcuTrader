"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { useMarketMovers } from "@/app/hooks/useMarketMovers";

interface Mover {
  symbol: string;
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

  const gainers: Mover[] = data?.gainers?.slice(0, 3) || [];
  const losers: Mover[] = data?.losers?.slice(0, 3) || [];
  const active: Mover[] = data?.active?.slice(0, 3) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-[var(--border)] bg-[var(--surface-solid)] rounded-md shadow-sm">
      <MoversColumn title="TOP GAINERS" items={gainers} type="positive" />
      <MoversColumn title="TOP LOSERS" items={losers} type="negative" />
      <MoversColumn title="MOST ACTIVE" items={active} type="neutral" />
    </div>
  );
}

function MoversColumn({ title, items, type }: { title: string, items: Mover[], type: "positive"|"negative"|"neutral" }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase border-b border-[var(--border)] pb-2 mb-1">{title}</h3>
      <div className="flex flex-col">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-1 cursor-pointer hover:bg-[var(--surface-muted)] transition-colors px-1 -mx-1 rounded">
            <span className="font-sans text-[13px] font-bold text-[var(--text-primary)]">{item.symbol}</span>
            {item.volume && type === "neutral" ? (
               <span className="font-mono text-[12px] font-semibold text-[var(--text-secondary)]">{item.volume}</span>
            ) : (
               <span className={cn("font-mono text-[12px] font-semibold", item.change >= 0 ? "text-[var(--positive)]" : "text-[var(--negative)]")}>
                 {item.change >= 0 ? "+" : ""}{(item.changePercent ?? item.change).toFixed(2)}%
               </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
