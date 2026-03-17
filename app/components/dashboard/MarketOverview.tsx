"use client";

import React, { useEffect, useState } from "react";
import { StockCard } from "./StockCard";
import { TrendingUp, TrendingDown } from "lucide-react";


interface MarketStock {
  symbol: string;
  price: number;
  change: number;
  changesPercentage: number;
  volume: number;
  marketCap?: number;
}

export default function MarketOverview() {
  const [gainers, setGainers] = useState<MarketStock[]>([]);
  const [losers, setLosers] = useState<MarketStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const res = await fetch(`${baseUrl}/market/top-movers`);
        const data = await res.json();

        const mapStocks = (stocks: any[]) => {
          return stocks.slice(0, 10).map((stock) => ({
            symbol: stock.ticker,
            price: Number(stock.price),
            change: Number(stock.change_amount),
            changesPercentage: parseFloat(
              stock.change.replace("%", "")
            ),
            volume: Number(stock.volume),
            marketCap: 0
          }));
        };

        setGainers(mapStocks(data.gainers || []));
        setLosers(mapStocks(data.losers || []));
      } catch (error) {
        console.error("Failed to fetch market overview", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8 py-6">

      {/* Top Gainers */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-500 w-5 h-5" />
          <h2 className="text-xl font-bold">Top Gainers</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto">

          {gainers.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.symbol}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changesPercentage}
                  volume={stock.volume}
                />
              ))}
        </div>
      </section>

      {/* Top Losers */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-red-500 w-5 h-5" />
          <h2 className="text-xl font-bold">Top Losers</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto">

          { losers.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.symbol}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changesPercentage}
                  volume={stock.volume}
                />
              ))}
        </div>
      </section>

    </div>
  );
}