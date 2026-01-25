"use client";

import { useEffect, useState } from "react";
import PortfolioSummaryCards from "./_components/PortfolioSummaryCards";
import HoldingsTable from "./_components/HoldingsTable";
import { getPortfolioSummary, getHoldings, PortfolioSummary, Holding } from "@/app/services/portfolioService";

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

  return (
    <div className="space-y-6 pb-20">
      
      <div className="grid grid-cols-1 gap-6">
        {/* 1. Summary Cards */}
        <PortfolioSummaryCards data={summary} loading={loading} />

        {/* 2. Holdings Table */}
        <div>
           <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
               Active Positions
           </h3>
           <HoldingsTable holdings={holdings} loading={loading} />
        </div>
      </div>

    </div>
  );
}
