"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface YearSelectorProps {
  availableYears: number[];
  selectedYears: number[];
  onChange: (years: number[]) => void;
}

export function YearSelector({ availableYears, selectedYears, onChange }: YearSelectorProps) {
  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      // Prevent unselecting the last year
      if (selectedYears.length > 1) {
        onChange(selectedYears.filter((y) => y !== year));
      }
    } else {
      // Limit to max 5 years
      if (selectedYears.length < 5) {
        onChange([...selectedYears, year].sort((a, b) => a - b));
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase mr-2">
        Compare Years:
      </span>
      {availableYears.slice(-10).map((year) => {
        const isSelected = selectedYears.includes(year);
        return (
          <button
            key={year}
            onClick={() => toggleYear(year)}
            className={cn(
              "px-3 py-1 text-[12px] font-mono font-semibold rounded-md transition-all border",
              isSelected
                ? "bg-[var(--surface-muted)] text-[var(--text-primary)] border-[var(--border)] shadow-sm"
                : "bg-transparent text-[var(--text-secondary)] border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-muted)]/50"
            )}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
