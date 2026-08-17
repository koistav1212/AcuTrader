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
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";

interface ChartProps {
  symbol: string;
}

const StockChart: React.FC<ChartProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const chartInstance = useRef<IChartApi | null>(null);

  const candlestickSeries =
    useRef<ISeriesApi<"Candlestick"> | null>(null);

  const smaSeries =
    useRef<ISeriesApi<"Line"> | null>(null);

  const ema12Series =
    useRef<ISeriesApi<"Line"> | null>(null);

  const bbUpperSeries =
    useRef<ISeriesApi<"Line"> | null>(null);

  const bbLowerSeries =
    useRef<ISeriesApi<"Line"> | null>(null);

  const [data, setData] = useState<any[]>([]);
  const [period, setPeriod] =
    useState<string>("1d");

  const [loading, setLoading] =
    useState(false);

  /*
   * FETCH DATA
   * EXISTING FUNCTIONALITY PRESERVED
   */

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/market/historical/${symbol}?period=${period}`
        );

        const json = await res.json();

        let rawData: any[] = [];

        if (Array.isArray(json)) {
          rawData = json;
        } else if (
          json[period] &&
          Array.isArray(json[period])
        ) {
          rawData = json[period];
        }

        if (rawData.length > 0) {
          const sorted = rawData.sort(
            (a, b) =>
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
          );

          setData(sorted);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error(
          "Failed to fetch chart data",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, period]);

  /*
   * INITIALIZE CHART
   */

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const styles =
      getComputedStyle(document.documentElement);

    const chart = createChart(
      chartContainerRef.current,
      {
        layout: {
          background: {
            type: ColorType.Solid,
            color: "transparent",
          },
          textColor:
            styles
              .getPropertyValue("--text-secondary")
              .trim() || "#68707a",
        },

        grid: {
          vertLines: {
            color:
              styles
                .getPropertyValue("--chart-grid")
                .trim() ||
              "rgba(32,37,45,0.08)",
          },

          horzLines: {
            color:
              styles
                .getPropertyValue("--chart-grid")
                .trim() ||
              "rgba(32,37,45,0.08)",
          },
        },

        width:
          chartContainerRef.current.clientWidth,

        height: 420,

        rightPriceScale: {
          borderColor:
            styles
              .getPropertyValue("--border")
              .trim(),
        },

        timeScale: {
          timeVisible: true,
          secondsVisible: false,

          borderColor:
            styles
              .getPropertyValue("--border")
              .trim(),
        },
      }
    ) as IChartApi;

    chartInstance.current = chart;

    candlestickSeries.current =
      chart.addSeries(CandlestickSeries, {
          upColor: "#63b38d",
          downColor: "#bd6666",
          borderVisible: false,
          wickUpColor: "#63b38d",
          wickDownColor: "#bd6666",
      });

    smaSeries.current =
      chart.addSeries(LineSeries, {
        color: "#6f91c9",
        lineWidth: 1,
        title: "SMA 20",
      });

    ema12Series.current =
      chart.addSeries(LineSeries, {
        color: "#8a6fc1",
        lineWidth: 1,
        title: "EMA 12",
      });

    bbUpperSeries.current =
      chart.addSeries(LineSeries, {
        color: "rgba(111,145,201,0.45)",
        lineWidth: 1,
        title: "BB Upper",
      });

    bbLowerSeries.current =
      chart.addSeries(LineSeries, {
        color: "rgba(111,145,201,0.45)",
        lineWidth: 1,
        title: "BB Lower",
      });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width:
            chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();
    };
  }, []);

  /*
   * UPDATE DATA
   */

  useEffect(() => {
    if (
      !chartInstance.current ||
      data.length === 0
    ) {
      return;
    }

    const candles = data.map((d) => ({
      time: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candlestickSeries.current?.setData(
      candles
    );

    const smaData = data
      .filter(
        (d) =>
          d.indicators?.sma?.period20
      )
      .map((d) => ({
        time: d.date,
        value:
          d.indicators.sma.period20,
      }));

    smaSeries.current?.setData(smaData);

    const ema12Data = data
      .filter(
        (d) =>
          d.indicators?.ema?.period12
      )
      .map((d) => ({
        time: d.date,
        value:
          d.indicators.ema.period12,
      }));

    ema12Series.current?.setData(
      ema12Data
    );

    const bbUpperData = data
      .filter(
        (d) =>
          d.indicators?.bollinger?.upper
      )
      .map((d) => ({
        time: d.date,
        value:
          d.indicators.bollinger.upper,
      }));

    bbUpperSeries.current?.setData(
      bbUpperData
    );

    const bbLowerData = data
      .filter(
        (d) =>
          d.indicators?.bollinger?.lower
      )
      .map((d) => ({
        time: d.date,
        value:
          d.indicators.bollinger.lower,
      }));

    bbLowerSeries.current?.setData(
      bbLowerData
    );

    chartInstance.current
      .timeScale()
      .fitContent();
  }, [data]);

  return (
    <section
      className="
        relative overflow-hidden
        border border-[var(--border)]
        bg-[var(--surface)]
        backdrop-blur-md
      "
    >
      {/* HEADER */}

      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border)] px-6 py-5">

        <div>
          <p className="research-label">
            PRICE STRUCTURE
          </p>

          <h3 className="mt-2 font-display text-3xl">
            {symbol}
          </h3>
        </div>

        {/* PERIOD CONTROL */}

        <div className="flex border border-[var(--border)]">
          {["1d", "1wk", "1mo"].map((p) => (
            <button
              key={p}
              onClick={() =>
                setPeriod(p)
              }
              className={`
                px-4 py-2
                font-mono text-[9px]
                tracking-wider
                transition-all
                ${
                  period === p
                    ? "bg-[var(--text-primary)] text-[var(--surface-solid)]"
                    : "text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--text-primary)]"
                }
              `}
            >
              {p === "1d"
                ? "DAILY"
                : p === "1wk"
                ? "WEEKLY"
                : "MONTHLY"}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}

      <div className="relative px-3 py-4">

        {loading && (
          <div
            className="
              absolute inset-0 z-20
              flex items-center justify-center
              bg-[var(--bg-primary)]/60
              backdrop-blur-sm
            "
          >
            <div className="flex items-center gap-3">

              <span
                className="
                  h-2 w-2
                  animate-pulse
                  bg-[var(--signal-blue)]
                "
              />

              <span className="research-label">
                SYNCHRONIZING MARKET DATA
              </span>

            </div>
          </div>
        )}

        <div
          ref={chartContainerRef}
          className="h-[420px] w-full"
        />
      </div>

      {/* LEGEND */}

      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--border)] px-6 py-4">

        <Legend
          color="var(--signal-green)"
          label="BULLISH"
        />

        <Legend
          color="var(--signal-red)"
          label="BEARISH"
        />

        <Legend
          color="var(--signal-blue)"
          label="SMA 20"
        />

        <Legend
          color="var(--signal-purple)"
          label="EMA 12"
        />

        <Legend
          color="rgba(111,145,201,0.45)"
          label="BOLLINGER"
        />

      </div>

    </section>
  );
};

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-[2px] w-4"
        style={{
          backgroundColor: color,
        }}
      />

      <span className="font-mono text-[9px] tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
    </div>
  );
}

export default StockChart;
