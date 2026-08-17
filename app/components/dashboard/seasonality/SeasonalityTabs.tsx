"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

export type SeasonalityMode = "Monthly" | "Weekly" | "Yearly";

interface SeasonalityTabsProps {
  activeMode: SeasonalityMode;
  onChange: (mode: SeasonalityMode) => void;
}

export function SeasonalityTabs({ activeMode, onChange }: SeasonalityTabsProps) {
  const modes: SeasonalityMode[] = ["Monthly", "Weekly", "Yearly"];

  return (
    <div className="flex bg-[var(--surface-muted)] p-1 rounded-md shrink-0 border border-[var(--border)]">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={cn(
            "px-4 py-1.5 rounded text-[12px] font-mono font-bold tracking-widest uppercase transition-all",
            activeMode === mode
              ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent"
          )}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
