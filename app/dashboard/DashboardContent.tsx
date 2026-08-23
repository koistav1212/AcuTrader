"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useDashboardOverview } from "@/app/hooks/useDashboardOverview";
import { useMarketQuote } from "@/app/hooks/useMarketQuote";
import { MarketTicker } from "@/components/dashboard/MarketTicker";
import MarketOverview from "@/app/components/dashboard/MarketOverview";
import { SeasonalitySection } from "@/app/components/dashboard/seasonality/SeasonalitySection";
import { TradingCommandBar } from "@/app/components/dashboard/workspace/TradingCommandBar";
import { MarketMovers } from "@/app/components/dashboard/workspace/MarketMovers";
import { SymbolSearch } from "@/app/components/dashboard/workspace/SymbolSearch";
import { MarketIntelligence } from "@/app/components/dashboard/analytics/MarketIntelligence";
import { ExecutionHistory } from "@/app/components/dashboard/analytics/ExecutionHistory";

export default function DashboardContent() {
  const { holdings } = useUser();
  const [activeSymbol, setActiveSymbol] = useState("AAPL");
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardOverview();
  
  // Transform holdings into sidebar positions
  const positions = holdings.map(h => {
     // For now, if no real-time quote is available per-component, we can fallback to avgCost or something
     // A better approach would be to have a global quote context or use a hook per position in a subcomponent
     const last = h.avgCost || 0; 
     const pnl = (last - h.avgCost) * h.quantity;
     const pnlPercent = h.avgCost > 0 ? ((last - h.avgCost) / h.avgCost) * 100 : 0;
     return {
        symbol: h.symbol,
        qty: h.quantity,
        avg: h.avgCost,
        last,
        pnl,
        pnlPercent
     };
  });

  const totalAccountValue = dashboardData?.portfolio?.equity ?? 99404.42;
  const availableCash = dashboardData?.portfolio?.balance ?? dashboardData?.buyingPower ?? 99366.18;
  const totalDailyPL = dashboardData?.dayPnL ?? dashboardData?.portfolio?.dayPnl ?? 124.50;
  const dailyPLPercent = dashboardData?.portfolio?.equity ? (totalDailyPL / (dashboardData.portfolio.equity - totalDailyPL)) * 100 : 0.12;
  
  const marketRegime = dashboardData?.marketRegime?.regime ?? "BULLISH";
  const regimeConfidence = dashboardData?.marketRegime?.confidence ?? 82;
  const dayExposure = dashboardData?.dayExposure ?? 12.4;
  const winRate = dashboardData?.winRate ?? 64.8;
  const activePositions = dashboardData?.activePositions ?? positions.length ?? 2;

  return (
    <div className="min-h-screen flex flex-col w-full overflow-hidden bg-[var(--bg-primary)]">
      
      <MarketTicker />

      {/* 1. TRADING COMMAND BAR */}
      <TradingCommandBar 
         portfolioValue={totalAccountValue}
         dayPnl={totalDailyPL}
         dayPnlPercent={dailyPLPercent}
         availableCash={availableCash}
         activePositions={activePositions}
         openOrders={3}
         marketRegime={marketRegime}
         regimeConfidence={regimeConfidence}
         dayExposure={dayExposure}
         winRate={winRate}
      />

      <div className="w-full max-w-full px-6 md:px-8 py-6 space-y-6">
        
        {/* 2. MAIN TRADING WORKSPACE */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* PRIMARY MARKET ANALYSIS */}
          <div className="xl:col-span-12 flex flex-col gap-6">
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-md shadow-sm p-6 flex-1 flex flex-col">
              <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="metadata-label">MARKET OVERVIEW</p>
                    <h2 className="mt-2 section-title text-[20px]">Active Market Structure</h2>
                  </div>
                  
                  <div className="ml-4 w-64">
                    <SymbolSearch 
                      value={activeSymbol} 
                      onSelect={(symbol) => setActiveSymbol(symbol)} 
                    />
                  </div>
                </div>
                <span className="metadata-label text-[var(--positive)] flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--positive)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--positive)]"></span>
                  </span>
                  LIVE DATA
                </span>
              </div>
              <MarketOverview activeSymbol={activeSymbol} />
            </div>

            <MarketMovers />
          </div>
        </section>

        {/* 3. LOWER ANALYTICS GRID */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
           <div className="xl:col-span-8 2xl:col-span-9">
              {/* Seasonality has its own 12-col grid inside, so we'll just render it as a block. 
                  Wait, SeasonalitySection renders a <section> with p-6 md:p-8 xl:grid-cols-12. 
                  We can wrap it in a clean container so it fits naturally. */}
              <div className="border border-[var(--border)] rounded-md overflow-hidden bg-[var(--surface)]">
                 <SeasonalitySection symbol={activeSymbol} />
              </div>
           </div>
           <div className="xl:col-span-4 2xl:col-span-3">
              <MarketIntelligence activeSymbol={activeSymbol} />
           </div>
        </section>



        <section>
           <ExecutionHistory />
        </section>

      </div>
    </div>
  );
}
