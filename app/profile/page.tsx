"use client";

import { useUser } from "../context/UserContext";
import { peers } from "../lib/data/sim-data"; // Keep peers mock for now
import { cn } from "../lib/utils";
import { ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, User, Plus, Minus, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ProfileSection() {
  const { user, holdings, transactions, watchlist, toggleWatchlist } = useUser();
  const [toggling, setToggling] = useState<string | null>(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);

  const handleToggle = async (symbol: string) => {
      setToggling(symbol);
      try {
          await toggleWatchlist(symbol);
      } finally {
          setToggling(null);
      }
  };

  const totalValue = holdings.reduce(
    (sum, h) => sum + h.quantity * (h.marketPrice || h.avgCost), // Use avgCost if marketPrice missing
    0
  );

  if (!user) {
      return <div className="p-8 text-center text-[var(--text-secondary)]">Please log in to view profile.</div>;
  }

  return (
    <section className="space-y-8 pb-20">
      {/* --- Profile Header --- */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--card)] shadow-lg flex items-center justify-center shrink-0 z-10">
           <User className="w-10 h-10 text-[var(--text-secondary)]" />
        </div>

        {/* Info */}
        <div className="text-center md:text-left z-10 flex-grow">
          <h1 className="text-2xl font-bold text-[var(--text)]">{user.firstName} {user.lastName}</h1>
          <p className="text-[var(--text-secondary)] text-sm">{user.email}</p>
          
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
             <div className="px-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-semibold">Net Worth</p>
                <p className="text-lg font-bold text-[var(--profit)]">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
             </div>
             <div className="px-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-semibold">Holdings</p>
                <p className="text-lg font-bold text-[var(--text)]">{holdings.length}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Left Column --- */}
        <div className="space-y-8">
          
          {/* My Transactions */}
          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 shadow-lg">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-[var(--text)]">Recent Transactions</h2>
               <button className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                 View All
               </button>
             </div>
             
             {transactions.length === 0 ? (
                 <p className="text-sm text-[var(--text-secondary)] text-center py-4">No transactions yet.</p>
             ) : (
                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--border)]">
                    {transactions.slice(0, 10).map((tx, idx) => (
                      <div key={tx.id || idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[var(--bg)] transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            tx.type === "BUY" ? "bg-[var(--profit)]/10 text-[var(--profit)]" : "bg-[var(--loss)]/10 text-[var(--loss)]"
                          )}>
                             {tx.type === "BUY" ? <ArrowDownRight className="w-5 h-5"/> : <ArrowUpRight className="w-5 h-5"/>}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[var(--text)]">{tx.symbol}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{new Date(tx.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-sm text-[var(--text)]">
                             {tx.type === "BUY" ? "+" : "-"}{tx.quantity} Shares
                           </p>
                           <p className="text-xs text-[var(--text-secondary)]">
                              @ ${tx.price}
                           </p>
                        </div>
                      </div>
                    ))}
                 </div>
             )}
          </div>

          {/* My Watchlist */}
          <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 shadow-lg overflow-hidden">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-[var(--text)]">My Watchlist</h2>
               {watchlist.length > 10 && (
                   <button 
                     onClick={() => setShowWatchlistModal(true)}
                     className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                   >
                     View All ({watchlist.length})
                   </button>
               )}
             </div>

             {watchlist.length === 0 ? (
                 <p className="text-sm text-[var(--text-secondary)] text-center py-4">Start adding stocks to your watchlist!</p>
             ) : (
                 <div className="overflow-x-auto">
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
                          {watchlist.slice(0, 10).map((item: any) => (
                             <WatchlistRow 
                                key={item.symbol} 
                                symbol={item.symbol} 
                                onToggle={handleToggle} 
                                isToggling={toggling === item.symbol}
                             />
                          ))}
                       </tbody>
                    </table>
                 </div>
             )}
          </div>

        </div>

        {/* Watchlist Modal */}
        {showWatchlistModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-[var(--card)] w-full max-w-4xl max-h-[80vh] rounded-3xl border border-[var(--border)] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
                        <h2 className="text-xl font-bold text-[var(--text)]">My Watchlist ({watchlist.length})</h2>
                        <button 
                            onClick={() => setShowWatchlistModal(false)}
                            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
                        >
                            <Minus className="w-6 h-6 rotate-45" /> {/* Use Minus rotated as X or import X */}
                        </button>
                    </div>
                    <div className="overflow-y-auto p-0 flex-1">
                        <table className="w-full text-sm">
                           <thead className="bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] uppercase tracking-wide border-b border-[var(--border)] sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
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
                              {watchlist.map((item: any) => (
                                 <WatchlistRow 
                                    key={item.symbol} 
                                    symbol={item.symbol} 
                                    onToggle={handleToggle} 
                                    isToggling={toggling === item.symbol}
                                 />
                              ))}
                           </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- Right Column --- */}
        <div className="space-y-8">
            
            {/* My Peers */}
            <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 shadow-lg h-full">
               <div className="bg-[var(--accent)]/10 rounded-2xl p-6 mb-6 text-center">
                  <h2 className="text-xl font-bold text-[var(--text)] mb-2">Compare with Peers</h2>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">See how your portfolio stacks up against top performers.</p>
               </div>

               <div className="space-y-4">
                  {peers.map((peer) => (
                     <div key={peer.id} className="p-4 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)]/50 hover:shadow-md transition-all group bg-[var(--bg)]/30">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--card)] shadow-sm">
                                 <Image 
                                    src={peer.avatar} 
                                    alt={peer.name}
                                    fill
                                    className="object-cover"
                                 />
                              </div>
                              <div>
                                 <p className="font-bold text-[var(--text)]">{peer.name}</p>
                                 <p className="text-xs text-[var(--text-secondary)]">{peer.holdings.length} Holdings</p>
                              </div>
                           </div>
                           <Link href={`/peers/${peer.id}`} className="px-4 py-2 rounded-xl bg-[var(--card)] text-[var(--text)] text-xs font-bold border border-[var(--border)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-transparent transition-all">
                              Compare
                           </Link>
                        </div>
                        
                         {/* Mini Holdings Preview */}
                         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                           {peer.holdings.slice(0, 4).map(h => (
                              <MiniHoldingPill key={h.symbol} symbol={h.symbol} />
                           ))}
                           {peer.holdings.length > 4 && (
                              <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-[var(--bg-secondary)] text-[10px] font-mono text-[var(--text-secondary)] h-full min-h-[44px]">
                                 +{peer.holdings.length - 4}
                              </div>
                           )}
                         </div>
                     </div>
                  ))}
               </div>
            </div>

        </div>

      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Mini Component for Fetching & Displaying Single Holding Data
