"use client";

import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

export function PortfolioPerformance() {
  const [range, setRange] = useState("1M");
  const ranges = ["1D", "1W", "1M", "3M", "YTD", "ALL"];

  // Mock series
  const data = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      date: `2024-05-${(i+1).toString().padStart(2, '0')}`,
      portfolio: 100 + (i * 0.5) + (Math.random() * 2 - 1),
      spy: 100 + (i * 0.4) + (Math.random() * 1.5 - 0.75),
    }));
  }, []);

  const options = useMemo(() => ({
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(10, 14, 24, 0.95)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      textStyle: { color: "#fff", fontFamily: "var(--font-ibm-plex-mono)", fontSize: 12 },
    },
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map(d => d.date),
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
      axisLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      scale: true,
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)", type: "dashed" } },
      axisLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, formatter: "{value}%" },
    },
    series: [
      {
        name: "Portfolio",
        type: "line",
        data: data.map(d => d.portfolio),
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#3b82f6", width: 2 },
      },
      {
        name: "S&P 500",
        type: "line",
        data: data.map(d => d.spy),
        smooth: true,
        showSymbol: false,
        lineStyle: { color: "#eab308", width: 1.5, type: "dashed" },
      }
    ]
  }), [data]);

  return (
    <div className="flex flex-col h-full border border-[var(--border)] bg-[var(--surface)] rounded-md shadow-sm overflow-hidden p-6">
      <div className="flex justify-between items-center mb-4 border-b border-[var(--border)] pb-4">
        <h3 className="metadata-label text-[var(--text-primary)]">PORTFOLIO PERFORMANCE</h3>
        <div className="flex gap-1 bg-[var(--surface-muted)] p-1 rounded-md">
          {ranges.map(r => (
             <button
               key={r}
               onClick={() => setRange(r)}
               className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                 range === r
                   ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                   : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
               }`}
             >
               {r}
             </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-[250px]">
         <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}
