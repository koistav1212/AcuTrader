"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { SeasonalityTabs, SeasonalityMode } from "./SeasonalityTabs";
import { YearSelector } from "./YearSelector";
import { SeasonalityInsights } from "./SeasonalityInsights";
import { useHistoricalData } from "@/app/hooks/useHistoricalData";
import { calculateMonthlySeasonality, calculateYearlySeasonality } from "@/utils/seasonality";

import { SymbolSearch } from "../workspace/SymbolSearch";

const LazySeasonalityChart = dynamic(() => import("./SeasonalityChart").then(m => m.SeasonalityChart), {
  ssr: false,
  loading: () => <SeasonalitySkeleton />
});

export function SeasonalitySection({ symbol = "SPY" }: { symbol?: string }) {
  const [localSymbol, setLocalSymbol] = useState(symbol);
  const [mode, setMode] = useState<SeasonalityMode>("Monthly");
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  // Sync if global symbol changes, optional. But user said "not the one globally", 
  // so we won't sync it aggressively after initial mount unless desired. 
  // We'll just leave it fully isolated after initialization.

  const { data: apiData, isLoading, isError, refetch } = useHistoricalData(localSymbol, "10Y", "1d");

  const hasInsufficientData = apiData && apiData.length < 252;
  const status = isLoading ? "loading" : isError ? "error" : (!apiData || hasInsufficientData) ? "empty" : "success";

  const monthlyData = useMemo(() => {
    if (mode === "Monthly" && status === "success" && apiData) {
      return calculateMonthlySeasonality(apiData);
    }
    return [];
  }, [mode, status, apiData]);



  const yearlyData = useMemo(() => {
    if (mode === "Yearly" && status === "success" && apiData) {
      return calculateYearlySeasonality(apiData);
    }
    return [];
  }, [mode, status, apiData]);

  return (
    <section className="grid gap-6 p-6 xl:grid-cols-12 bg-transparent">
      {/* LEFT AREA: xl:col-span-9 */}
      <div className="xl:col-span-9 flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="section-title text-[20px] md:text-[24px]">SEASONALITY ANALYSIS</h2>
            <div className="mt-1 flex items-center gap-3">
              <p className="font-sans text-[13px] md:text-[14px] text-[var(--text-secondary)] whitespace-nowrap">
                {mode} Historical Returns — {localSymbol}
              </p>
              <div className="w-48 ml-2">
                <SymbolSearch 
                  value={localSymbol}
                  onSelect={setLocalSymbol}
                  placeholder="Search symbol..."
                />
              </div>
            </div>
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
                onClick={() => refetch()}
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
             <SeasonalityInsights symbol={localSymbol} monthlyData={monthlyData} />
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
