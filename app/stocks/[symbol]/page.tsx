"use client";

import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import StockOrderForm from "./_components/StockOrderForm";
import { Brain, Activity, TrendingUp, Zap, Scale, BarChart3, AlertCircle, DollarSign, PieChart, Briefcase } from "lucide-react";
import StockChart from "../../../components/charts/StockChart";

export default function StockDetail() {
  const params = useParams();
  const symbol = params.symbol as string;

  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    async function fetchData() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // Fetch Detailed Stock Data from Search API
        // This single endpoint now returns all necessary details
        const res = await fetch(`${baseUrl}/market/search?q=${symbol}`);
        const data = await res.json();
        
        let stockItem = null;

        // Robust handling for response structure { "Stocks": [...] }
        if (data.Stocks && Array.isArray(data.Stocks)) {
            // Find exact match or first item if unique
             stockItem = data.Stocks.find((item: any) => 
                item.symbol === symbol || item.symbol === symbol.toUpperCase()
            );
             // If no exact match found but we have results, maybe take the first one? 
             // Ideally the API returns the requested symbol.
             if (!stockItem && data.Stocks.length > 0) {
                 stockItem = data.Stocks[0];
             }
        } else if (Array.isArray(data)) {
            stockItem = data.find((item: any) => 
                 item.symbol === symbol || item.symbol === symbol.toUpperCase()
             );
        }

        if (stockItem) {
            setStockData(stockItem);
            // Optionally cache this rich data
            if (typeof window !== 'undefined') {
                sessionStorage.setItem(`stock_data_${symbol}`, JSON.stringify(stockItem));
            }
        } else {
             console.warn("Stock not found in search results");
        }

      } catch (e) {
        console.error("Failed to fetch stock data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-[var(--text-secondary)]">Loading {symbol}...</div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-xl font-bold text-[var(--text)]">Stock not found</h2>
        <Link 
          href="/stocks"
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition"
        >
          Back to Screener
        </Link>
      </div>
    );
  }

