"use client";

import React, { useEffect, useState } from "react";
import { StockCard } from "./StockCard";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketStock {
  symbol: string;
  name?: string;
  price: number;
  changesPercentage: number;
  change: number;
}

interface StockWithHistory extends MarketStock {
  history: { date: string; value: number }[];
}

export default function MarketOverview() {
  const [gainers, setGainers] = useState<StockWithHistory[]>([]);
  const [losers, setLosers] = useState<StockWithHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Top Gainers and Losers in parallel
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const [gainersRes, losersRes] = await Promise.all([
          fetch(`${baseUrl}/market/top-gainers`).then(r => r.json()),
          fetch(`${baseUrl}/market/top-losers`).then(r => r.json())
        ]);

        // Helper to process stocks
        const processStocks = (stocks: any[]) => {
          // Limit to top 10
          return stocks.slice(0, 10).map((stock) => ({
            symbol: stock.symbol,
            name: stock.name || stock.companyName || stock.symbol,
            price: stock.price,
            change: stock.change,
            changesPercentage: stock.changesPercentage,
            history: stock.chartData || [] // Use the provided chartData directly
          }));
        };

        setGainers(processStocks(gainersRes));
        setLosers(processStocks(losersRes));
      } catch (error) {
        console.error("Failed to fetch market overview data", error);
        // Fallback or empty state could be handled here
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Gainers Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <TrendingUp className="w-5 h-5" />
            </div>
            <div>
                 <h2 className="text-xl font-bold text-[var(--text)]">Top Gainers</h2>
                 <p className="text-xs text-[var(--text-secondary)]">Best performing stocks this month</p>
            </div>
        </div>
        
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4 min-w-max">
                {loading ? (
                    // Loading skeletons
                    Array.from({ length: 4 }).map((_, i) => (
                        <StockCard key={i} symbol="" name="" price={0} change={0} changePercent={0} data={[]} isLoading={true} />
                    ))
                ) : (
                    gainers.map((stock) => (
                        <StockCard
                            key={stock.symbol}
                            symbol={stock.symbol}
                            name={stock.name || stock.symbol}
                            price={stock.price}
                            change={stock.change}
                            changePercent={stock.changesPercentage}
                            data={stock.history}
                        />
                    ))
                )}
            </div>
        </div>
      </section>

      {/* Top Losers Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <TrendingDown className="w-5 h-5" />
            </div>
            <div>
                 <h2 className="text-xl font-bold text-[var(--text)]">Top Losers</h2>
                 <p className="text-xs text-[var(--text-secondary)]">Worst performing stocks this month</p>
            </div>
        </div>
        
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4 min-w-max">
                {loading ? (
                    // Loading skeletons
                     Array.from({ length: 4 }).map((_, i) => (
                        <StockCard key={i} symbol="" name="" price={0} change={0} changePercent={0} data={[]} isLoading={true} />
                    ))
                ) : (
                    losers.map((stock) => (
                        <StockCard
                            key={stock.symbol}
                            symbol={stock.symbol}
                            name={stock.name || stock.symbol}
                            price={stock.price}
                            change={stock.change}
                            changePercent={stock.changesPercentage}
                            data={stock.history}
                        />
                    ))
                )}
            </div>
        </div>
      </section>
    </div>
  );
}
