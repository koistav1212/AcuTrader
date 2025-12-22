"use client";

import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import StockOrderForm from "./_components/StockOrderForm";
import { Brain, Activity, TrendingUp, Zap, Scale, BarChart3, AlertCircle } from "lucide-react";
import StockChart from "../../../components/charts/StockChart";

export default function StockDetail() {
  const params = useParams();
  const symbol = params.symbol as string;

  const [quote, setQuote] = useState<any>(null);
  const [priceChanges, setPriceChanges] = useState<any>(null);
// const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    async function fetchData() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // Check session storage for quote data
        let cachedQuote = null;
        if (typeof window !== 'undefined') {
            try {
                const stored = sessionStorage.getItem(`stock_data_${symbol}`);
                if (stored) {
                    cachedQuote = JSON.parse(stored);
                    setQuote(cachedQuote);
                    setLoading(false);
                }
            } catch (err) {
                console.warn("Error parsing stored stock data", err);
            }
        }

        const promises = [];

        // Fetch quote only if not cached
        if (!cachedQuote) {
             promises.push(
                fetch(`${baseUrl}/market/quote/${symbol}`)
                  .then(res => res.json())
                  .then(data => setQuote(data))
             );
        }

        // Always fetch price changes and recommendations
        promises.push(
            fetch(`${baseUrl}/market/price-change/${symbol}`)
              .then(res => res.json())
              .then(data => setPriceChanges(data))
        );

        promises.push(
            fetch(`${baseUrl}/market/recommendations/${symbol}`)
              .then(res => res.json())
              // .then(data => setRecommendations(data)) 
        );

        await Promise.all(promises);

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

  if (!quote) {
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

// Helper to format large numbers
  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return "-";
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toLocaleString();
  };

  const quoteData = quote || {}; 
  const symbolStr = quoteData.symbol || symbol;
  const name = quoteData.displayName || quoteData.shortName || quoteData.longName || quoteData.name || symbol;
  const price = quoteData.regularMarketPrice || quoteData.current_price || 0;
  const change = quoteData.regularMarketChange || quoteData.change || 0;
  const percentChange = quoteData.regularMarketChangePercent || quoteData.percent_change || 0;
  const isUp = change >= 0;
  const currency = quoteData.currency || "USD";
  const exchange = quoteData.fullExchangeName || quoteData.exchange || "";
  const marketState = quoteData.marketState || "CLOSED";
  
  // Try to get logo from the enriched object or fallback
  const logoUrl = quoteData.logo || quoteData.image || `https://financialmodelingprep.com/image-stock/${symbol}.png`;

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
                alt={symbolStr} 
                width={64}
                height={64}
                className="w-full h-full object-contain"
                unoptimized
                onError={(e) => {
                    // Fallback if needed, though we usually have a URL
                    (e.target as HTMLImageElement).style.visibility = 'hidden'; 
                }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2 flex-wrap">
              {name}
              <span className="text-sm px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-normal border border-[var(--border)]">
                {symbolStr}
              </span>
            </h1>
            <div className="text-sm text-[var(--text-secondary)] mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span>{exchange}</span>
              <span>•</span>
              <span>{currency}</span>
              <span>•</span>
              <span className={marketState === "REGULAR" || marketState === "OPEN" ? "text-green-500" : "text-amber-500"}>
                 Market: {marketState}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right w-full md:w-auto">
          <div className="text-4xl font-bold text-[var(--text)] tracking-tight">
            ${price.toFixed(2)}
          </div>
          <div className={cn("text-lg font-semibold flex items-center md:justify-end gap-2", isUp ? "text-[var(--profit)]" : "text-[var(--loss)]")}>
            <span>{isUp ? "▲" : "▼"}</span>
            <span>{Math.abs(change).toFixed(2)}</span>
            <span>({Math.abs(percentChange).toFixed(2)}%)</span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            {quoteData.regularMarketTime ? `Last update: ${new Date(quoteData.regularMarketTime).toLocaleString()}` : ""}
          </div>
          {quoteData.postMarketPrice && quoteData.marketState === "CLOSED" && (
             <div className="text-xs text-[var(--text-secondary)] mt-1">
                Post-Market: ${quoteData.postMarketPrice.toFixed(2)} ({quoteData.postMarketChangePercent?.toFixed(2)}%)
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📉 LEFT COLUMN: STATS GRIDS */}
        <div className="lg:col-span-2 space-y-6">

          {/* 🕯️ CANDLESTICK CHART */}
          <StockChart symbol={symbolStr} />

          {/* 📊 ANALYTICS SECTION (New MBA Feature) */}
          <AnalyticsSection quote={quoteData} />
          
          {/* TRADING INFO CARD */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2">Trading Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
               <StatItem label="Open" value={`$${quoteData.regularMarketOpen?.toFixed(2) || "-"}`} />
               <StatItem label="High" value={`$${quoteData.regularMarketDayHigh?.toFixed(2) || "-"}`} />
               <StatItem label="Low" value={`$${quoteData.regularMarketDayLow?.toFixed(2) || "-"}`} />
               <StatItem label="Previous Close" value={`$${quoteData.regularMarketPreviousClose?.toFixed(2) || "-"}`} />
               <StatItem label="Volume" value={formatNumber(quoteData.regularMarketVolume)} />
               <StatItem label="Avg Vol (3M)" value={formatNumber(quoteData.averageDailyVolume3Month)} />
               <StatItem label="Bid" value={`${quoteData.bid?.toFixed(2) || "-"} x ${quoteData.bidSize || 0}`} />
               <StatItem label="Ask" value={`${quoteData.ask?.toFixed(2) || "-"} x ${quoteData.askSize || 0}`} />
               <StatItem label="Beta (5Y)" value={quoteData.beta?.toFixed(2) || "-"} />
            </div>
          </div>

          {/* VALUATION & FINANCIALS CARD */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2">Valuation & Financials</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
               <StatItem label="Market Cap" value={`$${formatNumber(quoteData.marketCap)}`} />
               <StatItem label="PE Ratio (TTM)" value={quoteData.trailingPE?.toFixed(2) || "-"} />
               <StatItem label="Forward PE" value={quoteData.forwardPE?.toFixed(2) || "-"} />
               <StatItem label="EPS (TTM)" value={`$${quoteData.epsTrailingTwelveMonths?.toFixed(2) || "-"}`} />
               <StatItem label="EPS Forward" value={`$${quoteData.epsForward?.toFixed(2) || "-"}`} />
               <StatItem label="Price/Book" value={quoteData.priceToBook?.toFixed(2) || "-"} />
               <StatItem label="Book Value" value={`$${quoteData.bookValue?.toFixed(2) || "-"}`} />
               <StatItem label="Dividend Rate" value={`$${quoteData.trailingAnnualDividendRate?.toFixed(2) || "0.00"}`} />
               <StatItem label="Dividend Yield" value={`${(quoteData.trailingAnnualDividendYield * 100)?.toFixed(2) || "0.00"}%`} />
            </div>
          </div>

           {/* RANGES & AVERAGES CARD */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4 border-b border-[var(--border)] pb-2">Ranges & Averages</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
               <StatItem label="52 Week Range" value={`${quoteData.fiftyTwoWeekRange?.low?.toFixed(2) || "-"} - ${quoteData.fiftyTwoWeekRange?.high?.toFixed(2) || "-"}`} />
               <StatItem label="52 Week Change" value={`${quoteData.fiftyTwoWeekChangePercent?.toFixed(2) || "-"}%`} />
               <StatItem label="50 Day Avg" value={`$${quoteData.fiftyDayAverage?.toFixed(2) || "-"}`} />
               <StatItem label="200 Day Avg" value={`$${quoteData.twoHundredDayAverage?.toFixed(2) || "-"}`} />
               <StatItem label="Analyst Rating" value={quoteData.averageAnalystRating || "-"} />
             </div>
          </div>
          
           {/* ABOUT / DESCRIPTION (Fallback if exists) */}
           {quoteData.description && (
             <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">About {name}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {quoteData.description}
                </p>
             </div>
           )}

        </div>

        {/* 📈 RIGHT COLUMN: BUY/SELL FORM */}
        <div className="space-y-6">
          <StockOrderForm 
            symbol={symbolStr} 
            currentPrice={price} 
            logo={logoUrl} 
            name={name} 
            marketState={marketState}
          />
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component Helpers
// -------------------------------------------------------------

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xs text-[var(--text-secondary)] mb-1">{label}</div>
      <div className="text-sm font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}

// --- ANALYTICS ENGINE (User Requested MBA Projectable) ---

function getFundamentalInsights(q: any) {
  const insights = [];

  // 1. Valuation Check (PE)
  if (q.forwardPE && q.trailingPE) {
     const isUndervalued = q.forwardPE < q.trailingPE;
     insights.push({
        label: "Valuation Outlook",
        value: isUndervalued ? `Improving (Fwd PE ${q.forwardPE.toFixed(1)} < TTM)` : `Premium (Fwd PE ${q.forwardPE.toFixed(1)} > TTM)`,
        status: isUndervalued ? "positive" : "neutral"
     });
  } else {
     insights.push({ label: "Valuation", value: "Standard metrics unavailable", status: "neutral" });
  }

  // 2. Efficiency (Price to Book)
  if (q.priceToBook) {
      const pb = q.priceToBook;
      let status = "neutral";
      let desc = "Fair Value";
      if (pb < 1) { status = "positive"; desc = "Potentially Undervalued (<1.0)"; }
      else if (pb > 5) { status = "negative"; desc = "High Premium (>5.0)"; }
      insights.push({ label: "Asset Efficiency", value: `${desc} (P/B ${pb.toFixed(2)})`, status });
  }

  // 3. Growth (EPS)
  if (q.epsForward && q.epsTrailingTwelveMonths) {
      const growth = q.epsForward > q.epsTrailingTwelveMonths;
      insights.push({
          label: "EPS Trajectory",
          value: growth ? `Growth Forecasted ($${q.epsTrailingTwelveMonths} → $${q.epsForward})` : "Contraction Forecasted",
          status: growth ? "positive" : "negative"
      });
  }

  // 4. Market Health (Cap)
  const cap = q.marketCap || 0;
  let capDesc = "Small Cap";
  if (cap > 200e9) capDesc = "Mega Cap (Stable)";
  else if (cap > 10e9) capDesc = "Large Cap (Established)";
  else if (cap > 2e9) capDesc = "Mid Cap (Growth)";
  insights.push({ label: "Market Classification", value: capDesc, status: "neutral" });

  // 5. Analyst Sentiment
  const rating = q.averageAnalystRating || "N/A";
  const isBuy = rating.toLowerCase().includes("buy") || rating.toLowerCase().includes("strong");
  insights.push({ 
      label: "Street Sentiment", 
      value: rating, 
      status: isBuy ? "positive" : "neutral" 
  });

  return insights;
}

function getTechnicalInsights(q: any) {
    const insights = [];

    // 1. Trend Strength (Golden/Death Cross proxy)
    if (q.fiftyDayAverage && q.twoHundredDayAverage) {
        const title = q.fiftyDayAverage > q.twoHundredDayAverage ? "Bullish Trend" : "Bearish Trend";
        const status = q.fiftyDayAverage > q.twoHundredDayAverage ? "positive" : "negative";
        insights.push({
            label: "Long-Term Trend",
            value: `${title} (50D > 200D is ${status === 'positive' ? 'True' : 'False'})`,
            status
        });
    }

    // 2. Momentum (52 Week High proximity)
    if (q.fiftyTwoWeekHigh && q.regularMarketPrice) {
        const diff = (q.fiftyTwoWeekHigh - q.regularMarketPrice) / q.fiftyTwoWeekHigh;
        const nearHigh = diff < 0.05; // within 5%
        insights.push({
            label: "Momentum",
            value: nearHigh ? "Strong (Trading near 52W High)" : `Retracing (${(diff * 100).toFixed(1)}% off High)`,
            status: nearHigh ? "positive" : "neutral"
        });
    }

    // 3. Volatility (High/Low Range)
    if (q.regularMarketDayRange && q.regularMarketPrice) {
       const range = q.regularMarketDayRange;
       const spread = ((range.high - range.low) / q.regularMarketPrice) * 100;
       const isVolatile = spread > 3; // >3% intraday move
       insights.push({
           label: "Intraday Volatility",
           value: isVolatile ? `High (${spread.toFixed(2)}% Swing)` : `Stable (${spread.toFixed(2)}% Swing)`,
           status: isVolatile ? "negative" : "neutral" // Volatility usually risk
       });
    }

    // 4. Alpha / Performance
    const ytd = q.fiftyTwoWeekChangePercent || 0;
    insights.push({
        label: "Annual Alpha",
        value: `${ytd > 0 ? "+" : ""}${ytd.toFixed(2)}% (1 Year Return)`,
        status: ytd > 10 ? "positive" : ytd < -10 ? "negative" : "neutral"
    });

    // 5. Volume Liquidity
    const vol = q.regularMarketVolume || 0;
    const avgVol = q.averageDailyVolume10Day || vol;
    const relVol = vol / avgVol;
    insights.push({
        label: "Relative Volume",
        value: `${relVol.toFixed(2)}x (vs 10-Day Avg)`,
        status: relVol > 1.5 ? "positive" : "neutral"
    });

    return insights;
}

function AnalyticsSection({ quote }: { quote: any }) {
    if (!quote) return null;

    const fundamentals = getFundamentalInsights(quote);
    const technicals = getTechnicalInsights(quote);

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
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    item.status === "positive" ? "bg-[var(--profit)]" : item.status === "negative" ? "bg-[var(--loss)]" : "bg-gray-400"
                                )} />
                                <span className="text-sm font-semibold text-[var(--text)]">{item.value}</span>
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
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    item.status === "positive" ? "bg-[var(--profit)]" : item.status === "negative" ? "bg-[var(--loss)]" : "bg-gray-400"
                                )} />
                                <span className="text-sm font-semibold text-[var(--text)]">{item.value}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