// Helper to format large numbers (handling strings like "4.50T" or raw numbers)
  const formatValue = (val: any) => {
    if (val === undefined || val === null) return "-";
    if (typeof val === 'string') return val; // Return string as-is (e.g., "4.50T", "53.01%")
    
    // If it's a raw number, format it
    if (typeof val === 'number') {
        if (val >= 1e12) return (val / 1e12).toFixed(2) + "T";
        if (val >= 1e9) return (val / 1e9).toFixed(2) + "B";
        if (val >= 1e6) return (val / 1e6).toFixed(2) + "M";
        if (val >= 1e3) return (val / 1e3).toFixed(2) + "K";
        return val.toLocaleString();
    }
    return val;
  };

  // Safe Number parser for things that definitely need to be numbers (like price for order form)
  const parseNum = (val: any) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return parseFloat(val.replace(/,/g, ''));
      return 0;
  };
  
  const s = stockData; // Short alias
  const currentPrice = parseNum(s.current_price || s.price || 0);
  const change = parseNum(s.change || 0);
  const percentChange = parseNum(s.percent_change || 0);
  const isUp = s.is_up !== undefined ? s.is_up : change >= 0;
  
  // Use generic logo service since new API might not provide 'logo' directly
  const logoUrl = s.logo || `https://financialmodelingprep.com/image-stock/${s.symbol}.png`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 🔙 BACK BUTTON */}
      <div>
        <Link
          href="/stocks"
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition flex items-center gap-1 w-fit"
        >
          ← Back to Screener
        </Link>
      </div>

      {/* 🏗️ HEADER SECTION */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2 shadow-sm overflow-hidden shrink-0">
            <Image 
                src={logoUrl} 
                alt={s.symbol} 
                width={64}
                height={64}
                className="w-full h-full object-contain"
                unoptimized
                onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = 'hidden'; 
                }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2 flex-wrap">
              {s.name}
              <span className="text-sm px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-normal border border-[var(--border)]">
                {s.symbol}
              </span>
            </h1>
            <div className="text-sm text-[var(--text-secondary)] mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span>{s.currency || "USD"}</span>
              <span>•</span>
              <span className="text-[var(--accent)]">{s.exchange || "NASDAQ/NYSE"}</span>
            </div>
          </div>
        </div>

        <div className="text-right w-full md:w-auto">
          <div className="text-4xl font-bold text-[var(--text)] tracking-tight">
            ${currentPrice.toFixed(2)}
          </div>
          <div className={cn("text-lg font-semibold flex items-center md:justify-end gap-2", isUp ? "text-[var(--profit)]" : "text-[var(--loss)]")}>
            <span>{isUp ? "▲" : "▼"}</span>
            <span>{Math.abs(change).toFixed(2)}</span>
            <span>({Math.abs(percentChange).toFixed(2)}%)</span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
             Last update: {s.datetime ? new Date(s.datetime).toLocaleString() : new Date().toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📉 LEFT COLUMN: STATS GRIDS */}
        <div className="lg:col-span-2 space-y-6">

          {/* 🕯️ CANDLESTICK CHART */}
          <StockChart symbol={s.symbol} />

          {/* 📊 ANALYTICS SECTION (MBA Insight) */}
          <AnalyticsSection stock={s} />
          
          {/* TRADING INFO CARD */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--accent)]" /> 
                Trading Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
               <StatItem label="Open" value={s.open} prefix="$" />
               <StatItem label="Previous Close" value={s.previous_close} prefix="$" />
               <StatItem label="Day High" value={s.day_high} prefix="$" />
               <StatItem label="Day Low" value={s.day_low} prefix="$" />
               <StatItem label="Volume" value={s.volume} />
               <StatItem label="Avg Volume" value={s.average_volume} />
               <StatItem label="Bid" value={s.bid || "-"} />
               <StatItem label="Ask" value={s.ask || "-"} />
               <StatItem label="52 Week High" value={s.fifty_two_week_high} prefix="$" />
               <StatItem label="52 Week Low" value={s.fifty_two_week_low} prefix="$" />
            </div>
          </div>

          {/* VALUATION & RATIOS CARD */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--accent)]" />
                Valuation & Ratios
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
               <StatItem label="Market Cap" value={s.market_cap} />
               <StatItem label="Enterprise Value" value={s.enterprise_value} />
               <StatItem label="PE Ratio" value={s.pe_ratio} />
               <StatItem label="Forward PE" value={s.forward_pe} />
               <StatItem label="Trailing PE" value={s.trailing_pe} />
               <StatItem label="PEG Ratio" value={s.peg_ratio} />
               <StatItem label="Price/Sales" value={s.price_to_sales} />
               <StatItem label="Price/Book" value={s.price_to_book} />
               <StatItem label="EV/Revenue" value={s.enterprise_value_to_revenue} />
               <StatItem label="EV/EBITDA" value={s.enterprise_value_to_ebitda} />
            </div>
          </div>

           {/* FINANCIAL STRENGTH CARD */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
             <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[var(--accent)]" />
                Financial Strength
             </h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
                <StatItem label="Revenue" value={s.revenue} />
                <StatItem label="Net Income" value={s.net_income} />
                <StatItem label="Profit Margin" value={s.profit_margin} />
                <StatItem label="Return on Assets" value={s.return_on_assets} />
                <StatItem label="Return on Equity" value={s.return_on_equity} />
                <StatItem label="Total Cash" value={s.total_cash} />
                <StatItem label="Total Debt/Equity" value={s.total_debt_to_equity} />
                <StatItem label="Lvd Free Cash Flow" value={s.levered_free_cash_flow} />
                <StatItem label="EPS" value={s.eps} prefix="$" />
                <StatItem label="Diluted EPS" value={s.diluted_eps} prefix="$" />
             </div>
          </div>
          
           {/* ANALYST & DIVIDENDS - Compact Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                     <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[var(--accent)]" />
                        Analyst Consensus
                     </h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">Analyst Rating</span>
                            <span className={cn(
                                "text-lg font-bold px-3 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)]",
                                (s.analyst_rating || "").toLowerCase().includes('buy') ? "text-[var(--profit)]" : 
                                (s.analyst_rating || "").toLowerCase().includes('sell') ? "text-[var(--loss)]" : "text-[var(--text)]"
                            )}>
                                {s.analyst_rating || "N/A"}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">Price Target</span>
                            <span className="text-lg font-bold text-[var(--text)]">
                                {s.analyst_price_target || "-"}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">Target Est (1Y)</span>
                            <span className="text-lg font-bold text-[var(--text)]">
                                ${s.target_est_1y || "-"}
                            </span>
                        </div>
                     </div>
                </div>

                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                     <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-[var(--accent)]" />
                        Dividends
                     </h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                             <span className="text-sm text-[var(--text-secondary)]">Forward Dividend & Yield</span>
                             <span className="text-base font-semibold text-[var(--text)]">
                                 {s.forward_dividend_yield || "-"}
                             </span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-sm text-[var(--text-secondary)]">Earnings Date</span>
                             <span className="text-base font-semibold text-[var(--text)]">
                                 {s.earnings_date || "-"}
                             </span>
                        </div>
                     </div>
                </div>
           </div>

        </div>

        {/* 📈 RIGHT COLUMN: BUY/SELL FORM */}
        <div className="space-y-6">
          <StockOrderForm 
            symbol={s.symbol} 
            currentPrice={currentPrice} 
            logo={logoUrl} 
            name={s.name} 
            marketState={isUp ? "OPEN" : "CLOSED"} // Approximation or we can fetch state if needed
          />
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component Helpers
// -------------------------------------------------------------

function StatItem({ label, value, prefix = "" }: { label: string; value: string | number; prefix?: string }) {
   // Helper to display nicely
   const display = (value === undefined || value === null) ? "-" : `${prefix}${value}`;
   
  return (
    <div>
      <div className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-[var(--text)] truncate" title={String(value)}>
        {display}
      </div>
    </div>
  );
}

// --- ANALYTICS ENGINE (User Requested MBA Projectable) ---
// Updated to use the new flat API structure

function getFundamentalInsights(s: any) {
  const insights = [];

  // 1. Valuation Check (PE)
  if (s.forward_pe && s.trailing_pe) {
     const isUndervalued = s.forward_pe < s.trailing_pe;
     insights.push({
        label: "Valuation Outlook",
        value: isUndervalued ? `Improving (Fwd PE ${s.forward_pe} < TTM)` : `Premium (Fwd PE ${s.forward_pe} > TTM)`,
        status: isUndervalued ? "positive" : "neutral"
     });
  }

  // 2. PEG Ratio
  if (s.peg_ratio) {
      let status = "neutral";
      let desc = "Fairly Valued";
      if (s.peg_ratio < 1) { status = "positive"; desc = "Undervalued Growth (<1.0)"; }
      else if (s.peg_ratio > 2) { status = "negative"; desc = "Overvalued Growth (>2.0)"; }
      insights.push({ label: "Growth Valuation (PEG)", value: `${desc} (${s.peg_ratio})`, status });
  }

  // 3. Profitability
  if (s.profit_margin) {
      // "53.01%" string
      const margin = parseFloat(s.profit_margin.replace('%', ''));
      const isHigh = margin > 20;
      insights.push({
          label: "Profit Margin", 
          value: isHigh ? `High Margins (${s.profit_margin})` : `Standard Margins (${s.profit_margin})`,
          status: isHigh ? "positive" : "neutral"
      });
  }

  // 4. Return on Equity
  if (s.return_on_equity) {
      const roe = parseFloat(s.return_on_equity.replace('%', ''));
      insights.push({ 
          label: "Return on Equity", 
          value: roe > 15 ? `Strong Returns (${s.return_on_equity})` : `Average Returns (${s.return_on_equity})`, 
          status: roe > 15 ? "positive" : "neutral" 
      });
  }

  // 5. Analyst Sentiment
  const rating = s.analyst_rating || "N/A";
  const isBuy = rating.toLowerCase().includes("buy");
  insights.push({ 
      label: "Street Sentiment", 
      value: rating, 
      status: isBuy ? "positive" : "neutral" 
  });

  return insights;
}

function getTechnicalInsights(s: any) {
    const insights = [];

    // 1. Target Proximity
    if (s.target_est_1y && s.current_price) {
        const potential = ((s.target_est_1y - s.current_price) / s.current_price) * 100;
        insights.push({
            label: "1y Target Upside",
            value: `${potential.toFixed(2)}% upside to ${s.target_est_1y}`,
            status: potential > 10 ? "positive" : "neutral"
        });
    }

    // 2. 52 Week High Proximity
    if (s.fifty_two_week_high && s.current_price) {
        const diff = (s.fifty_two_week_high - s.current_price) / s.fifty_two_week_high;
        const nearHigh = diff < 0.05; // within 5%
        insights.push({
            label: "Momentum",
            value: nearHigh ? "Testing Highs" : `Retracing (${(diff * 100).toFixed(1)}% off High)`,
            status: nearHigh ? "positive" : "neutral"
        });
    }

    // 3. Short Term Trend (Day High/Low)
    if (s.day_high && s.day_low && s.current_price) {
        const range = s.day_high - s.day_low;
        const pos = (s.current_price - s.day_low) / range; // 0 to 1 position in day range
        insights.push({
            label: "Intraday Strength",
            value: pos > 0.7 ? "Closing Strong (High of Day)" : pos < 0.3 ? "Weak Close (Low of Day)" : "Neutral Consolidation",
            status: pos > 0.7 ? "positive" : pos < 0.3 ? "negative" : "neutral"
        });
    }
    
    // 4. Volume Check
    if (s.volume && s.average_volume && typeof s.average_volume === 'string') {
        // "187,031,112"
        const avgVol = parseFloat(s.average_volume.replace(/,/g, ''));
        const relVol = s.volume / avgVol;
         insights.push({
            label: "Relative Volume",
            value: `${relVol.toFixed(2)}x vs Avg`,
            status: relVol > 1.2 ? "positive" : "neutral"
        });
    }

    return insights;
}

function AnalyticsSection({ stock }: { stock: any }) {
    if (!stock) return null;

    const fundamentals = getFundamentalInsights(stock);
    const technicals = getTechnicalInsights(stock);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Title */}
            <div className="md:col-span-2 mb-2 flex items-center justify-between">
                 <h3 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
                    <Brain className="w-6 h-6 text-[var(--accent)]" /> 
                    MBA Analytics Findings
                 </h3>
                 <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded border border-[var(--border)]">
                    Projectable Insights
                 </span>
            </div>

            {/* Fundamental Column */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2 pb-2 border-b border-[var(--border)]">
                    <Scale className="w-4 h-4" />
                    <h4 className="font-semibold text-sm uppercase tracking-wide">Fundamental Health</h4>
                </div>
                <ul className="space-y-3">
                    {fundamentals.map((item, i) => (
                        <li key={i} className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-[var(--text-secondary)]">{item.label}</span>
                            <div className="flex items-center gap-2 justify-between">
                                <span className="text-sm font-semibold text-[var(--text)]">{item.value}</span>
                                <span className={cn(
                                    "w-2 h-2 rounded-full shrink-0",
                                    item.status === "positive" ? "bg-[var(--profit)]" : item.status === "negative" ? "bg-[var(--loss)]" : "bg-gray-400"
                                )} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Technical Column */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-2 pb-2 border-b border-[var(--border)]">
                    <Activity className="w-4 h-4" />
                    <h4 className="font-semibold text-sm uppercase tracking-wide">Technical Patterns</h4>
                </div>
                <ul className="space-y-3">
                    {technicals.map((item, i) => (
                        <li key={i} className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-[var(--text-secondary)]">{item.label}</span>
                             <div className="flex items-center gap-2 justify-between">
                                <span className="text-sm font-semibold text-[var(--text)]">{item.value}</span>
                                <span className={cn(
                                    "w-2 h-2 rounded-full shrink-0",
                                    item.status === "positive" ? "bg-[var(--profit)]" : item.status === "negative" ? "bg-[var(--loss)]" : "bg-gray-400"
                                )} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
