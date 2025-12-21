"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Plus, Minus, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useUser } from "../context/UserContext";

export default function TrendingStocks() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleWatchlist, watchlistSymbols, user } = useUser();
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://acutrader-backend.onrender.com/api";
        const res = await fetch(`${baseUrl}/market/trending`);
        const json = await res.json();
        
        if (Array.isArray(json)) {
          setData(json);
        } else if (json && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          console.error("Unexpected API response format:", json);
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch trending stocks:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggle = async (e: React.MouseEvent, symbol: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) return; // Or show auth modal
      
      setToggling(symbol);
      try {
          await toggleWatchlist(symbol);
      } finally {
          setToggling(null);
      }
  };

  if (loading) {
     return <div className="text-sm text-[var(--text-secondary)]">Loading trending stocks...</div>;
  }

  if (!data || data.length === 0) {
     return <div className="text-sm text-[var(--text-secondary)]">No trending data available.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
        🔥 Trending Today
      </h3>

      <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-md">
        <table className="w-full text-sm">
           <thead className="bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] uppercase tracking-wide border-b border-[var(--border)]">
              <tr>
                 <th className="px-4 py-3 text-left">Symbol</th>
                 <th className="px-4 py-3 text-left">Company</th>
                 <th className="px-4 py-3 text-right">Price</th>
                 <th className="px-4 py-3 text-right">Change</th>
                 <th className="px-4 py-3 text-center">Watch</th>
                 <th className="px-4 py-3 text-right hidden sm:table-cell">Details</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-[var(--border)]">
              {data.map((stock: any) => {
                 const symbol = stock.symbol;
                 const name = stock.name || stock.instrument_name;
                 const price = stock.current_price || stock.price;
                 const change = stock.change || stock.percentage;
                 const percentChange = stock.percent_change || stock.changesPercentage || change;
                 const volume = stock.volume;
                 const mktCap = stock.market_cap || stock.mktCap;
                 const imageUrl = stock.image || `https://financialmodelingprep.com/image-stock/${symbol}.png`;

                 // Use percentChange if available, otherwise fallback to change
                 const displayChange = percentChange !== undefined ? percentChange : change;
                 const isPositive = displayChange >= 0;
                 const isInWatchlist = watchlistSymbols.has(symbol);
                 const isProcessing = toggling === symbol;

                 return (
                    <tr key={symbol} className="hover:bg-[var(--bg)] transition-colors">
                       <td className="px-4 py-3">
                          <Link href={`/stocks/${symbol}`} className="flex items-center gap-3 group">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-[var(--border)] shrink-0">
                                   <Image src={imageUrl} alt={symbol} fill className="object-contain p-0.5" />
                              </div>
                              <span className="font-bold text-[var(--accent)] group-hover:underline">{symbol}</span>
                          </Link>
                       </td>
                       <td className="px-4 py-3 font-medium text-[var(--text)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                           {name}
                       </td>
                       <td className="px-4 py-3 text-right font-mono text-[var(--text)]">
                           {price ? `$${price}` : "-"}
                       </td>
                       <td className="px-4 py-3 text-right">
                           {displayChange !== undefined ? (
                              <span className={cn("inline-flex items-center gap-1 font-semibold", isPositive ? "text-[var(--profit)]" : "text-[var(--loss)]")}>
                                 {isPositive ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                                 {Math.abs(displayChange).toFixed(2)}%
                              </span>
                           ) : "-"}
                       </td>
                       <td className="px-4 py-3 text-center">
                           <button 
                               onClick={(e) => handleToggle(e, symbol)}
                               disabled={isProcessing}
                               className={cn(
                                   "p-2 rounded-full transition-all",
                                   isInWatchlist 
                                       ? "bg-[var(--accent)] text-white hover:bg-red-500 hover:text-white"
                                       : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white"
                               )}
                               title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                           >
                               {isProcessing ? (
                                   <Loader2 className="w-4 h-4 animate-spin" />
                               ) : isInWatchlist ? (
                                   <Minus className="w-4 h-4" />
                               ) : (
                                   <Plus className="w-4 h-4" />
                               )}
                           </button>
                       </td>
                       <td className="px-4 py-3 text-right text-[var(--text-secondary)] hidden sm:table-cell text-xs">
                           <div className="flex flex-col items-end">
                               {volume && <span>Vol: {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(volume)}</span>}
                               {mktCap && <span>Cap: {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(mktCap)}</span>}
                           </div>
                       </td>
                    </tr>
                 )
              })}
           </tbody>
        </table>
      </div>
    </div>
  );
}
