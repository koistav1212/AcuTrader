"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, AreaSeries } from "lightweight-charts";
import { EquityPoint } from "@/app/services/portfolioService";

interface EquityChartProps {
  data: EquityPoint[];
  loading: boolean;
}

export default function EquityChart({ data, loading }: EquityChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || loading || !data || data.length === 0) return;

    // Clean up previous chart
    if (chartRef.current) {
        chartRef.current.remove();
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#6B7280", // var(--text-secondary) approximate
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "rgba(107, 114, 128, 0.1)" },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#22c55e", // var(--profit) green
      topColor: "rgba(34, 197, 94, 0.2)",
      bottomColor: "rgba(34, 197, 94, 0)",
      lineWidth: 2,
    });

    // Map data to lightweight-charts format
    // Assuming data is sorted by date ascending from backend.
    const chartData = data
      .map((point) => ({
        time: point.date.split("T")[0], // YYYY-MM-DD
        value: point.equity,
      }))
      .sort((a, b) => (a.time > b.time ? 1 : -1));

    series.setData(chartData);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, loading]);

  if (loading) {
    return <div className="h-[300px] w-full animate-pulse rounded-2xl bg-[var(--card)]/50" />;
  }

  if (!data || data.length === 0) {
      return (
          <div className="flex h-[300px] w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)]">
              No equity history available.
          </div>
      )
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Account Growth</h3>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
