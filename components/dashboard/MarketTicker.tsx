"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";

interface TickerItem {
  symbol: string;
  price: number;
  changePercent: number;
}

export function MarketTicker() {
  const [data, setData] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a WebSocket or frequent polling.
    // We mock the indices here based on the user's example.
    const mockData: TickerItem[] = [
      { symbol: "NIFTY 50", price: 24850.30, changePercent: 0.46 },
      { symbol: "SENSEX", price: 81420.50, changePercent: 0.38 },
      { symbol: "BANK NIFTY", price: 52140.20, changePercent: -0.21 },
      { symbol: "USD/INR", price: 83.42, changePercent: 0.08 },
      { symbol: "GOLD", price: 72450.00, changePercent: 0.32 },
      { symbol: "VIX", price: 14.20, changePercent: -1.12 },
    ];
    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) return <div className="h-[40px] border-b border-[var(--border)] bg-[var(--surface-solid)] w-full" />;

  return (
    <div className="flex h-[40px] w-full items-center overflow-x-auto border-b border-[var(--border)] bg-[var(--surface-solid)] px-6 md:px-8 custom-scrollbar whitespace-nowrap hide-scroll">
      <div className="flex items-center gap-8">
        {data.map((item) => {
          const isUp = item.changePercent >= 0;
          return (
            <div key={item.symbol} className="flex items-center gap-3">
              <span className="font-sans text-[13px] font-semibold text-[var(--text-primary)] tracking-wide">
                {item.symbol}
              </span>
              <span className="font-mono text-[13px] font-medium text-[var(--text-primary)]">
                {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={cn(
                  "font-mono text-[13px] font-bold",
                  isUp ? "text-[var(--positive)]" : "text-[var(--negative)]"
                )}
              >
                {isUp ? "+" : ""}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
