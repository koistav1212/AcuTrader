"use client";

import React, { useState } from "react";
import { cn } from "@/app/lib/utils";

export function ExecutionHistory() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Orders", "Executions", "System"];

  const activities = [
    { time: "10:42:15", type: "Execution", action: "BUY NVDA", details: "10 shares @ $115.40", isPositive: true },
    { time: "10:31:02", type: "Order", action: "LIMIT ORDER CREATED", details: "SELL TSLA @ $230.00", isPositive: false },
    { time: "09:45:21", type: "System", action: "MARKET OPEN", details: "System operational", isPositive: undefined },
    { time: "09:40:11", type: "System", action: "LOGIN SUCCESS", details: "IP 192.168.1.1", isPositive: undefined },
  ];

  const filtered = activities.filter(a => {
    if (filter === "All") return true;
    if (filter === "Orders" && a.type === "Order") return true;
    if (filter === "Executions" && a.type === "Execution") return true;
    if (filter === "System" && a.type === "System") return true;
    return false;
  });

  return (
    <div className="flex flex-col h-full border border-[var(--border)] bg-[var(--surface)] rounded-md shadow-sm overflow-hidden p-6 mt-6">
      <div className="flex justify-between items-center mb-4 border-b border-[var(--border)] pb-4">
        <h3 className="metadata-label text-[var(--text-primary)]">RECENT ACTIVITY</h3>
        <div className="flex gap-1 bg-[var(--surface-muted)] p-1 rounded-md">
          {filters.map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                 filter === f
                   ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                   : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
               }`}
             >
               {f}
             </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-0">
         {filtered.length > 0 ? filtered.map((act, idx) => (
           <div key={idx} className="flex gap-4 items-start py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-muted)] px-2 -mx-2 rounded transition-colors">
              <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-widest mt-0.5 w-16 shrink-0">{act.time}</span>
              <div className="flex flex-col">
                 <span className={cn(
                   "font-mono text-[12px] font-bold uppercase",
                   act.isPositive === true ? "text-[var(--positive)]" : act.isPositive === false ? "text-[var(--negative)]" : "text-[var(--text-primary)]"
                 )}>{act.action}</span>
                 <span className="font-sans text-[13px] text-[var(--text-secondary)]">{act.details}</span>
              </div>
           </div>
         )) : (
           <p className="font-mono text-[12px] text-[var(--text-secondary)] py-4 text-center">NO RECENT ACTIVITY</p>
         )}
      </div>
    </div>
  );
}
