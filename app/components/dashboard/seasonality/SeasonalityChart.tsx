"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { SeasonalityMode } from "./SeasonalityTabs";
import { MonthlySeasonality, WeeklySeasonality, YearlySeasonality } from "@/utils/seasonality";

interface SeasonalityChartProps {
  mode: SeasonalityMode;
  monthlyData: MonthlySeasonality[];
  weeklyData: WeeklySeasonality[];
  yearlyData: YearlySeasonality[];
}

const BaseChartOptions = {
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "var(--font-ibm-plex-mono), monospace",
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(10, 14, 24, 0.95)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    textStyle: {
      color: "#fff",
      fontSize: 13,
    },
    axisPointer: {
      type: "line",
      lineStyle: { color: "rgba(255,255,255,0.1)", type: "dashed" },
    },
  },
  grid: {
    top: 40,
    right: 30,
    bottom: 30,
    left: 50,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    axisTick: { show: false },
    axisLabel: {
      color: "rgba(255,255,255,0.5)",
      fontSize: 12,
      margin: 12,
    },
  },
  yAxis: {
    type: "value",
    splitLine: {
      lineStyle: { color: "rgba(255,255,255,0.05)", type: "dashed" },
    },
    axisLabel: {
      color: "rgba(255,255,255,0.5)",
      fontSize: 12,
      formatter: "{value}%",
    },
  },
};

function _SeasonalityChart({ mode, monthlyData, weeklyData, yearlyData }: SeasonalityChartProps) {
  const options = useMemo(() => {
    if (mode === "Monthly") {
      const positiveColor = "#63b38d"; // var(--positive) equivalent
      const negativeColor = "#bd6666"; // var(--negative) equivalent

      return {
        ...BaseChartOptions,
        tooltip: {
          ...BaseChartOptions.tooltip,
          formatter: (params: any) => {
            const p = params[0];
            const val = p.value;
            const color = val >= 0 ? positiveColor : negativeColor;
            return `
              <div style="font-weight:bold; margin-bottom: 4px;">${p.name}</div>
              <div style="display:flex; align-items:center; gap: 6px;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${color};"></span>
                <span>Avg Return: <b style="color:${color}">${val > 0 ? '+' : ''}${val.toFixed(2)}%</b></span>
              </div>
            `;
          }
        },
        xAxis: {
          ...BaseChartOptions.xAxis,
          data: monthlyData.map(d => d.monthName),
        },
        series: [
          {
            type: "bar",
            data: monthlyData.map(d => ({
              value: d.avgReturn,
              itemStyle: { color: d.avgReturn >= 0 ? positiveColor : negativeColor }
            })),
            barMaxWidth: 40,
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
            },
          },
        ],
      };
    }

    if (mode === "Weekly") {
      return {
        ...BaseChartOptions,
        tooltip: {
          ...BaseChartOptions.tooltip,
          formatter: (params: any) => {
            const p = params[0];
            const val = p.value;
            return `
              <div style="font-weight:bold; margin-bottom: 4px;">Week ${p.name}</div>
              <div>Avg Return: <b>${val > 0 ? '+' : ''}${val.toFixed(2)}%</b></div>
            `;
          }
        },
        xAxis: {
          ...BaseChartOptions.xAxis,
          data: weeklyData.map(d => d.week.toString()),
          axisLabel: {
            ...BaseChartOptions.xAxis.axisLabel,
            interval: 3, // Show every 4th week to avoid clutter
          }
        },
        series: [
          {
            type: "line",
            data: weeklyData.map(d => d.avgReturn),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: "#3b82f6", // var(--info)
              width: 2,
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
                  { offset: 1, color: "rgba(59, 130, 246, 0)" },
                ],
              },
            },
          },
        ],
      };
    }

    if (mode === "Yearly") {
      const colors = ["#8a6fc1", "#eab308", "#22c55e", "#f97316", "#3b82f6"]; // terminal colors
      const series = yearlyData.map((yd, idx) => {
        const isLatest = idx === yearlyData.length - 1;
        return {
          name: yd.year.toString(),
          type: "line",
          data: yd.data.map(d => [d.date, d.cumulativeReturn]),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: colors[idx % colors.length],
            width: isLatest ? 3 : 1.5,
            opacity: isLatest ? 1 : 0.6,
          },
          endLabel: {
            show: true,
            formatter: "{a}",
            color: colors[idx % colors.length],
            fontSize: 12,
            distance: 8,
            fontFamily: "var(--font-ibm-plex-mono)",
            fontWeight: isLatest ? "bold" : "normal"
          }
        };
      });

      return {
        ...BaseChartOptions,
        tooltip: {
          ...BaseChartOptions.tooltip,
          trigger: "item",
          formatter: (params: any) => {
            const val = params.value[1];
            return `
              <div style="font-weight:bold; margin-bottom: 4px;">${params.seriesName}</div>
              <div>${params.value[0]}: <b>${val > 0 ? '+' : ''}${val.toFixed(2)}%</b></div>
            `;
          }
        },
        xAxis: {
          ...BaseChartOptions.xAxis,
          type: "category",
          axisLabel: {
            ...BaseChartOptions.xAxis.axisLabel,
            formatter: (value: string) => {
              const [m, d] = value.split("-");
              if (d === "01") {
                const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                return months[parseInt(m)-1];
              }
              return "";
            }
          }
        },
        series,
      };
    }

    return BaseChartOptions;
  }, [mode, monthlyData, weeklyData, yearlyData]);

  return <ReactECharts option={options} style={{ height: "100%", width: "100%" }} notMerge={true} />;
}

export const SeasonalityChart = React.memo(_SeasonalityChart);
