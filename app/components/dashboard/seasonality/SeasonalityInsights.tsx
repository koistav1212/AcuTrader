"use client";

import React, { useMemo } from "react";
import { MonthlySeasonality } from "@/utils/seasonality";
import { cn } from "@/app/lib/utils";

interface SeasonalityInsightsProps {
  monthlyData: MonthlySeasonality[];
}

export function SeasonalityInsights({ monthlyData }: SeasonalityInsightsProps) {
  const insights = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return null;

    let bestMonth = monthlyData[0];
    let worstMonth = monthlyData[0];
    let positiveMonthsCount = 0;

    monthlyData.forEach((m) => {
      if (m.avgReturn > bestMonth.avgReturn) bestMonth = m;
      if (m.avgReturn < worstMonth.avgReturn) worstMonth = m;
      if (m.avgReturn > 0) positiveMonthsCount++;
    });

    const hitRate = (positiveMonthsCount / 12) * 100;

    // Simple heuristic for confidence
    const confidence = Math.min(100, Math.max(0, 50 + (hitRate - 50) + (bestMonth.avgReturn * 2) - (Math.abs(worstMonth.avgReturn) * 2)));

    // Simple heuristic for signal
    let signalText = "Neutral Outlook";
    if (confidence > 75) signalText = "Strong Bullish Bias";
    else if (confidence > 60) signalText = "Bullish Bias into Q4";
    else if (confidence < 40) signalText = "Bearish Seasonal Drag";

    return { bestMonth, worstMonth, positiveMonthsCount, hitRate, confidence, signalText };
  }, [monthlyData]);

  if (!insights) return null;

  return (
    <div className="flex flex-col gap-6 h-full p-6 border border-[var(--border)] bg-[var(--surface-solid)] rounded-md shadow-sm">
      <p className="metadata-label border-b border-[var(--border)] pb-3 text-[var(--text-primary)]">
        SEASONALITY INSIGHTS
      </p>

      <div className="space-y-5">
        <InsightBlock 
          label="BEST MONTH" 
          value={insights.bestMonth.monthName} 
          subValue={`+${insights.bestMonth.avgReturn.toFixed(1)}% avg return`} 
          isPositive={true}
        />
        
        <InsightBlock 
          label="WORST MONTH" 
          value={insights.worstMonth.monthName} 
          subValue={`${insights.worstMonth.avgReturn.toFixed(1)}% avg return`} 
          isPositive={false}
        />

        <InsightBlock 
          label="POSITIVE MONTHS" 
          value={`${insights.positiveMonthsCount} / 12`} 
          subValue={`${insights.hitRate.toFixed(1)}% hit rate`} 
          isPositive={insights.hitRate > 50}
        />

        <InsightBlock 
          label="SEASONAL CONFIDENCE" 
          value={`${insights.confidence.toFixed(0)}%`} 
          subValue="Based on historical consistency" 
        />
      </div>

      <div className="mt-auto pt-5 border-t border-[var(--border)]">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)] mb-2">
          SEASONAL SIGNAL
        </p>
        <p className={cn(
          "font-sans text-[15px] font-bold",
          insights.confidence > 60 ? "text-[var(--positive)]" : insights.confidence < 40 ? "text-[var(--negative)]" : "text-[var(--text-primary)]"
        )}>
          {insights.signalText}
        </p>
      </div>
    </div>
  );
}

function InsightBlock({ label, value, subValue, isPositive }: { label: string; value: string; subValue: string; isPositive?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">{label}</span>
      <span className="font-sans text-[16px] font-bold text-[var(--text-primary)]">{value}</span>
      <span className={cn(
        "font-mono text-[12px]",
        isPositive === true ? "text-[var(--positive)]" : isPositive === false ? "text-[var(--negative)]" : "text-[var(--text-secondary)]"
      )}>
        {subValue}
      </span>
    </div>
  );
}
