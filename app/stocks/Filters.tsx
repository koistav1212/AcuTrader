"use client";

import { useState, useEffect } from "react";

export default function Filters({ filters, setFilters }: any) {
  
  return (
    <div className="space-y-6 w-full bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">

      <div className="flex items-center justify-between">
         <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-secondary)]">
          Filters
        </h3>
        <button 
           onClick={() => setFilters({
              exchange: "",
              currency: "",
              trend: "",
              minPrice: 0,
              maxPrice: 1000,
              minMarketCap: 0
           })}
           className="text-xs text-[var(--accent)] hover:underline"
        >
           Reset
        </button>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between mb-2">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Price Range</p>
            <p className="text-xs font-mono text-[var(--text)]">${filters.minPrice} - ${filters.maxPrice === 1000 ? "1000+" : filters.maxPrice}</p>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          step="10"
          value={filters.maxPrice}
          onChange={(e) => setFilters((f: any) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full h-2 bg-[var(--bg)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
        />
        <div className="flex justify-between mt-1">
             <span className="text-[10px] text-[var(--text-secondary)]">$0</span>
             <span className="text-[10px] text-[var(--text-secondary)]">$500</span>
             <span className="text-[10px] text-[var(--text-secondary)]">$1000+</span>
        </div>
      </div>

      {/* Market Cap */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
          Min Market Cap
        </p>
        <select
          value={filters.minMarketCap}
          onChange={(e) =>
            setFilters((f: any) => ({ ...f, minMarketCap: Number(e.target.value) }))
          }
           className="w-full p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm focus:ring-2 focus:ring-[var(--accent)]/50 outline-none transition-all"
        >
          <option value={0}>Any</option>
          <option value={5000000}>&gt; $5 Million</option>
          <option value={10000000}>&gt; $10 Million</option>
          <option value={50000000}>&gt; $50 Million</option>
          <option value={100000000}>&gt; $100 Million</option>
          <option value={150000000}>&gt; $150 Million</option>
          <option value={1000000000}>&gt; $1 Billion</option>
        </select>
      </div>

      {/* Trend */}
       <div>
         <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
           Trend
         </p>
         <div className="grid grid-cols-2 gap-2">
             <button
               onClick={() => setFilters((f: any) => ({ ...f, trend: f.trend === "UP" ? "" : "UP" }))}
               className={`p-2 rounded-xl text-xs font-semibold border transition-all ${filters.trend === "UP" ? "bg-[var(--profit)]/10 border-[var(--profit)] text-[var(--profit)]" : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--profit)]/50"}`}
             >
               Bullish 📈
             </button>
             <button
                onClick={() => setFilters((f: any) => ({ ...f, trend: f.trend === "DOWN" ? "" : "DOWN" }))}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all ${filters.trend === "DOWN" ? "bg-[var(--loss)]/10 border-[var(--loss)] text-[var(--loss)]" : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--loss)]/50"}`}
             >
               Bearish 📉
             </button>
         </div>
       </div>



    </div>
  );
}
