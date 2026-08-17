import React from "react";

interface ResearchCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: "blue" | "green" | "orange" | "purple" | "red" | "none";
  interactive?: boolean;
}

const accentMap = {
  blue: "var(--signal-blue)",
  green: "var(--signal-green)",
  orange: "var(--signal-orange)",
  purple: "var(--signal-purple)",
  red: "var(--signal-red)",
  none: "transparent",
};

export function ResearchCard({
  children,
  className = "",
  accent = "none",
  interactive = true,
}: ResearchCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        border border-[var(--border)]
        bg-[var(--surface)]
        backdrop-blur-md
        ${interactive ? "kpi-panel" : ""}
        ${className}
      `}
    >
      <div
        className="signal-line"
        style={{ backgroundColor: accentMap[accent] }}
      />

      {children}
    </div>
  );
}
