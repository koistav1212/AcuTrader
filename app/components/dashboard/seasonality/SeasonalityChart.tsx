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
          data: monthlyData.map(d => d.month),
        },
        series: [
          {
            type: "bar",
            data: monthlyData.map(d => ({
              value: d.averageReturn,
              itemStyle: { color: d.averageReturn >= 0 ? positiveColor : negativeColor }
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
              <div style="font-weight:bold; margin-bottom: 4px;">${p.name}</div>
              <div>Avg Return: <b>${val > 0 ? '+' : ''}${val.toFixed(2)}%</b></div>
            `;
          }
        },
        xAxis: {
          ...BaseChartOptions.xAxis,
          data: weeklyData.map(d => d.day),
        },
        series: [
          {
            type: "bar",
            data: weeklyData.map(d => ({
              value: d.averageReturn,
              itemStyle: { color: d.averageReturn >= 0 ? "#63b38d" : "#bd6666" }
            })),
            barMaxWidth: 40,
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
            },
          },
        ],
      };
    }

    if (mode === "Yearly") {
      const positiveColor = "#63b38d";
      const negativeColor = "#bd6666";

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
                <span>Annual Return: <b style="color:${color}">${val > 0 ? '+' : ''}${val.toFixed(2)}%</b></span>
              </div>
            `;
          }
        },
        xAxis: {
          ...BaseChartOptions.xAxis,
          data: yearlyData.map(d => d.year.toString()),
        },
        series: [
          {
            type: "bar",
            data: yearlyData.map(d => ({
              value: d.return,
              itemStyle: { color: d.return >= 0 ? positiveColor : negativeColor }
            })),
            barMaxWidth: 40,
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
            },
          },
        ],
      };
    }

    return BaseChartOptions;
  }, [mode, monthlyData, weeklyData, yearlyData]);

  return <ReactECharts option={options} style={{ height: "100%", width: "100%" }} notMerge={true} />;
}

export const SeasonalityChart = React.memo(_SeasonalityChart);
