"use client";

import React, { useMemo } from "react";
import { MonthlySeasonality, WeeklySeasonality } from "@/utils/seasonality";
import { cn } from "@/app/lib/utils";

interface SeasonalityInsightsProps {
  symbol: string;
  monthlyData: MonthlySeasonality[];
  weeklyData: WeeklySeasonality[];
}

export function SeasonalityInsights({ symbol, monthlyData, weeklyData }: SeasonalityInsightsProps) {
  const insights = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0 || !weeklyData || weeklyData.length === 0) return null;

    let bestMonth = monthlyData[0];
    let worstMonth = monthlyData[0];
    let highestWinRateMonth = monthlyData[0];

    monthlyData.forEach((m) => {
      if (m.averageReturn > bestMonth.averageReturn) bestMonth = m;
      if (m.averageReturn < worstMonth.averageReturn) worstMonth = m;
      if (m.positiveFrequency > highestWinRateMonth.positiveFrequency) highestWinRateMonth = m;
    });

    let bestDay = weeklyData[0];
    weeklyData.forEach((w) => {
      if (w.positiveFrequency > bestDay.positiveFrequency) bestDay = w;
    });

    return { bestMonth, worstMonth, highestWinRateMonth, bestDay };
  }, [monthlyData, weeklyData]);

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

        <InsightBlock 
          label="BEST TRADING DAY" 
          text={`${insights.bestDay.day} has the highest historical positive-return frequency for ${symbol} at ${insights.bestDay.positiveFrequency.toFixed(0)}%.`} 
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
