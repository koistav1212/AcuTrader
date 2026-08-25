"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Activity, BarChart2, TrendingUp, Layers } from "lucide-react";

// Lazy load the chart
const PriceChart = dynamic(() => import("@/components/charts/PriceChart"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-[var(--border)] opacity-20 rounded-md" />
  ),
});

import { useHistoricalData } from "@/app/hooks/useHistoricalData";

interface MarketOverviewProps {
  activeSymbol: string;
}

export default function MarketOverview({ activeSymbol }: MarketOverviewProps) {
  const [activeTab, setActiveTab] = useState("Price");
  const [timeframe, setTimeframe] = useState("1M");

  const tabs = [
    { id: "Price", icon: TrendingUp },
    { id: "Volume", icon: BarChart2 },
    { id: "Momentum", icon: Activity },
    { id: "Volatility", icon: Layers },
  ];

  const timeframes = ["1D", "5D", "1M", "3M", "6M", "1Y"];

  const { data: historicalData, isLoading: isHistoryLoading } = useHistoricalData(activeSymbol, timeframe, "1d");

  const chartData = React.useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];
    
    if (activeTab === "Price") {
      return historicalData.map((d: any) => ({
        time: d.date,
        value: d.close || d.price || d.value,
      }));
    }
    
    if (activeTab === "Volume") {
      return historicalData.map((d: any) => ({
        time: d.date,
        value: d.volume || 0,
      }));
    }

    if (activeTab === "Momentum") {
      // 20-period Rate of Change
      const result = [];
      for (let i = 0; i < historicalData.length; i++) {
        if (i < 20) continue; // Need 20 periods
        const currentClose = historicalData[i].close;
        const pastClose = historicalData[i - 20].close;
        const roc = pastClose ? ((currentClose - pastClose) / pastClose) * 100 : 0;
        result.push({
          time: historicalData[i].date,
          value: roc,
        });
      }
      return result;
    }

    if (activeTab === "Volatility") {
      // 20-period annualized standard deviation of returns
      const result = [];
      const returns: number[] = [];
      for (let i = 1; i < historicalData.length; i++) {
        const current = historicalData[i].close;
        const prev = historicalData[i - 1].close;
        returns.push((current - prev) / prev);

        if (returns.length >= 20) {
          const window = returns.slice(-20);
          const mean = window.reduce((a, b) => a + b, 0) / window.length;
          const variance = window.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window.length;
          const stdDev = Math.sqrt(variance);
          const annualized = stdDev * Math.sqrt(252) * 100; // as percentage
          result.push({
            time: historicalData[i].date,
            value: annualized,
          });
        }
      }
      return result;
    }

    return [];
  }, [historicalData, activeTab]);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        {/* Metric Tabs */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0 hide-scroll">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--surface-muted)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)]/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.id}
            </button>
          ))}
        </div>

        {/* Time Filters */}
        <div className="flex gap-1 bg-[var(--surface-muted)] p-1 rounded-md">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-[12px] font-mono font-bold transition-all ${
                timeframe === tf
                  ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 min-h-[450px] w-full relative">
        {isHistoryLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-solid)]/50 z-10">
            <div className="animate-pulse flex items-center text-[var(--text-secondary)]">Loading chart...</div>
          </div>
        )}
        <PriceChart data={chartData} color="#2563eb" />
      </div>

     
    </div>
  );
}

function SectorRow({ name, value, fill, type }: { name: string, value: string, fill: number, type: "positive"|"negative"|"neutral" }) {
   const colorClass = type === "positive" ? "bg-[var(--positive)] text-[var(--positive)]" : type === "negative" ? "bg-[var(--negative)] text-[var(--negative)]" : "bg-[var(--text-muted)] text-[var(--text-muted)]";
   
   return (
     <div className="flex items-center gap-3 w-full">
        <span className="w-24 truncate text-[var(--text-secondary)]">{name}</span>
        <div className="flex-1 h-1.5 bg-[var(--surface-muted)] rounded-full overflow-hidden relative">
           <div className={`absolute top-0 left-0 h-full ${type === "positive" ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} style={{ width: `${fill}%`, opacity: 0.8 }} />
        </div>
        <span className={`w-12 text-right font-bold ${type === "positive" ? "text-[var(--positive)]" : type === "negative" ? "text-[var(--negative)]" : "text-[var(--text-primary)]"}`}>{value}</span>
     </div>
   );
}