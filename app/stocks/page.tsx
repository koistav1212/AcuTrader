"use client";

import { useState, useEffect, useCallback } from "react";
import Filters from "./Filters";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowUpRight, ArrowDownRight, ArrowUpDown, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { cn } from "../lib/utils";
import { useUser } from "../context/UserContext";

// Cache removed

type SortField = 'price' | 'change' | 'volume' | null;
type SortOrder = 'asc' | 'desc';

export default function MarketScreener() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: null,
    order: 'desc'
  });

  // Filters
  const [filters, setFilters] = useState({
    exchange: "",
    currency: "",
    trend: "", // UP or DOWN
    minPrice: 0,
    maxPrice: 1000,
    minMarketCap: 0
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://acutrader-backend.onrender.com/api";

  const { toggleWatchlist, watchlistSymbols, user } = useUser();
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggle = async (e: React.MouseEvent, symbol: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) return; 
      
      setToggling(symbol);
      try {
          await toggleWatchlist(symbol);
      } finally {
          setToggling(null);
      }
  };

  // Deduplication Helper (Robust)
  const deduplicate = (items: any[]) => {
      if (!Array.isArray(items)) return [];
      const seen = new Set();
      return items.filter(item => {
          if (!item.symbol) return false; // skip invalid
          const key = item.symbol.toUpperCase();
          const duplicate = seen.has(key);
          seen.add(key);
          return !duplicate;
      });
  };

  const fetchStocks = useCallback(async () => {
      setLoading(true);
      try {
        let endpoint = `${baseUrl}/market/trending`;
        
        // Cache Check for Trending Logic
        // Cache Check Logic Removed - Always Fresh
        if (!query) {
           // No local storage cache check
        } else {
           endpoint = `${baseUrl}/market/search?q=${query}`;
        }

        const res = await fetch(endpoint, { cache: 'no-store' });
        
        if (!res.ok) {
           if (res.status === 404 && query) {
               setData([]);
           } else {
               setData([]); 
           }
        } else {
            const json = await res.json();
            let rawData: any[] = [];
            
            if (Array.isArray(json)) {
                rawData = json;
            } else if (json.Stocks && Array.isArray(json.Stocks)) {
                rawData = json.Stocks;
            } else if (json.data && Array.isArray(json.data)) {
                rawData = json.data;
            }

            // Deduplicate new data
            const cleanData = deduplicate(rawData);
            setData(cleanData);

            // Update Cache logic removed

        }
      } catch (err) {
        console.error("Fetch failed", err);
        setData([]);
      } finally {
        setLoading(false);
      }
  }, [query, baseUrl]);

  // Fetch Effect
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchStocks();
    }, query ? 400 : 0);

    return () => clearTimeout(timer);
  }, [fetchStocks, query]);

  // Handle Sort Click
  const handleSort = (field: SortField) => {
     setSortConfig(current => ({
        field,
        order: current.field === field && current.order === 'desc' ? 'asc' : 'desc'
     }));
  };

  //
  // 📌 FILTERING & SORTING PROCESS
  //
  const processData = () => {
    if (!Array.isArray(data)) return [];

    // 1. Filter
    let result = data.filter((s: any) => {
      const itemExchange = s.exchange || "";
      const itemCurrency = s.currency || "";
      
      const price = s.current_price || s.price || 0;
      const changeVal = s.change || s.percent_change || s.changesPercentage || 0;
      const isUp = changeVal >= 0;

      // Exchange & Currency
      const matchesExchange = filters.exchange ? itemExchange.toLowerCase().includes(filters.exchange.toLowerCase()) : true;
      const matchesCurrency = filters.currency ? itemCurrency === filters.currency : true;
      
      // Trend
      let matchesTrend = true;
      if (filters.trend === "UP") {
          matchesTrend = changeVal > 0;
      } else if (filters.trend === "DOWN") {
          matchesTrend = changeVal < 0;
      }

      // Price Range (Strict)
      let matchesPrice = true;
      if (price < filters.minPrice) matchesPrice = false;
      // If maxPrice is at limit (1000), act as "1000+", so don't filter out higher prices
      if (filters.maxPrice < 1000 && price > filters.maxPrice) matchesPrice = false;

      // Market Cap (Handle aliases)
      const mktCap = s.market_cap || s.mktCap || s.marketCap || 0;
      const matchesMktCap = mktCap >= filters.minMarketCap;

      return matchesExchange && matchesCurrency && matchesTrend && matchesPrice && matchesMktCap;
    });

    // 2. Sort
    if (sortConfig.field) {
       result.sort((a: any, b: any) => {
          let valA = 0;
          let valB = 0;

          switch (sortConfig.field) {
             case 'price':
                valA = a.current_price || a.price || 0;
                valB = b.current_price || b.price || 0;
                break;
             case 'change':
                valA = a.change || a.percent_change || a.changesPercentage || 0;
                valB = b.change || b.percent_change || b.changesPercentage || 0;
                break;
             case 'volume':
                valA = a.volume || 0;
                valB = b.volume || 0;
                break;
          }

          if (valA < valB) return sortConfig.order === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.order === 'asc' ? 1 : -1;
          return 0;
       });
    }

    return result;
  };

  const filteredAndSorted = processData();

  return (
    <section className="space-y-8 pb-20 relative min-h-screen">
      
      {/* 🔍 SEARCH HERO */}
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
         <h1 className="text-3xl font-bold text-[var(--text)]">Find Your Next Investment</h1>
         <div className="w-full max-w-2xl relative">
            <input
              type="text"
              placeholder="Search by symbol, company or ISIN..."
              className="w-full p-4 pl-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
            
            {loading && query && (
               <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
               </div>
            )}
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

          {/* FILTERS SIDEBAR */}
          <div className="w-full lg:w-1/4 shrink-0">
             <div className="lg:sticky lg:top-24">
                <Filters filters={filters} setFilters={setFilters} />
             </div>
          </div>

          {/* RESULTS TABLE */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
                 {loading && !query ? "Loading Trending Stocks..." : `${filteredAndSorted.length} Results Found`}
               </h3>
               {!query && !loading && (
                   <span className="text-xs px-2 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-bold">
                       🔥 Trending
                   </span>
               )}
            </div>

            <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-xl relative min-h-[200px]">
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] uppercase tracking-wide border-b border-[var(--border)]">
                    <tr>
                      <th className="px-4 py-3 text-left">Symbol</th>
                      <th className="px-4 py-3 text-left">Company</th>
                      
                      {/* Sortable Headers */}
                      <th 
                        className="px-4 py-3 text-right cursor-pointer hover:bg-[var(--border)]/50 transition-colors group"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center justify-end gap-1">
                           Price
                           <ArrowUpDown className={cn("w-3 h-3", sortConfig.field === 'price' ? "text-[var(--accent)]" : "text-[var(--text-secondary)]/30")} />
                        </div>
                      </th>

                      <th 
                        className="px-4 py-3 text-right cursor-pointer hover:bg-[var(--border)]/50 transition-colors group"
                        onClick={() => handleSort('change')}
                      >
                         <div className="flex items-center justify-end gap-1">
                           Change
                           <ArrowUpDown className={cn("w-3 h-3", sortConfig.field === 'change' ? "text-[var(--accent)]" : "text-[var(--text-secondary)]/30")} />
                        </div>
                      </th>

                      <th className="px-4 py-3 text-center">Watch</th>

                      <th 
                        className="px-4 py-3 text-right hidden sm:table-cell cursor-pointer hover:bg-[var(--border)]/50 transition-colors group"
                        onClick={() => handleSort('volume')}
                      >
                         <div className="flex items-center justify-end gap-1">
                           Vol / Mkt Cap
                           <ArrowUpDown className={cn("w-3 h-3", sortConfig.field === 'volume' ? "text-[var(--accent)]" : "text-[var(--text-secondary)]/30")} />
                        </div>
                      </th>

                      <th className="px-4 py-3 text-right hidden md:table-cell">Exchange</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--border)]">
                    {loading && filteredAndSorted.length === 0 ? (
                       [...Array(5)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                             <td className="px-4 py-4"><div className="h-8 w-8 rounded-full bg-[var(--bg-secondary)] inline-block mr-2"></div><div className="h-4 w-12 bg-[var(--bg-secondary)] rounded inline-block"></div></td>
                             <td className="px-4 py-4"><div className="h-4 w-32 bg-[var(--bg-secondary)] rounded"></div></td>
                             <td className="px-4 py-4"><div className="h-4 w-16 bg-[var(--bg-secondary)] rounded ml-auto"></div></td>
                             <td className="px-4 py-4"><div className="h-4 w-12 bg-[var(--bg-secondary)] rounded ml-auto"></div></td>
                             <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 w-20 bg-[var(--bg-secondary)] rounded ml-auto"></div></td>
                             <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 w-10 bg-[var(--bg-secondary)] rounded ml-auto"></div></td>
                          </tr>
                       ))
                    ) : filteredAndSorted.length > 0 ? (
                      filteredAndSorted.map((item: any) => {
                         const symbol = item.symbol;
                         const name = item.name || item.instrument_name || "";
                         const price = item.current_price || item.price || 0;
                         const change = item.change || item.percentage || 0;
                         const percentChange = item.percent_change || item.changesPercentage || change;
                         const volume = item.volume || 0;
                         const mktCap = item.market_cap || item.mktCap || item.marketCap || 0;
                         const exchange = item.exchange || "";
                         const imageUrl = item.image || `https://financialmodelingprep.com/image-stock/${symbol}.png`;

                         const isPositive = percentChange >= 0 || change >= 0;

                          const enrichedItem = { ...item, logo: imageUrl };
                          return (
                          <tr
                            key={symbol}
                            onClick={() => {
                                // Store data for the next page to avoid API call
                                if (typeof window !== 'undefined') {
                                    sessionStorage.setItem(`stock_data_${symbol}`, JSON.stringify(enrichedItem));
                                }
                                router.push(`/stocks/${symbol}`);
                            }}
                            className="group bg-[var(--card)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3">
                               <div className="flex items-center gap-3">
                                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-[var(--border)] shrink-0">
                                      <Image 
                                        src={imageUrl} 
                                        alt={symbol} 
                                        fill 
                                        className="object-contain p-0.5"
                                        onError={(e) => {
                                            // Handle error
                                        }}
                                      />
                                  </div>
                                  <span className="font-bold text-[var(--accent)] group-hover:underline">
                                    {symbol}
                                  </span>
                               </div>
                            </td>
                            
                            <td className="px-4 py-3 font-medium text-[var(--text)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                               {name}
                            </td>
                            
                            <td className="px-4 py-3 text-right font-mono text-[var(--text)]">
                               {price ? `$${price.toFixed(2)}` : "-"}
                            </td>

                            <td className="px-4 py-3 text-right">
                               {percentChange ? (
                                  <span className={cn(
                                     "inline-flex items-center gap-1 font-semibold",
                                     isPositive ? "text-[var(--profit)]" : "text-[var(--loss)]"
                                  )}>
                                     {isPositive ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                                     {Math.abs(percentChange).toFixed(2)}%
                                  </span>
                               ) : "-"}
                            </td>

                            <td className="px-4 py-3 text-center">
                               <button 
                                   onClick={(e) => handleToggle(e, symbol)}
                                   disabled={toggling === symbol}
                                   className={cn(
                                       "p-2 rounded-full transition-all",
                                       watchlistSymbols.has(symbol)
                                           ? "bg-[var(--accent)] text-white hover:bg-red-500 hover:text-white"
                                           : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white"
                                   )}
                                   title={watchlistSymbols.has(symbol) ? "Remove from Watchlist" : "Add to Watchlist"}
                               >
                                   {toggling === symbol ? (
                                       <Loader2 className="w-4 h-4 animate-spin" />
                                   ) : watchlistSymbols.has(symbol) ? (
                                       <Minus className="w-4 h-4" />
                                   ) : (
                                       <Plus className="w-4 h-4" />
                                   )}
                               </button>
                           </td>

                            <td className="px-4 py-3 text-right text-[var(--text-secondary)] hidden sm:table-cell text-xs">
                                <div className="flex flex-col items-end">
                                    {volume > 0 && <span>Vol: {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(volume)}</span>}
                                    {mktCap > 0 && <span>MCap: {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(mktCap)}</span>}
                                    {!volume && !mktCap && "-"}
                                </div>
                            </td>

                            <td className="px-4 py-3 text-right text-[var(--text-secondary)] hidden md:table-cell">
                                {exchange}
                            </td>
                          </tr>
                         );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                           {query ? `No stocks found matching "${query}"` : "No stocks available matching your filters."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
