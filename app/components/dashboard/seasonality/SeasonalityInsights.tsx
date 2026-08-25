"use client";

import React, { useMemo } from "react";
import { MonthlySeasonality } from "@/utils/seasonality";
import { cn } from "@/app/lib/utils";

interface SeasonalityInsightsProps {
  symbol: string;
  monthlyData: MonthlySeasonality[];
}

export function SeasonalityInsights({ symbol, monthlyData }: SeasonalityInsightsProps) {
  const insights = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return null;

    let bestMonth = monthlyData[0];
    let worstMonth = monthlyData[0];
    let highestWinRateMonth = monthlyData[0];

    monthlyData.forEach((m) => {
      if (m.averageReturn > bestMonth.averageReturn) bestMonth = m;
      if (m.averageReturn < worstMonth.averageReturn) worstMonth = m;
      if (m.positiveFrequency > highestWinRateMonth.positiveFrequency) highestWinRateMonth = m;
    });

    return { bestMonth, worstMonth, highestWinRateMonth };
  }, [monthlyData]);

  if (!insights) return null;

  return (
    <div className="flex flex-col gap-6 h-full p-6 border border-[var(--border)] bg-[var(--surface-solid)] rounded-md shadow-sm">
      <p className="metadata-label border-b border-[var(--border)] pb-3 text-[var(--text-primary)]">
        SEASONALITY INSIGHTS
      </p>

      <div className="space-y-6">
        <InsightBlock 
          label="BEST HISTORICAL MONTH" 
          text={`${insights.bestMonth.month} has historically delivered the highest average return for ${symbol} at ${insights.bestMonth.averageReturn.toFixed(2)}%.`}
        />
        
        <InsightBlock 
          label="WORST HISTORICAL MONTH" 
          text={`${insights.worstMonth.month} has historically been the weakest month for ${symbol} with an average return of ${insights.worstMonth.averageReturn.toFixed(2)}%.`} 
        />

        <InsightBlock 
          label="CONSISTENCY" 
          text={`${symbol} has closed ${insights.highestWinRateMonth.month} positively in ${insights.highestWinRateMonth.positiveFrequency.toFixed(0)}% of observed years.`} 
        />
      </div>
    </div>
  );
}

function InsightBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">{label}</span>
      <span className="font-sans text-[14px] leading-relaxed text-[var(--text-primary)]">{text}</span>
    </div>
  );
}
