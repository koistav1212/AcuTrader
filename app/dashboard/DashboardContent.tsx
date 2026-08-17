"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { MarketTicker } from "@/components/dashboard/MarketTicker";
import MarketOverview from "@/app/components/dashboard/MarketOverview";
import { SeasonalitySection } from "@/app/components/dashboard/seasonality/SeasonalitySection";
import { TradingCommandBar } from "@/app/components/dashboard/workspace/TradingCommandBar";
import { MarketMovers } from "@/app/components/dashboard/workspace/MarketMovers";
import { MarketIntelligence } from "@/app/components/dashboard/analytics/MarketIntelligence";
import { ExecutionHistory } from "@/app/components/dashboard/analytics/ExecutionHistory";

export default function DashboardContent() {
  const { holdings } = useUser();
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchQuotes() {
      if (holdings.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://acutrader-backend.onrender.com/api";
        const promises = holdings.map(h => 
           fetch(`${baseUrl}/market/quote/${h.symbol}`).then(r => r.json()).catch(() => ({}))
        );
        
        const results = await Promise.all(promises);
        const newQuotes: Record<string, any> = {};
        
        results.forEach((q, i) => {
           if (q && (q.symbol || holdings[i].symbol)) {
              newQuotes[q.symbol || holdings[i].symbol] = q;
           }
        });

        if (mounted) {
          setQuotes(newQuotes);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard quotes", e);
        if (mounted) setLoading(false);
      }
    }

    fetchQuotes();
    return () => { mounted = false; };
  }, [holdings]);

  const [summary, setSummary] = useState<any>(null);
  
  useEffect(() => {
     async function fetchSummary() {
         try {
             const { getPortfolioSummary } = await import('@/app/services/portfolioService');
             const data = await getPortfolioSummary();
             setSummary(data);
         } catch (e) {
             console.error("Dashboard summary fetch failed", e);
         }
     }
     fetchSummary();
  }, []);

  const totalAccountValue = summary ? summary.equity : 99404.42;
  const availableCash = summary ? summary.balance : 99366.18;
  const totalDailyPL = summary ? summary.dayPnl : 124.50;
  const dailyPLPercent = summary && summary.equity ? (summary.dayPnl / (summary.equity - summary.dayPnl)) * 100 : 0.12;
  
  // Transform holdings into sidebar positions
  const positions = holdings.map(h => {
     const quote = quotes[h.symbol] || {};
     const last = quote.regularMarketPrice || quote.current_price || h.avgCost || 0;
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

  return (
    <div className="min-h-screen flex flex-col w-full overflow-hidden bg-[var(--bg-primary)]">
      
      <MarketTicker />

      {/* 1. TRADING COMMAND BAR */}
      <TradingCommandBar 
         portfolioValue={totalAccountValue}
         dayPnl={totalDailyPL}
         dayPnlPercent={dailyPLPercent}
         availableCash={availableCash}
         activePositions={positions.length || 2}
         openOrders={3}
         marketRegime="BULLISH"
         regimeConfidence={82}
         dayExposure={12.4}
         winRate={64.8}
      />

      <div className="w-full max-w-full px-6 md:px-8 py-6 space-y-6">
        
        {/* 2. MAIN TRADING WORKSPACE */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* PRIMARY MARKET ANALYSIS */}
          <div className="xl:col-span-12 flex flex-col gap-6">
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-md shadow-sm p-6 flex-1 flex flex-col">
              <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <p className="metadata-label">MARKET OVERVIEW</p>
                  <h2 className="mt-2 section-title text-[20px]">Active Market Structure</h2>
                </div>
                <span className="metadata-label text-[var(--positive)] flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--positive)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--positive)]"></span>
                  </span>
                  LIVE DATA
                </span>
              </div>
              <MarketOverview />
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
                 <SeasonalitySection />
              </div>
           </div>
           <div className="xl:col-span-4 2xl:col-span-3">
              <MarketIntelligence />
           </div>
        </section>



        <section>
           <ExecutionHistory />
        </section>

      </div>
    </div>
  );
}
