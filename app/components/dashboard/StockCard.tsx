"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import Link from "next/link";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number; // Maps to changesPercentage
  volume: number;
  marketCap: number;
  fiftyTwoWeekChangePercent: number;
  isLoading?: boolean;
}

const formatNumber = (num: number) => {
  if (!num) return "N/A";
  if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + "T";
  if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
  if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
  if (num >= 1.0e3) return (num / 1.0e3).toFixed(2) + "K";
  return num.toString();
};

export const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume,
  marketCap,
  fiftyTwoWeekChangePercent,
  isLoading = false,
}) => {
  const isPositive = change >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444"; // green-500 : red-500

  if (isLoading) {
    return (
      <div className="min-w-[300px] h-[180px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 w-16 bg-[var(--border)] rounded"></div>
            <div className="h-4 w-24 bg-[var(--border)] rounded"></div>
          </div>
          <div className="h-8 w-20 bg-[var(--border)] rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-4 w-full bg-[var(--border)] rounded"></div>
            <div className="h-4 w-full bg-[var(--border)] rounded"></div>
            <div className="h-4 w-full bg-[var(--border)] rounded"></div>
        </div>
      </div>
    );
  }

  const handleCardClick = () => {
    // Construct the data object to match what [symbol]/page.tsx expects from session storage
    const cachedData = {
        symbol: symbol,
        name: name,
        regularMarketPrice: price, 
        regularMarketChange: change, 
        regularMarketChangePercent: changePercent, 
        // Add minimal structure to prevent "Stock not found" flash
        current_price: price,
        change: change,
        percent_change: changePercent,
        volume: volume,
        marketCap: marketCap,
        fiftyTwoWeekChangePercent: fiftyTwoWeekChangePercent
    };

    if (typeof window !== 'undefined') {
        sessionStorage.setItem(`stock_data_${symbol}`, JSON.stringify(cachedData));
    }
  };

  return (
    <Link 
      href={`/stocks/${symbol}`} 
      onClick={handleCardClick}
      className="block min-w-[320px] h-[180px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg flex flex-col justify-between transition-transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group cursor-pointer"
    >
      {/* Background Gradient Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
      />
      
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="font-bold text-lg text-[var(--text)]">{symbol}</h3>
          <p className="text-xs text-[var(--text-secondary)] truncate max-w-[140px]">{name}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-[var(--text)] text-lg">${price.toFixed(2)}</p>
          <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(changePercent).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 z-10">
        <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[var(--text-secondary)] font-semibold">Volume</span>
            <span className="text-sm font-medium text-[var(--text)]">{formatNumber(volume)}</span>
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] uppercase text-[var(--text-secondary)] font-semibold">Market Cap</span>
            <span className="text-sm font-medium text-[var(--text)]">{formatNumber(marketCap)}</span>
        </div>
        <div className="flex flex-col col-span-2">
            <span className="text-[10px] uppercase text-[var(--text-secondary)] font-semibold">52W Change</span>
            <span className={`text-sm font-medium ${fiftyTwoWeekChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                {fiftyTwoWeekChangePercent > 0 ? "+" : ""}{fiftyTwoWeekChangePercent.toFixed(2)}%
            </span>
        </div>
      </div>
    </Link>
  );
};
