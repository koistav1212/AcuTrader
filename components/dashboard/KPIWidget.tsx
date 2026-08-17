import React from "react";
import { cn } from "@/app/lib/utils";

interface KPIWidgetProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean | null;
  description?: string;
  accent?: "blue" | "green" | "orange" | "purple" | "red" | "neutral";
  isLoading?: boolean;
}

export function KPIWidget({
  label,
  value,
  change,
  isPositive = null,
  description,
  accent = "neutral",
  isLoading = false,
}: KPIWidgetProps) {
  if (isLoading) {
    return (
      <div className="flex h-24 flex-col justify-between rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm animate-pulse">
        <div className="h-3 w-20 bg-[var(--border)] rounded" />
        <div className="mt-2 h-6 w-32 bg-[var(--border)] rounded" />
        <div className="mt-auto h-3 w-16 bg-[var(--border)] rounded" />
      </div>
    );
  }

  let colorClass = "text-[var(--text-secondary)]";
  if (isPositive === true) colorClass = "text-[var(--positive)]";
  if (isPositive === false) colorClass = "text-[var(--negative)]";

  return (
    <div className="flex h-24 flex-col justify-between rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm relative overflow-hidden group">
      {/* Accent strip */}
      <div 
        className="absolute left-0 top-0 h-full w-1" 
        style={{
          backgroundColor: accent === "green" ? "var(--positive)" :
                           accent === "red" ? "var(--negative)" :
                           accent === "orange" ? "var(--warning)" :
                           accent === "blue" ? "var(--info)" :
                           accent === "purple" ? "var(--signal-purple)" : "transparent"
        }}
      />
      
      <div className="flex justify-between items-start pl-2">
        <span className="metadata-label text-[10px] text-[var(--text-secondary)]">{label}</span>
      </div>
      
      <div className="flex items-end justify-between pl-2 mt-1">
        <span className="font-sans text-[22px] font-bold tracking-tight text-[var(--text-primary)]">
          {value}
        </span>
        
        {change && (
          <div className="flex flex-col items-end">
             <span className={cn("font-mono text-[12px] font-semibold", colorClass)}>
                {change}
             </span>
          </div>
        )}
      </div>

      {description && (
        <span className="pl-2 mt-auto font-sans text-[11px] text-[var(--text-muted)] truncate">
          {description}
        </span>
      )}
    </div>
  );
}
