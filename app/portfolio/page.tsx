"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "@/app/context/UserContext";

interface EnrichedHolding {
  symbol: string;
  quantity: number;
  avgCost: number;
  marketPrice: number;
  dailyChange: number;
  marketValue: number;
}

export default function PortfolioSection() {
  const { holdings } = useUser();
  const [enrichedHoldings, setEnrichedHoldings] = useState<EnrichedHolding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarketData() {
      if (!holdings || holdings.length === 0) {
        setEnrichedHoldings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const dataPromises = holdings.map(async (h) => {
          try {
            const res = await fetch(`${baseUrl}/market/quote/${h.symbol}`);
            const quote = await res.json();
            
            // Fallback to 0 if API fails or properties missing
            const price = quote.regularMarketPrice || quote.current_price || 0;
            const change = quote.percent_change || quote.regularMarketChangePercent || 0;

            return {
              symbol: h.symbol,
              quantity: h.quantity,
              avgCost: h.avgCost,
              marketPrice: price,
              dailyChange: change,
              marketValue: h.quantity * price,
            };
          } catch (error) {
            console.error(`Failed to fetch quote for ${h.symbol}`, error);
            return {
                symbol: h.symbol,
                quantity: h.quantity,
                avgCost: h.avgCost,
                marketPrice: 0,
                dailyChange: 0,
                marketValue: 0
            };
          }
        });

        const results = await Promise.all(dataPromises);
        setEnrichedHoldings(results);
      } catch (err) {
        console.error("Error fetching portfolio market data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketData();
  }, [holdings]);

  const totalValue = enrichedHoldings.reduce(
    (sum, h) => sum + h.marketValue,
    0
  );

  if (loading) {
     return <div className="p-4 text-center text-gray-500 animate-pulse">Loading portfolio data...</div>;
  }

  if (enrichedHoldings.length === 0) {
      return (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
              <p className="text-[var(--text-secondary)]">You don't have any holdings yet.</p>
          </div>
      )
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Your Current Holdings
        </p>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Real-time snapshot of your stocks and P&L.
        </p>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-[var(--text)]">

            {/* Table Header */}
            <thead className="bg-[var(--bg-secondary)] text-xs uppercase tracking-wide text-[var(--text-secondary)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-right">Quantity</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">
                  Avg. Cost
                </th>
                <th className="px-4 py-3 text-right">Market Price</th>
                <th className="px-4 py-3 text-right">Daily Change</th>
                <th className="px-4 py-3 text-right">Market Value</th>
              </tr>
            </thead>

            <tbody>
              {enrichedHoldings.map((h, idx) => {
                const isPositive = h.dailyChange >= 0;

                return (
                  <tr
                    key={h.symbol}
                    className={cn(
                      idx % 2 === 0
                        ? "bg-[var(--bg)]"
                        : "bg-[var(--bg-secondary)]/50",
                      "transition-colors hover:bg-[var(--accent)]/10"
                    )}
                  >
                    {/* Symbol */}
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-[var(--accent)]">
                      {h.symbol}
                    </td>

                    {/* Quantity */}
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-[var(--text-secondary)]">
                      {h.quantity}
                    </td>

                    {/* Avg Cost */}
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-[var(--text-secondary)] hidden sm:table-cell">
                      ${h.avgCost.toFixed(2)}
                    </td>

                    {/* Market Price */}
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-[var(--text)]">
                      ${h.marketPrice.toFixed(2)}
                    </td>

                    {/* Daily Change */}
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-semibold ring-1",
                          isPositive
                            ? "bg-[var(--profit)]/15 text-[var(--profit)] ring-[var(--profit)]/40"
                            : "bg-[var(--loss)]/15 text-[var(--loss)] ring-[var(--loss)]/40"
                        )}
                      >
                        {isPositive ? (
                          <ChevronUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ChevronDown className="w-3 h-3 mr-1" />
                        )}
                        {h.dailyChange}%
                      </span>
                    </td>

                    {/* Market Value */}
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-[var(--text)]">
                      ${h.marketValue.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* Total Portfolio Value Box */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-right text-sm font-semibold text-[var(--text)] shadow-xl">
        Total Portfolio Market Value:
        <span className="text-lg text-[var(--profit)] ml-1">
          ${totalValue.toFixed(2)}
        </span>
      </div>
    </section>
  );
}
