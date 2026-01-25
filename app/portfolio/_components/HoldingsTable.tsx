"use client";

import { Holding } from "@/app/services/portfolioService";
import { cn } from "@/app/lib/utils";

interface HoldingsTableProps {
  holdings: Holding[];
  loading: boolean;
}

export default function HoldingsTable({ holdings, loading }: HoldingsTableProps) {
  if (loading) {
    return <div className="p-8 text-center text-[var(--text-secondary)] animate-pulse">Loading holdings...</div>;
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <p className="text-[var(--text-secondary)]">No open positions.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 text-xs uppercase text-[var(--text-secondary)]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Symbol</th>
              <th className="px-4 py-3 text-center font-medium">Side</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 text-right font-medium">Avg Entry</th>
              <th className="px-4 py-3 text-right font-medium">Last Price</th>
              <th className="px-4 py-3 text-right font-medium">Unrealized P&L</th>
              <th className="px-4 py-3 text-right font-medium">% Return</th>
              <th className="px-4 py-3 text-right font-medium">SL / TP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {holdings.map((h) => {
              const isProfit = h.unrealizedPnl >= 0;
              const pnlColor = isProfit ? "text-[var(--profit)]" : "text-[var(--loss)]";

              return (
                <tr key={h.symbol} className="group hover:bg-[var(--bg-secondary)]/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-[var(--text)]">
                      {h.symbol}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                        h.side === "BUY" 
                          ? "bg-[var(--profit)]/10 text-[var(--profit)]" 
                          : h.side === "SELL" || h.side === "SHORT" 
                            ? "bg-[var(--loss)]/10 text-[var(--loss)]"
                            : "bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]" 
                      )}
                    >
                      {h.side}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--text)]">{h.quantity}</td>
                  <td className="px-4 py-3 text-right text-[var(--text-secondary)]">${h.avgCost?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-[var(--text)]">${h.currentPrice?.toFixed(2)}</td>
                  
                  {/* Unrealized P&L */}
                  <td className={cn("px-4 py-3 text-right font-medium", pnlColor)}>
                    {h.unrealizedPnl >= 0 ? "+" : ""}${h.unrealizedPnl?.toFixed(2)}
                  </td>
                  
                  {/* % Return */}
                  <td className={cn("px-4 py-3 text-right font-medium", pnlColor)}>
                    {h.returnPercent >= 0 ? "+" : ""}{h.returnPercent?.toFixed(2)}%
                  </td>

                  {/* SL / TP */}
                  <td className="px-4 py-3 text-right text-[var(--text-secondary)] text-xs">
                     - / -
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
