"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

export function MarketIntelligence() {
  return (
    <div className="flex flex-col h-full border border-[var(--border)] bg-[var(--surface)] rounded-md shadow-sm overflow-hidden p-6">
      <div className="mb-4 border-b border-[var(--border)] pb-4 flex justify-between items-center">
        <h3 className="metadata-label text-[var(--text-primary)]">MARKET INTELLIGENCE</h3>
        <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">AI SIGNAL</span>
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="mb-6">
           <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase block mb-1">Overall Signal</span>
           <div className="flex items-end gap-3">
             <span className="font-sans text-[28px] font-bold text-[var(--positive)] leading-none">BULLISH</span>
             <span className="font-mono text-[13px] font-bold text-[var(--text-secondary)] mb-1">82% Confidence</span>
           </div>
        </div>

        <div className="flex flex-col gap-3 font-mono text-[12px] mb-6 flex-1">
           <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase border-b border-[var(--border)] pb-1 mb-1">Drivers</span>
           <div className="flex items-start gap-2">
              <ArrowUpRight className="w-4 h-4 text-[var(--positive)] shrink-0" />
              <span className="text-[var(--text-secondary)]">Technology momentum improving</span>
           </div>
           <div className="flex items-start gap-2">
              <ArrowUpRight className="w-4 h-4 text-[var(--positive)] shrink-0" />
              <span className="text-[var(--text-secondary)]">Market breadth positive</span>
           </div>
           <div className="flex items-start gap-2">
              <ArrowUpRight className="w-4 h-4 text-[var(--positive)] shrink-0" />
              <span className="text-[var(--text-secondary)]">Volatility declining</span>
           </div>
           <div className="flex items-start gap-2">
              <ArrowDownRight className="w-4 h-4 text-[var(--negative)] shrink-0" />
              <span className="text-[var(--text-secondary)]">Consumer sector weakening</span>
           </div>
        </div>

        <button className="flex items-center justify-center gap-2 w-full py-2 bg-[var(--surface-muted)] hover:bg-[var(--surface-solid)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-[11px] font-bold uppercase tracking-widest rounded transition-colors mt-auto">
           VIEW FULL RESEARCH <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
