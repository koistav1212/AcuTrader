"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

interface PriceChartProps {
  data: { time: string; value: number }[];
  color?: string;
}

export default function PriceChart({ data, color = "#3b82f6" }: PriceChartProps) {
  const options = useMemo(() => {
    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10, 14, 24, 0.9)",
        borderColor: "rgba(255,255,255,0.1)",
        textStyle: {
          color: "#fff",
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 12,
        },
      },
      grid: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 40,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.time),
        axisLine: { lineStyle: { color: "rgba(0,0,0,0.1)" } },
        axisLabel: {
          color: "rgba(0,0,0,0.5)",
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 11,
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        scale: true,
        splitLine: {
          lineStyle: { color: "rgba(0,0,0,0.05)", type: "dashed" },
        },
        axisLabel: {
          color: "rgba(0,0,0,0.5)",
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 11,
        },
      },
      series: [
        {
          data: data.map((d) => d.value),
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: color,
            width: 2,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${color}40` }, // 25% opacity
                { offset: 1, color: `${color}00` }, // 0% opacity
              ],
            },
          },
        },
      ],
    };
  }, [data, color]);

  return <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />;
}
