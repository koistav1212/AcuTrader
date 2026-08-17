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

export default function MarketOverview() {
  const [activeTab, setActiveTab] = useState("Price");
  const [timeframe, setTimeframe] = useState("1M");

  const tabs = [
    { id: "Price", icon: TrendingUp },
    { id: "Volume", icon: BarChart2 },
    { id: "Momentum", icon: Activity },
    { id: "Volatility", icon: Layers },
  ];

  const timeframes = ["1D", "5D", "1M", "3M", "6M", "1Y"];

  // Mock data for the chart
  const mockChartData = Array.from({ length: 30 }).map((_, i) => ({
    time: `2024-05-${(i + 1).toString().padStart(2, "0")}`,
    value: 5000 + Math.random() * 500 + i * 10,
  }));

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
      <div className="flex-1 min-h-[450px] w-full">
        <PriceChart data={mockChartData} color="#2563eb" />
      </div>

      {/* Market Breadth & Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[var(--border)]">
        {/* Market Breadth */}
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-[11px] tracking-widest text-[var(--text-muted)] uppercase">Market Breadth</h3>
          
          <div className="grid grid-cols-3 gap-2 font-mono text-[13px] border-b border-[var(--border)] pb-3">
            <div>
               <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Advancers</span>
               <span className="text-[var(--positive)] font-bold text-[14px]">31</span>
            </div>
            <div>
               <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Decliners</span>
               <span className="text-[var(--negative)] font-bold text-[14px]">18</span>
            </div>
            <div>
               <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Unchanged</span>
               <span className="text-[var(--text-muted)] font-bold text-[14px]">6</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 font-mono text-[13px]">
             <div>
               <span className="text-[var(--text-secondary)] block text-[10px] uppercase">A/D Ratio</span>
               <span className="text-[var(--text-primary)] font-bold text-[14px]">1.72</span>
            </div>
            <div>
               <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Above 50 DMA</span>
               <span className="text-[var(--text-primary)] font-bold text-[14px]">68%</span>
            </div>
            <div>
               <span className="text-[var(--text-secondary)] block text-[10px] uppercase">Above 200 DMA</span>
               <span className="text-[var(--text-primary)] font-bold text-[14px]">61%</span>
            </div>
          </div>
        </div>

        {/* Sector Performance */}
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-[11px] tracking-widest text-[var(--text-muted)] uppercase flex justify-between">
             <span>Sector Performance</span>
             <span>1D</span>
          </h3>
          <div className="flex flex-col gap-1.5 font-mono text-[12px]">
             <SectorRow name="Technology" value="+1.2%" fill={70} type="positive" />
             <SectorRow name="Financials" value="+0.8%" fill={40} type="positive" />
             <SectorRow name="Energy" value="+1.6%" fill={80} type="positive" />
             <SectorRow name="Healthcare" value="-0.4%" fill={20} type="negative" />
             <SectorRow name="Consumer" value="-0.2%" fill={10} type="negative" />
          </div>
        </div>
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