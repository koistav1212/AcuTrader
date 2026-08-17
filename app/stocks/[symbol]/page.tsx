"use client";

import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Loader2, Plus, ArrowUpRight, ArrowDownRight, FileText, Download, Activity, Globe } from "lucide-react";
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
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://acutrader-backend.onrender.com/api";
        const res = await fetch(`${baseUrl}/market/search?q=${symbol}`);
        const data = await res.json();
        
        let stockItem = null;
        if (data.Stocks && Array.isArray(data.Stocks)) {
          stockItem = data.Stocks.find((item: any) => item.symbol === symbol || item.symbol === symbol.toUpperCase());
          if (!stockItem && data.Stocks.length > 0) stockItem = data.Stocks[0];
        } else if (Array.isArray(data)) {
          stockItem = data.find((item: any) => item.symbol === symbol || item.symbol === symbol.toUpperCase());
        }

        if (stockItem) {
          setStockData(stockItem);
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
        <Loader2 className="w-8 h-8 animate-spin text-[var(--info)]" />
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="font-sans text-xl font-bold text-[var(--text-primary)]">Asset not found</h2>
        <Link href="/stocks" className="px-4 py-2 bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-primary)] rounded-md hover:bg-[var(--surface)] transition text-[13px] font-bold">
          Return to Screener
        </Link>
      </div>
    );
  }

  const s = stockData;
  const rawPrice = s.last_price ?? s.current_price ?? s.price ?? s.previous_close ?? 0;
  const currentPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/,/g, '')) : rawPrice;
  const change = typeof s.change === 'string' ? parseFloat(s.change.replace(/,/g, '')) : (s.change || 0);
  const percentChange = typeof s.percent_change === 'string' ? parseFloat(s.percent_change.replace(/,/g, '')) : (s.percent_change || s.changesPercentage || 0);
  const isUp = change >= 0;
  
  const logoUrl = s.logo || s.image || `https://financialmodelingprep.com/image-stock/${s.symbol}.png`;

  return (
    <div className="space-y-6 pb-20 max-w-[1400px] mx-auto w-full">
      {/* BREADCRUMB */}
      <div className="pt-4">
        <Link href="/stocks" className="font-mono text-[11px] font-bold tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition uppercase flex items-center gap-2">
          ← Back to Market Screener
        </Link>
      </div>

      {/* HEADER STRIP */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center p-1 border border-[var(--border)] shrink-0 overflow-hidden">
            <Image 
                src={logoUrl} 
                alt={s.symbol} 
                width={40}
                height={40}
                className="w-full h-full object-contain"
                unoptimized
                onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
            />
          </div>
          <div>
            <h1 className="font-sans text-3xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
              {s.name || s.instrument_name}
              <span className="font-mono text-[13px] px-2 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)] uppercase tracking-wider">
                {s.symbol}
              </span>
            </h1>
            <div className="font-mono text-[12px] text-[var(--text-secondary)] mt-1 flex items-center gap-3 uppercase tracking-wider">
              <span>{s.exchange || "NYSE"}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              <span>{s.currency || "USD"}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              <span className="text-[var(--positive)] flex items-center gap-1"><span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--positive)] opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--positive)]"></span></span> MARKET OPEN</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="font-sans text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            {Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(currentPrice)}
          </div>
          <div className={cn("font-mono text-[15px] font-bold mt-1 flex items-center gap-1.5", isUp ? "text-[var(--positive)]" : "text-[var(--negative)]")}>
            {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(change).toFixed(2)}</span>
            <span>({Math.abs(percentChange).toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-solid)] hover:bg-[var(--surface-muted)] transition-colors font-sans text-[13px] font-semibold text-[var(--text-primary)]">
          <Plus className="w-4 h-4" /> Watchlist
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-solid)] hover:bg-[var(--surface-muted)] transition-colors font-sans text-[13px] font-semibold text-[var(--text-primary)]">
          <Activity className="w-4 h-4" /> Compare
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-solid)] hover:bg-[var(--surface-muted)] transition-colors font-sans text-[13px] font-semibold text-[var(--text-primary)]">
          <FileText className="w-4 h-4" /> Research
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-solid)] hover:bg-[var(--surface-muted)] transition-colors font-sans text-[13px] font-semibold text-[var(--text-primary)] ml-auto">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* KEY FACTS (Strip) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 py-4 border-y border-[var(--border)]">
        <FactItem label="Market Cap" value={s.market_cap || s.marketCap || "-"} />
        <FactItem label="P/E Ratio" value={s.pe_ratio || s.pe || "-"} />
        <FactItem label="EPS" value={s.eps ? `$${s.eps}` : "-"} />
        <FactItem label="Div Yield" value={s.forward_dividend_yield || "-"} />
        <FactItem label="Volume" value={s.volume || "-"} />
        <FactItem label="Sector" value={s.sector || "-"} truncate />
        <FactItem label="Industry" value={s.industry || "-"} truncate />
      </div>

      {/* MAIN CHART */}
      <div className="w-full h-[500px] border border-[var(--border)] bg-[var(--surface-solid)] rounded-md shadow-sm overflow-hidden">
         <StockChart symbol={s.symbol} />
      </div>

      {/* FINANCIAL METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Trading Information */}
        <MetricPanel title="Trading Information">
           <MetricRow label="Open" value={s.open} prefix="$" />
           <MetricRow label="Previous Close" value={s.previous_close} prefix="$" />
           <MetricRow label="Day Range" value={`${s.day_low || '-'} - ${s.day_high || '-'}`} />
           <MetricRow label="52 Week Range" value={`${s.fifty_two_week_low || '-'} - ${s.fifty_two_week_high || '-'}`} />
           <MetricRow label="Avg Volume" value={s.average_volume} />
           <MetricRow label="Bid" value={s.bid} />
           <MetricRow label="Ask" value={s.ask} />
        </MetricPanel>

        {/* Valuation */}
        <MetricPanel title="Valuation">
           <MetricRow label="Enterprise Value" value={s.enterprise_value} />
           <MetricRow label="Forward P/E" value={s.forward_pe} />
           <MetricRow label="Trailing P/E" value={s.trailing_pe} />
           <MetricRow label="PEG Ratio" value={s.peg_ratio} />
           <MetricRow label="Price to Sales" value={s.price_to_sales} />
           <MetricRow label="Price to Book" value={s.price_to_book} />
           <MetricRow label="EV to EBITDA" value={s.enterprise_value_to_ebitda} />
        </MetricPanel>

        {/* Financial Strength */}
        <MetricPanel title="Financial Strength">
           <MetricRow label="Revenue" value={s.revenue} />
           <MetricRow label="Net Income" value={s.net_income} />
           <MetricRow label="Profit Margin" value={s.profit_margin} />
           <MetricRow label="Return on Equity" value={s.return_on_equity} />
           <MetricRow label="Total Cash" value={s.total_cash} />
           <MetricRow label="Total Debt/Equity" value={s.total_debt_to_equity} />
           <MetricRow label="Analyst Rating" value={s.analyst_rating} />
        </MetricPanel>
      </div>

    </div>
  );
}

// Subcomponents
function FactItem({ label, value, truncate = false }: { label: string; value: any; truncate?: boolean }) {
  const displayVal = (value === undefined || value === null || value === "") ? "-" : value.toString();
  return (
    <div className="flex flex-col gap-1 border-r border-[var(--border)] last:border-0 pr-4">
      <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{label}</span>
      <span className={cn("font-sans text-[14px] font-semibold text-[var(--text-primary)]", truncate && "truncate")} title={displayVal}>
        {displayVal}
      </span>
    </div>
  );
}

function MetricPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface-solid)] rounded-md p-5 shadow-sm">
      <h3 className="font-sans text-[14px] font-bold text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2">{title}</h3>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}

function MetricRow({ label, value, prefix = "" }: { label: string; value: any; prefix?: string }) {
  let display = (value === undefined || value === null || value === "") ? "-" : `${prefix}${value}`;
  
  // Try to format large numbers compactly if numeric
  if (typeof value === 'number' && value > 1000000) {
      display = `${prefix}${new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(value)}`;
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-[var(--border)] border-dashed last:border-0 font-mono text-[12px]">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className="font-bold text-[var(--text-primary)]">{display}</span>
    </div>
  );
}
