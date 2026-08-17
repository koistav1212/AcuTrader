"use client";

import { useEffect, useState } from "react";
import HoldingsTable from "./_components/HoldingsTable";
import { getPortfolioSummary, getHoldings, PortfolioSummary, Holding } from "@/app/services/portfolioService";
import { MetricCard } from "@/components/platform/MetricCard";
import { ResearchCard } from "@/components/platform/ResearchCard";

export default function PortfolioPage() {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [summaryData, holdingsData] = await Promise.all([
          getPortfolioSummary().catch(err => {
            console.error(err);
            return null;
          }),
          getHoldings().catch(err => {
            console.error(err);
            return [];
          })
        ]);

        setSummary(summaryData);
        setHoldings(holdingsData);
      } catch (err) {
        console.error("Failed to load portfolio data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalValue = summary ? `$${summary.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";
  const unrealizedPnl = summary ? summary.unrealizedPnl : 0;
  const dayPnl = summary ? summary.dayPnl : 0;
  const equity = summary?.equity || 1;
  const dayPnlPercent = (dayPnl / (equity - dayPnl)) * 100 || 0;
  const totalReturnPercent = (unrealizedPnl / (equity - unrealizedPnl)) * 100 || 0;

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--border)] px-6 py-6 md:px-8">
        <p className="metadata-label">
          02 / CAPITAL ALLOCATION
        </p>

        <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="page-title">
              PORTFOLIO
              <br />
              EXPOSURE.
            </h1>

            <p className="mt-4 max-w-xl font-sans text-[14px] leading-relaxed text-[var(--text-secondary)]">
              Evaluate capital allocation, risk concentration and
              position-level performance across the active portfolio.
            </p>
          </div>

          <div className="text-right">
            <p className="metadata-label mb-1 text-[var(--text-muted)]">TOTAL MARKET VALUE</p>
            <p className="kpi-value text-[32px] md:text-[48px]">{totalValue}</p>
          </div>
        </div>
      </header>

      {/* KPI STRIP */}
      <section className="grid grid-cols-1 gap-px bg-[var(--border)] md:grid-cols-3 border-b border-[var(--border)]">
        <MetricCard
          label="Total Return"
          value={`${unrealizedPnl >= 0 ? "+" : ""}$${Math.abs(unrealizedPnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={`${unrealizedPnl >= 0 ? "+" : ""}${totalReturnPercent.toFixed(2)}%`}
          accent={unrealizedPnl >= 0 ? "green" : "red"}
          description="Total unrealized profit and loss across all open positions."
        />

        <MetricCard
          label="Session Return"
          value={`${dayPnl >= 0 ? "+" : ""}$${Math.abs(dayPnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={`${dayPnl >= 0 ? "+" : ""}${dayPnlPercent.toFixed(2)}%`}
          accent={dayPnl >= 0 ? "blue" : "red"}
          description="Daily mark-to-market performance of active portfolio."
        />

        <MetricCard
          label="Risk Profile"
          value="MODERATE"
          accent="orange"
          description="Aggregated risk assessment based on sector exposure and volatility."
        />
      </section>

      {/* EXISTING POSITIONS */}
      <section className="p-6 md:p-10">
        <ResearchCard
          accent="blue"
          interactive={false}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
            <div>
              <p className="metadata-label">
                ACTIVE POSITIONS
              </p>
              <h2 className="mt-2 section-title">
                Capital Deployment
              </h2>
            </div>
            <span className="metadata-label text-[var(--info)]">
              LIVE PORTFOLIO
            </span>
          </div>

          <div className="p-6">
            <HoldingsTable holdings={holdings} loading={loading} />
          </div>
        </ResearchCard>
      </section>
    </main>
  );
}
