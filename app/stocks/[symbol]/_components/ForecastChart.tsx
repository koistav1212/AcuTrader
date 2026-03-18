"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

export default function ForecastChart({ forecastData }: { forecastData: Record<string, any> }) {
  if (!forecastData || Object.keys(forecastData).length === 0) return null;

  const data = Object.entries(forecastData).map(([date, values]) => {
    return {
      date,
      bull: parseFloat(values?.bull_case) || 0,
      neutral: parseFloat(values?.neutral_case) || 0,
      bear: parseFloat(values?.bear_case) || 0,
    };
  });

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[var(--accent)]" /> 
        3-Day Forecast
      </h3>
      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: 'var(--text-secondary)' }} 
            />
            <YAxis 
              tickFormatter={(tick) => `${tick}%`} 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: 'var(--text-secondary)' }} 
            />
            <Tooltip 
              cursor={{ fill: 'var(--bg-secondary)', opacity: 0.4 }}
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)' }}
              itemStyle={{ color: 'var(--text)' }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px', color: 'var(--text-secondary)' }} />
            <Bar dataKey="bear" stackId="a" fill="#ef4444" name="Bear Case" radius={[0, 0, 4, 4]} />
            <Bar dataKey="neutral" stackId="a" fill="#9ca3af" name="Neutral Case" />
            <Bar dataKey="bull" stackId="a" fill="#22c55e" name="Bull Case" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
