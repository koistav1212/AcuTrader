"use client";

import { Info } from "lucide-react";
import { PortfolioSummary } from "@/app/services/portfolioService";

interface PortfolioSummaryCardsProps {
  data: PortfolioSummary | null;
  loading: boolean;
}

export default function PortfolioSummaryCards({ data, loading }: PortfolioSummaryCardsProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--card)]/50" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "TOTAL EQUITY",
      value: data.equity,
      tooltip: "Total account value including open trades",
      format: (v: number) => `$${v?.toFixed(2) ?? "0.00"}`,
      color: "text-[var(--text)]",
    },
    {
      label: "AVAILABLE CASH",
      value: data.balance, // Mapping balance to Available Cash as per Step 2
      tooltip: "Closed profit only",
      format: (v: number) => `$${v?.toFixed(2) ?? "0.00"}`,
      color: "text-[var(--text)]",
    },
    {
      label: "UNREALIZED P&L",
      value: data.unrealizedPnl,
      tooltip: "Profit if you exit now",
      format: (v: number) => `$${v?.toFixed(2) ?? "0.00"}`,
      // Color logic will be handled below
      isPnl: true,
    },
    {
      label: "DAY P&L",
      value: data.dayPnl,
      tooltip: "Change since yesterday’s close",
      format: (v: number) => `$${v?.toFixed(2) ?? "0.00"}`,
      isPnl: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => {
        let valueColor = card.color;
        if (card.isPnl) {
          valueColor = card.value >= 0 ? "text-[var(--profit)]" : "text-[var(--loss)]";
        }

        return (
          <div
            key={card.label}
            className="relative flex flex-col justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
              {card.label}
              <div className="group relative ml-1 cursor-help">
                <Info className="h-3 w-3 opacity-50 transition-opacity hover:opacity-100" />
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-10">
                  {card.tooltip}
                  <div className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-black"></div>
                </div>
              </div>
            </div>
            <div className={`text-xl font-bold ${valueColor}`}>
              {card.format(card.value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
