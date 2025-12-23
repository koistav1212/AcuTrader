"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import Link from "next/link";

interface StockCardProps {
  symbol: string;
  name: string; // Added name potentially for company name
  price: number;
  change: number;
  changePercent: number;
  data: { date: string; value: number }[]; // 1-month historical data
  isLoading?: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  data,
  isLoading = false,
}) => {
  const isPositive = change >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444"; // green-500 : red-500

  // Fallback for empty data to prevent chart errors
  const chartData = data && data.length > 0 ? data : [{ date: "1", value: price }, { date: "2", value: price }];

  if (isLoading) {
    return (
      <div className="min-w-[300px] h-[160px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 w-16 bg-[var(--border)] rounded"></div>
            <div className="h-4 w-24 bg-[var(--border)] rounded"></div>
          </div>
          <div className="h-8 w-20 bg-[var(--border)] rounded"></div>
        </div>
        <div className="h-16 w-full bg-[var(--border)] rounded mt-4"></div>
      </div>
    );
  }

  const handleCardClick = () => {
    // Construct the data object to match what [symbol]/page.tsx expects from session storage
    // page.tsx looks for:
    // const price = quoteData.regularMarketPrice || quoteData.current_price || 0;
    // const change = quoteData.regularMarketChange || quoteData.change || 0;
    const cachedData = {
        symbol: symbol,
        name: name,
        regularMarketPrice: price, // page.tsx looks for this
        regularMarketChange: change, // page.tsx looks for this
        regularMarketChangePercent: changePercent, // page.tsx looks for this
        // Add minimal structure to prevent "Stock not found" flash
        current_price: price,
        change: change,
        percent_change: changePercent,
        chartData: data // optional, page.tsx doesn't strictly use this from quote but good to have
    };

    if (typeof window !== 'undefined') {
        sessionStorage.setItem(`stock_data_${symbol}`, JSON.stringify(cachedData));
    }
  };

  return (
    <Link 
      href={`/stocks/${symbol}`} 
      onClick={handleCardClick}
      className="block min-w-[300px] h-[160px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg flex flex-col justify-between transition-transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group cursor-pointer"
    >
      {/* Background Gradient Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
      />
      
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="font-bold text-lg text-[var(--text)]">{symbol}</h3>
          <p className="text-xs text-[var(--text-secondary)] truncate max-w-[120px]">{name}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-[var(--text)] text-lg">${price.toFixed(2)}</p>
          <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(changePercent).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="h-[60px] w-full mt-2 -mb-2 z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
             <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
            <YAxis domain={['auto', 'auto']} hide />
            <XAxis dataKey="date" hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#gradient-${symbol})`}
              strokeWidth={2}
              isAnimationActive={false} // Performance optimization for multiple charts
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
};
