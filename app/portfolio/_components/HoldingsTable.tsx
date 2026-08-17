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
        <table className="min-w-full text-[14px]">
          <thead className="bg-[var(--surface-muted)] text-[12px] uppercase text-[var(--text-secondary)] tracking-wider border-b border-[var(--border)] font-bold">
            <tr>
              <th className="px-4 py-4 text-left font-bold">Symbol</th>
              <th className="px-4 py-4 text-center font-bold">Side</th>
              <th className="px-4 py-4 text-right font-bold">Qty</th>
              <th className="px-4 py-4 text-right font-bold">Avg Entry</th>
              <th className="px-4 py-4 text-right font-bold">Last Price</th>
              <th className="px-4 py-4 text-right font-bold">Unrealized P&L</th>
              <th className="px-4 py-4 text-right font-bold">% Return</th>
              <th className="px-4 py-4 text-right font-bold">SL / TP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {holdings.map((h) => {
              const isProfit = h.unrealizedPnl >= 0;
              const pnlColor = isProfit ? "text-[var(--positive)]" : "text-[var(--negative)]";

              return (
                <tr key={h.symbol} className="group hover:bg-[var(--surface-muted)] transition-colors">
                  <td className="px-4 py-4 table-primary font-bold">
                      {h.symbol}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={cn(
                        "rounded px-2 py-1 metadata-label text-[11px]",
                        h.side === "BUY" 
                          ? "bg-[var(--positive)]/10 text-[var(--positive)] border border-[var(--positive)]/20" 
                          : h.side === "SELL" || h.side === "SHORT" 
                            ? "bg-[var(--negative)]/10 text-[var(--negative)] border border-[var(--negative)]/20"
                            : "bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]" 
                      )}
                    >
                      {h.side}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-[14px] font-medium text-[var(--text-primary)]">{h.quantity}</td>
                  <td className="px-4 py-4 text-right table-secondary">${h.avgCost?.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right font-mono text-[14px] font-semibold text-[var(--text-primary)]">${h.currentPrice?.toFixed(2)}</td>
                  
                  {/* Unrealized P&L */}
                  <td className={cn("px-4 py-4 text-right font-mono text-[14px] font-semibold", pnlColor)}>
                    {h.unrealizedPnl >= 0 ? "+" : ""}${h.unrealizedPnl?.toFixed(2)}
                  </td>
                  
                  {/* % Return */}
                  <td className={cn("px-4 py-4 text-right font-mono text-[14px] font-semibold", pnlColor)}>
                    {h.returnPercent >= 0 ? "+" : ""}{h.returnPercent?.toFixed(2)}%
                  </td>

                  {/* SL / TP */}
                  <td className="px-4 py-4 text-right table-secondary">
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