// --------------------------------------------------------------------------

function MiniHoldingPill({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchQuote() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${baseUrl}/market/quote/${symbol}`);
        const json = await res.json();
        if (mounted) {
           setData(json);
           setLoading(false);
        }
      } catch (err) {
        // quiet failure
        if (mounted) setLoading(false);
      }
    }
    fetchQuote();
    return () => { mounted = false; };
  }, [symbol]);

  if (loading) {
     return (
        <span className="px-2 py-1 rounded-md bg-[var(--bg-secondary)] text-[10px] font-mono text-[var(--text-secondary)] animate-pulse">
           {symbol}
        </span>
     );
  }

  // Fallback to basic display if no data
  if (!data) {
      return (
        <span className="px-2 py-1 rounded-md bg-[var(--bg-secondary)] text-[10px] font-mono text-[var(--text-secondary)]">
          {symbol}
        </span>
      );
  }

  const price = data.regularMarketPrice || data.current_price || 0;
  // Prioritize percent_change as per user request
  const change = data.percent_change || data.regularMarketChangePercent || 0;
  const isPositive = change >= 0;

  return (
    <Link href={`/stocks/${symbol}`} className="flex flex-col items-start px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--accent)]/10 border border-transparent hover:border-[var(--accent)]/20 transition-all group min-w-[80px]">
       <span className="text-[10px] font-bold text-[var(--text)] mb-0.5">{symbol}</span>
       <div className="flex items-center gap-1.5 w-full justify-between">
          <span className="text-[10px] text-[var(--text-secondary)] font-mono">${price.toFixed(2)}</span>
          <span className={cn("text-[9px] font-semibold flex items-center", isPositive ? "text-[var(--profit)]" : "text-[var(--loss)]")}>
             {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
          </span>
       </div>
    </Link>
  );
}

function WatchlistRow({ symbol, onToggle, isToggling }: { symbol: string, onToggle: (s:string)=>void, isToggling: boolean }) {
  const [stock, setStock] = useState<any>(null);
  
  useEffect(() => {
    let mounted = true;
    async function fetchQuote() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${baseUrl}/market/quote/${symbol}`);
        const json = await res.json();
        if (mounted) {
           setStock(json);
        }
      } catch (err) {
        // quiet fail
      }
    }
    fetchQuote();
    return () => { mounted = false; };
  }, [symbol]);

  // Loading state skeleton
  if (!stock) {
      return (
         <tr className="animate-pulse">
            <td className="px-4 py-3"><div className="h-4 w-8 bg-[var(--bg-secondary)] rounded"></div></td>
            <td className="px-4 py-3"><div className="h-4 w-20 bg-[var(--bg-secondary)] rounded"></div></td>
            <td className="px-4 py-3 text-right"><div className="h-4 w-12 bg-[var(--bg-secondary)] rounded ml-auto"></div></td>
            <td className="px-4 py-3 text-right"><div className="h-4 w-12 bg-[var(--bg-secondary)] rounded ml-auto"></div></td>
            <td className="px-4 py-3 text-center"><div className="h-8 w-8 bg-[var(--bg-secondary)] rounded-full mx-auto"></div></td>
            <td className="px-4 py-3 hidden sm:table-cell"></td>
         </tr>
      )
  }

  // Logic from User Request / TrendingStocks
  const name = stock.name || stock.displayName || stock.instrument_name ||  symbol;
  const price = stock.regularMarketPrice || stock.current_price || stock.price || 0;
  
  // Explicit priority for percent_change
  const changeVal = stock.change || stock.regularMarketChange || 0;
  const percentChangeVal = stock.percent_change || stock.regularMarketChangePercent || stock.changesPercentage;

  const displayChange = percentChangeVal !== undefined ? percentChangeVal : changeVal;
  const isPositive = displayChange >= 0;

  const volume = stock.volume || stock.regularMarketVolume;
  const mktCap = stock.market_cap || stock.mktCap || stock.marketCap;
  const imageUrl = stock.image || stock.logo || `https://financialmodelingprep.com/image-stock/${symbol}.png`;

  return (
    <tr className="hover:bg-[var(--bg)] transition-colors">
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
           {price ? `$${price.toFixed(2)}` : "-"}
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
               onClick={() => onToggle(symbol)}
               disabled={isToggling}
               className="p-2 rounded-full transition-all bg-[var(--accent)] text-white hover:bg-red-500 hover:text-white"
               title="Remove from Watchlist"
           >
               {isToggling ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
               ) : (
                   <Minus className="w-4 h-4" />
               )}
           </button>
       </td>
       <td className="px-4 py-3 text-right text-[var(--text-secondary)] hidden sm:table-cell text-xs">
           <div className="flex flex-col items-end">
               {volume && <span>Vol: {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(volume)}</span>}
               {mktCap && <span>Cap: {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(mktCap)}</span>}
               <Link href={`/stocks/${symbol}`} className="text-[var(--accent)] hover:underline mt-1">
                   View
               </Link>
           </div>
       </td>
    </tr>
  );
}
