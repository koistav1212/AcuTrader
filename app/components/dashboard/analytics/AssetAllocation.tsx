"use client";

import React from "react";

export function AssetAllocation() {
  return (
    <div className="flex flex-col h-full border border-[var(--border)] bg-[var(--surface)] rounded-md shadow-sm overflow-hidden p-6">
      <div className="mb-4 border-b border-[var(--border)] pb-4">
        <h3 className="metadata-label text-[var(--text-primary)]">ALLOCATION</h3>
      </div>
      
      <div className="flex flex-col gap-6 flex-1 justify-center">
        {/* Equities vs Cash */}
        <div>
          <div className="flex justify-between font-mono text-[12px] font-bold mb-2">
            <span className="text-[var(--text-primary)]">Equities <span className="text-[var(--text-secondary)]">72%</span></span>
            <span className="text-[var(--text-primary)]">Cash <span className="text-[var(--text-secondary)]">28%</span></span>
          </div>
          <div className="w-full h-2 flex rounded-full overflow-hidden">
            <div className="bg-[#3b82f6]" style={{ width: "72%" }}></div>
            <div className="bg-[var(--surface-muted)]" style={{ width: "28%" }}></div>
          </div>
        </div>

        {/* Sectors */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">Sector Distribution</span>
          <AllocationRow name="Technology" value="32%" color="#3b82f6" />
          <AllocationRow name="Financials" value="18%" color="#8b5cf6" />
          <AllocationRow name="Healthcare" value="12%" color="#22c55e" />
          <AllocationRow name="Consumer" value="10%" color="#f59e0b" />
        </div>
      </div>
    </div>
  );
}

function AllocationRow({ name, value, color }: { name: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-3 w-full">
       <span className="w-20 truncate font-mono text-[11px] text-[var(--text-secondary)]">{name}</span>
       <div className="flex-1 h-1 bg-[var(--surface-muted)] rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full" style={{ width: value, backgroundColor: color, opacity: 0.8 }} />
       </div>
       <span className="w-8 text-right font-mono text-[11px] font-bold text-[var(--text-primary)]">{value}</span>
    </div>
  );
}
