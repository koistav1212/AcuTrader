import React from "react";

interface SectionIndexProps {
  current: number;
  total: number;
  title: string;
}

export function SectionIndex({ current, total, title }: SectionIndexProps) {
  const formattedCurrent = current.toString().padStart(2, "0");
  const formattedTotal = total.toString().padStart(2, "0");

  return (
    <div className="absolute bottom-12 left-12 z-50 flex items-center gap-6 font-mono text-[10px] tracking-widest text-text-secondary mix-blend-difference pointer-events-none">
      <div className="flex items-center gap-2">
        <span className="text-surface">{formattedCurrent}</span>
        <span className="opacity-50">/</span>
        <span className="opacity-50">{formattedTotal}</span>
      </div>
      <div className="h-px w-8 bg-text-secondary/30" />
      <span className="uppercase tracking-[0.2em]">{title}</span>
    </div>
  );
}
