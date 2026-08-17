"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

export function RiskMetrics() {
  return (
    <div className="flex flex-col h-full border border-[var(--border)] bg-[var(--surface)] rounded-md shadow-sm overflow-hidden p-6">
      <div className="mb-4 border-b border-[var(--border)] pb-4">
        <h3 className="metadata-label text-[var(--text-primary)]">RISK METRICS</h3>
      </div>
      
      <div className="flex flex-col justify-between flex-1 gap-2">
         <RiskRow label="PORTFOLIO BETA" value="1.08" />
         <RiskRow label="VALUE AT RISK" value="$1,245" />
         <RiskRow label="MAX DRAWDOWN" value="-4.8%" color="text-[var(--negative)]" />
         <RiskRow label="SHARPE RATIO" value="1.42" />
         <RiskRow label="VOLATILITY" value="18.4%" />
      </div>
    </div>
  );
}

function RiskRow({ label, value, color }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
      <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">{label}</span>
      <span className={cn("font-sans text-[15px] font-bold", color || "text-[var(--text-primary)]")}>{value}</span>
    </div>
  );
}
