"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface Mover {
  symbol: string;
  price: number;
  change: number;
  volume?: string;
}

export function MarketMovers() {
  const gainers: Mover[] = [
    { symbol: "NVDA", price: 115.42, change: 2.34 },
    { symbol: "AMD", price: 145.20, change: 1.89 },
    { symbol: "META", price: 485.12, change: 1.42 },
  ];

  const losers: Mover[] = [
    { symbol: "TSLA", price: 212.44, change: -1.22 },
    { symbol: "NFLX", price: 620.10, change: -0.98 },
    { symbol: "INTC", price: 30.25, change: -0.76 },
  ];

  const active: Mover[] = [
    { symbol: "NVDA", price: 115.42, change: 2.34, volume: "42.1M" },
    { symbol: "TSLA", price: 212.44, change: -1.22, volume: "36.8M" },
    { symbol: "AMD", price: 145.20, change: 1.89, volume: "28.4M" },
  ];

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
            {item.volume ? (
               <span className="font-mono text-[12px] font-semibold text-[var(--text-secondary)]">{item.volume}</span>
            ) : (
               <span className={cn("font-mono text-[12px] font-semibold", item.change >= 0 ? "text-[var(--positive)]" : "text-[var(--negative)]")}>
                 {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
               </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
