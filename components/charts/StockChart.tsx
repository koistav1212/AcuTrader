"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  AreaSeries,
  CrosshairMode,
} from "lightweight-charts";

interface ChartProps {
  symbol: string;
}

const timeframeConfig = {
  "1D":  { range: "1D",  interval: "5m",  label: "5 MIN" },
  "5D":  { range: "5D",  interval: "15m", label: "15 MIN" },
  "1M":  { range: "1M",  interval: "1h",  label: "1 HOUR" },
  "3M":  { range: "3M",  interval: "1h",  label: "1 HOUR" },
  "6M":  { range: "6M",  interval: "1h",  label: "1 HOUR" },
  "1Y":  { range: "1Y",  interval: "1d",  label: "1 DAY" },
  "5Y":  { range: "5Y",  interval: "1d",  label: "1 DAY" },
  "10Y": { range: "10Y", interval: "1wk", label: "1 WEEK" },
  "MAX": { range: "MAX", interval: "1mo", label: "1 MONTH" }
} as const;

type TimeframeKey = keyof typeof timeframeConfig;

const StockChart: React.FC<ChartProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const chartInstance = useRef<IChartApi | null>(null);
  const areaSeries = useRef<ISeriesApi<"Area"> | null>(null);

  const [data, setData] = useState<any[]>([]);
  const [period, setPeriod] = useState<TimeframeKey>("1Y");
  const [loading, setLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  /*
   * FETCH DATA
   */
  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setIsUnavailable(false);

      try {
        const conf = timeframeConfig[period];
        const res = await fetch(
          `/api/market/history/${symbol}?range=${conf.range}&interval=${conf.interval}`,
          { signal: abortController.signal }
        );

        const json = await res.json();

        let rawData: any[] = [];
        if (Array.isArray(json)) {
          rawData = json;
        } else if (json.data && Array.isArray(json.data)) {
          rawData = json.data;
        } else if (json[period] && Array.isArray(json[period])) {
          rawData = json[period];
        }

        if (rawData.length > 0) {
          const sorted = rawData.sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setData(sorted);
        } else {
          setData([]);
          setIsUnavailable(true);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch chart data", err);
          setIsUnavailable(true);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [symbol, period]);

  /*
   * INITIALIZE CHART
   */
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const styles = getComputedStyle(document.documentElement);
    const textColor = styles.getPropertyValue("--text-secondary").trim() || "#68707a";
    const borderColor = styles.getPropertyValue("--border").trim() || "rgba(32,37,45,0.08)";

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: borderColor },
        horzLines: { color: borderColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: 420,
      rightPriceScale: {
        borderColor: borderColor,
        autoScale: true,
        alignLabels: true,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: borderColor,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });

    chartInstance.current = chart;

    const series = chart.addSeries(AreaSeries, {
      lineWidth: 2,
      crosshairMarkerRadius: 4,
    });
    areaSeries.current = series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  /*
   * UPDATE DATA & TOOLTIP
   */
  useEffect(() => {
    if (!chartInstance.current || !areaSeries.current) return;

    if (data.length === 0) {
      areaSeries.current.setData([]);
      return;
    }

    const chartData = data.map((d) => {
      let timeVal = d.date;
      if (typeof d.date === "string") {
        timeVal = new Date(d.date).getTime() / 1000;
      }
      return {
        time: timeVal as any,
        value: d.close,
      };
    });

    const firstClose = data[0]?.close;
    const lastClose = data[data.length - 1]?.close;
    const isPositive = lastClose >= firstClose;

    const colorStr = isPositive ? "#10b981" : "#ef4444";
    const topColor = isPositive ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)";
    const bottomColor = isPositive ? "rgba(16, 185, 129, 0.0)" : "rgba(239, 68, 68, 0.0)";

    areaSeries.current.applyOptions({
      lineColor: colorStr,
      topColor: topColor,
      bottomColor: bottomColor,
      priceLineColor: colorStr,
      crosshairMarkerBorderColor: colorStr,
      crosshairMarkerBackgroundColor: "#222",
    });

    areaSeries.current.setData(chartData);
    chartInstance.current.timeScale().fitContent();

    // Map for tooltips
    const dataMap = new Map();
    data.forEach((d) => {
      let t = typeof d.date === "string" ? new Date(d.date).getTime() / 1000 : d.date;
      dataMap.set(t, d);
    });

    const crosshairHandler = (param: any) => {
      if (!tooltipRef.current || !chartContainerRef.current) return;

      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current.clientWidth ||
        param.point.y < 0 ||
        param.point.y > 420
      ) {
        tooltipRef.current.style.display = "none";
        return;
      }

      let timeKey = param.time;
      if (typeof param.time === "object" && param.time !== null) {
        // Business day object fallback
        timeKey = new Date(param.time.year, param.time.month - 1, param.time.day).getTime() / 1000;
      }

      const pointData = dataMap.get(timeKey);

      if (!pointData) {
        tooltipRef.current.style.display = "none";
        return;
      }

      tooltipRef.current.style.display = "block";

      // Calculate tooltip position
      const tooltipW = 160;
      let left = param.point.x + 15;
      if (left > chartContainerRef.current.clientWidth - tooltipW - 15) {
        left = param.point.x - tooltipW - 15;
      }
      let top = param.point.y + 15;
      if (top > 420 - 120) {
        top = 420 - 120;
      }

      tooltipRef.current.style.left = left + "px";
      tooltipRef.current.style.top = top + "px";

      const d = new Date(pointData.date);
      const dateStr = d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const volumeStr = pointData.volume
        ? Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(
            pointData.volume
          )
        : "N/A";

      tooltipRef.current.innerHTML = `
        <div class="text-[10px] text-[var(--text-muted)] mb-2 font-mono">${dateStr}</div>
        <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          <div class="text-[var(--text-muted)]">O</div><div class="text-right font-mono">${pointData.open?.toFixed(2)}</div>
          <div class="text-[var(--text-muted)]">H</div><div class="text-right font-mono">${pointData.high?.toFixed(2)}</div>
          <div class="text-[var(--text-muted)]">L</div><div class="text-right font-mono">${pointData.low?.toFixed(2)}</div>
          <div class="text-[var(--text-muted)]">C</div><div class="text-right font-mono font-medium text-[var(--text-primary)]">${pointData.close?.toFixed(2)}</div>
          <div class="text-[var(--text-muted)]">V</div><div class="text-right font-mono">${volumeStr}</div>
        </div>
      `;
    };

    chartInstance.current.subscribeCrosshairMove(crosshairHandler);

    return () => {
      chartInstance.current?.unsubscribeCrosshairMove(crosshairHandler);
    };
  }, [data]);

  const firstClose = data[0]?.close;
  const lastClose = data[data.length - 1]?.close;
  const returnPct =
    data.length >= 2 && firstClose ? ((lastClose - firstClose) / firstClose) * 100 : null;

  return (
    <section className="relative overflow-hidden border border-[var(--border)] bg-[var(--surface)] backdrop-blur-md">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border)] px-6 py-5">
        <div>
          <p className="research-label text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
            PRICE STRUCTURE
          </p>
          <div className="mt-2 flex items-baseline gap-4">
            <h3 className="font-display text-3xl">{symbol}</h3>
            {returnPct !== null && (
              <span
                className={`font-mono text-lg ${
                  returnPct >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                }`}
              >
                {returnPct >= 0 ? "+" : "−"}
                {Math.abs(returnPct).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="relative px-3 py-4">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--bg-primary)]/40 backdrop-blur-[2px] transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse bg-[var(--text-primary)]" />
              <span className="research-label text-xs tracking-widest">LOADING...</span>
            </div>
          </div>
        )}

        {isUnavailable && !loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--bg-primary)]/80">
            <div className="research-label text-red-400 text-xs tracking-widest">
              DATA UNAVAILABLE
            </div>
          </div>
        )}

        <div ref={chartContainerRef} className="h-[420px] w-full" />

        {/* TOOLTIP */}
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-30 hidden rounded-md border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-lg backdrop-blur-md transition-opacity duration-150"
        />
      </div>

      {/* FOOTER & TIMEFRAME SELECTOR */}
      <div className="flex flex-col gap-4 border-t border-[var(--border)] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {timeframeConfig[period].range} · {timeframeConfig[period].label}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {(Object.keys(timeframeConfig) as TimeframeKey[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`
                rounded px-3 py-1.5
                font-mono text-[10px] font-medium
                tracking-wider
                transition-all duration-200
                ${
                  period === p
                    ? "bg-white/10 text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StockChart;
