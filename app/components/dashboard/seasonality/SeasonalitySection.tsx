"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { SeasonalityTabs, SeasonalityMode } from "./SeasonalityTabs";
import { YearSelector } from "./YearSelector";
import { SeasonalityInsights } from "./SeasonalityInsights";
import { 
  HistoricalDataPoint, 
  calculateMonthlySeasonality, 
  calculateWeeklySeasonality, 
  calculateYearlySeasonality 
} from "@/utils/seasonality";

const LazySeasonalityChart = dynamic(() => import("./SeasonalityChart").then(m => m.SeasonalityChart), {
  ssr: false,
  loading: () => <SeasonalitySkeleton />
});

export function SeasonalitySection() {
  const [mode, setMode] = useState<SeasonalityMode>("Monthly");
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error" | "empty">("loading");

  const fetchSeasonalityData = useCallback(async () => {
    setStatus("loading");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://acutrader-backend.onrender.com/api";
      // Fetching SPY as a benchmark for general dashboard seasonality
      const res = await fetch(`${baseUrl}/market/historical/SPY?period=10y`);
      
      if (!res.ok) throw new Error("Failed to fetch historical data");
      
      const json = await res.json();
      let rawData: any[] = [];
      
      if (Array.isArray(json)) rawData = json;
      else if (json["10y"] && Array.isArray(json["10y"])) rawData = json["10y"];
      
      if (rawData.length < 252) { // Less than a year of trading days
        setStatus("empty");
        return;
      }

      const formattedData: HistoricalDataPoint[] = rawData.map(d => ({
        date: d.date,
        open: d.open,
        close: d.close,
        high: d.high,
        low: d.low,
        volume: d.volume
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setData(formattedData);

      // Extract available years
      const years = new Set<number>();
      formattedData.forEach(d => years.add(new Date(d.date).getFullYear()));
      const yearsArr = Array.from(years).sort((a, b) => a - b);
      setAvailableYears(yearsArr);
      
      // Default selected years (last 3 years)
      if (yearsArr.length > 0) {
        setSelectedYears(yearsArr.slice(-3));
      }

      setStatus("success");
    } catch (error) {
      console.error("Seasonality fetch error", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchSeasonalityData();
  }, [fetchSeasonalityData]);

  const monthlyData = useMemo(() => calculateMonthlySeasonality(data), [data]);
  const weeklyData = useMemo(() => calculateWeeklySeasonality(data), [data]);
  const yearlyData = useMemo(() => calculateYearlySeasonality(data, selectedYears), [data, selectedYears]);

  return (
    <section className="grid gap-6 p-6 xl:grid-cols-12 bg-transparent">
      {/* LEFT AREA: xl:col-span-9 */}
      <div className="xl:col-span-9 flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="section-title text-[20px] md:text-[24px]">SEASONALITY ANALYSIS</h2>
            <p className="mt-1 font-sans text-[13px] md:text-[14px] text-[var(--text-secondary)]">
              Historical price behavior across monthly, weekly, and yearly cycles
            </p>
          </div>
          <SeasonalityTabs activeMode={mode} onChange={setMode} />
        </div>

        {/* CHART AREA */}
        <div className="border border-[var(--border)] bg-[var(--surface-solid)] rounded-md shadow-sm overflow-hidden flex flex-col h-[400px]">
          {status === "loading" && <SeasonalitySkeleton />}
          
          {status === "empty" && (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
              <AlertCircle className="w-8 h-8 text-[var(--text-muted)]" />
              <div>
                <p className="font-mono text-[13px] font-bold text-[var(--text-primary)] tracking-widest uppercase">
                  INSUFFICIENT HISTORICAL DATA
                </p>
                <p className="font-sans text-[14px] text-[var(--text-secondary)] mt-1">
                  Seasonality analysis requires additional historical observations.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
              <AlertCircle className="w-8 h-8 text-[var(--negative)]" />
              <div>
                <p className="font-mono text-[13px] font-bold text-[var(--negative)] tracking-widest uppercase">
                  SEASONALITY DATA UNAVAILABLE
                </p>
                <p className="font-sans text-[14px] text-[var(--text-secondary)] mt-1">
                  Unable to calculate historical seasonal patterns.
                </p>
              </div>
              <button 
                onClick={fetchSeasonalityData}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] bg-[var(--surface-muted)] hover:bg-[var(--surface)] text-[13px] font-semibold rounded-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Retry Analysis
              </button>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col h-full w-full p-2 relative">
              {mode === "Yearly" && availableYears.length > 0 && (
                <div className="absolute top-2 left-4 z-10">
                  <YearSelector 
                    availableYears={availableYears} 
                    selectedYears={selectedYears} 
                    onChange={setSelectedYears} 
                  />
                </div>
              )}
              <div className="flex-1 w-full min-h-0">
                 <LazySeasonalityChart 
                   mode={mode} 
                   monthlyData={monthlyData} 
                   weeklyData={weeklyData} 
                   yearlyData={yearlyData} 
                 />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT AREA: xl:col-span-3 */}
      <div className="xl:col-span-3">
        {status === "loading" ? (
          <div className="h-[400px] border border-[var(--border)] rounded-md bg-[var(--surface-solid)] p-6 animate-pulse mt-[52px]">
             <div className="w-1/2 h-4 bg-[var(--border)] rounded mb-8"></div>
             <div className="space-y-6">
                <div className="h-10 bg-[var(--border)] rounded"></div>
                <div className="h-10 bg-[var(--border)] rounded"></div>
                <div className="h-10 bg-[var(--border)] rounded"></div>
             </div>
          </div>
        ) : status === "success" ? (
          <div className="xl:mt-[52px] h-[calc(100%-52px)]">
             <SeasonalityInsights monthlyData={monthlyData} />
          </div>
        ) : (
          <div className="xl:mt-[52px] h-[calc(100%-52px)] border border-[var(--border)] rounded-md bg-[var(--surface-solid)] opacity-50 flex items-center justify-center p-6 text-center">
             <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-widest uppercase">Insights Unavailable</span>
          </div>
        )}
      </div>
    </section>
  );
}

function SeasonalitySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-[var(--surface-solid)]/50 backdrop-blur-sm z-10">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--info)]" />
      <div className="text-center">
        <p className="font-mono text-[12px] font-bold text-[var(--text-primary)] tracking-widest uppercase">
          PROCESSING HISTORICAL DATA
        </p>
        <p className="font-sans text-[13px] text-[var(--text-secondary)] mt-1">
          Calculating seasonal return patterns...
        </p>
      </div>
    </div>
  );
}
