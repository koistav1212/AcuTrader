"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Loader2, Plus, ArrowUpRight, ArrowDownRight, FileText, Download, Activity, Globe, ChevronDown, ChevronUp, Brain, Cpu, Database } from "lucide-react";
import { useMarketSearch } from "@/app/hooks/useMarketSearch";
import { useMarketQuote } from "@/app/hooks/useMarketQuote";
import { useHistoricalData } from "@/app/hooks/useHistoricalData";
import { useResearchIntelligence } from "@/app/hooks/useResearchIntelligence";
import dynamic from "next/dynamic";

const PriceChart = dynamic(() => import("@/components/charts/PriceChart"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-[var(--border)] opacity-20 rounded-md" />
  ),
});

export default function StockDetail() {
  const params = useParams();
  const symbol = params.symbol as string;

  const [timeframe, setTimeframe] = useState("1M");
  const timeframes = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y", "10Y"];

  const { data: searchResults, isLoading: isSearchLoading } = useMarketSearch(symbol);
  const { data: quoteData, isLoading: isQuoteLoading } = useMarketQuote(symbol);
  const { data: historicalData, isLoading: isHistoryLoading } = useHistoricalData(symbol, timeframe, "1d");
  const { data: researchData, isLoading: isResearchLoading } = useResearchIntelligence(symbol);

  const chartData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];
    return historicalData.map((d: any) => ({
      time: d.date,
      value: d.close || d.price || d.value,
    }));
  }, [historicalData]);

  const chartColor = useMemo(() => {
    if (chartData.length < 2) return "#64748b";
    const firstPrice = chartData[0].value;
    const lastPrice = chartData[chartData.length - 1].value;
    return lastPrice > firstPrice ? "#22c55e" : lastPrice < firstPrice ? "#ef4444" : "#64748b";
  }, [chartData]);

  const loading = isSearchLoading || isQuoteLoading;

  let stockData = null;
  if (searchResults && Array.isArray(searchResults)) {
    stockData = searchResults.find((item: any) => item.symbol === symbol || item.symbol === symbol.toUpperCase());
    if (!stockData && searchResults.length > 0) stockData = searchResults[0];
  } else if (searchResults && (searchResults as any).Stocks && Array.isArray((searchResults as any).Stocks)) {
    const stocks = (searchResults as any).Stocks;
    stockData = stocks.find((item: any) => item.symbol === symbol || item.symbol === symbol.toUpperCase());
    if (!stockData && stocks.length > 0) stockData = stocks[0];
  }

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

  const s = { ...stockData, ...quoteData };
  const rawPrice = s.last_price ?? s.current_price ?? s.price ?? s.previous_close ?? 0;
  const currentPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/,/g, '')) : rawPrice;
  const change = typeof s.change === 'string' ? parseFloat(s.change.replace(/,/g, '')) : (s.change || 0);
  const percentChange = typeof s.percent_change === 'string' ? parseFloat(s.percent_change.replace(/,/g, '')) : typeof s.changePercent === 'number' ? s.changePercent : (s.percent_change || s.changesPercentage || 0);
  const isUp = change >= 0;
  
  const logoUrl = s.logo || s.image || `https://financialmodelingprep.com/image-stock/${s.symbol || symbol}.png`;

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
        <FactItem label="Market Cap" value={s.marketCap || "-"} />
        <FactItem label="P/E Ratio" value={s.peRatio || "-"} />
        <FactItem label="EPS" value={s.eps ? `$${s.eps}` : "-"} />
        <FactItem label="Div Yield" value={s.dividendYield || "-"} />
        <FactItem label="Volume" value={s.volume || "-"} />
        <FactItem label="Sector" value={s.sector || "-"} truncate />
        <FactItem label="Industry" value={s.industry || "-"} truncate />
      </div>

      {/* MAIN CHART */}
      <div className="w-full flex flex-col border border-[var(--border)] bg-[var(--surface-solid)] rounded-md shadow-sm overflow-hidden p-4">
        <div className="flex justify-end mb-4">
          <div className="flex gap-1 bg-[var(--surface-muted)] p-1 rounded-md overflow-x-auto hide-scroll">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-[12px] font-mono font-bold transition-all shrink-0 ${
                  timeframe === tf
                    ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full h-[450px] relative">
          {isHistoryLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-solid)]/50 z-10">
              <div className="animate-pulse flex items-center text-[var(--text-secondary)]">Loading chart...</div>
            </div>
          )}
          <PriceChart data={chartData} color={chartColor} />
        </div>
      </div>

      {/* FINANCIAL METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Trading Information */}
        <MetricPanel title="Trading Information">
           <MetricRow label="Open" value={s.open} prefix="$" />
           <MetricRow label="Previous Close" value={s.previousClose} prefix="$" />
           <MetricRow label="Day Range" value={s.dayRange || '-'} />
           <MetricRow label="52 Week Range" value={s['52WeekRange'] || '-'} />
           <MetricRow label="Avg Volume" value={s.avgVolume} />
        
        </MetricPanel>

        {/* Valuation */}
        <MetricPanel title="Valuation">
           <MetricRow label="Enterprise Value" value={s.enterpriseValue} />
           <MetricRow label="Forward P/E" value={s.forwardPE} />
           <MetricRow label="Trailing P/E" value={s.trailingPE} />
           <MetricRow label="PEG Ratio" value={s.pegRatio} />
           <MetricRow label="Price to Sales" value={s.priceToSales} />
           <MetricRow label="Price to Book" value={s.priceToBook} />
           <MetricRow label="EV to EBITDA" value={s.evToEBITDA} />
        </MetricPanel>

        {/* Financial Strength */}
        <MetricPanel title="Financial Strength">
           <MetricRow label="Revenue" value={s.revenue} />
           <MetricRow label="Net Income" value={s.netIncome} />
           <MetricRow label="Profit Margin" value={s.profitMargin} />
           <MetricRow label="Return on Equity" value={s.returnOnEquity} />
           <MetricRow label="Analyst Rating" value={s.analystRating} />
           <MetricRow label="Target Price" value={s.targetPrice} prefix="$" />
           <MetricRow label="Earnings Date" value={s.earningsDate} />
        </MetricPanel>
      </div>

      {/* RESEARCH INTELLIGENCE */}
      <ResearchIntelligenceSection 
        symbol={s.symbol || symbol} 
        companyName={s.name || s.instrument_name} 
        currentPrice={currentPrice} 
        data={researchData} 
        isLoading={isResearchLoading} 
      />

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

function ResearchIntelligenceSection({ symbol, companyName, currentPrice, data, isLoading }: any) {
  const [showJson, setShowJson] = React.useState(false);

  useEffect(() => {
    if (data) {
      console.log("[Research] API response", data);
      console.log("[Research] Forecast", data.forecast);
      console.log("[Research] Pipeline status", data.pipelineStatus);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="mt-12 p-12 border border-[var(--border)] bg-[var(--surface-solid)] rounded-md flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--info)] mb-4" />
        <span className="font-mono text-[12px] text-[var(--text-secondary)]">INITIALIZING RESEARCH PIPELINE...</span>
      </div>
    );
  }

  if (!data) return null;

  const { success, status, pipelineStatus, market, news, technicals, forecast } = data;
  
  // Pipeline active stages
  const hasMarket = pipelineStatus?.market?.status === 'ready';
  const hasHistory = pipelineStatus?.ohlcv?.status === 'ready';
  const hasTechnicals = pipelineStatus?.technicals?.status === 'ready';
  const hasNews = pipelineStatus?.news?.status === 'ready' || pipelineStatus?.news?.status === 'partial';
  const hasSentiment = pipelineStatus?.sentiment?.status === 'ready';
  const hasForecast = forecast && forecast.daily && forecast.daily.length > 0;

  const renderPipeline = () => (
    <div className="mb-8 mt-4">
      <h3 className="font-mono text-[11px] font-bold text-[var(--text-secondary)] mb-4 uppercase tracking-widest text-center">Inference Pipeline</h3>
      <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto hide-scroll pb-2">
        <PipelineNode label="MARKET DATA" active={hasMarket} />
        <PipelineArrow />
        <PipelineNode label="HISTORICAL OHLCV" active={hasHistory} />
        <PipelineArrow />
        <PipelineNode label="TECHNICALS" active={hasTechnicals} />
        <PipelineArrow />
        <PipelineNode label="30D NEWS" active={hasNews} />
        <PipelineArrow />
        <PipelineNode label="SENTIMENT/INTENT" active={hasSentiment} />
        <PipelineArrow />
        <PipelineNode label="FORECAST" active={!!hasForecast} />
      </div>
    </div>
  );

  if (success === false && status === "insufficient_input_data") {
    return (
      <div className="mt-12 space-y-6">
        <div className="bg-[var(--surface-solid)] border border-[var(--border)] rounded-md p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[var(--border)] pb-4 mb-4">
            <div>
              <h2 className="font-sans text-xl font-bold text-[var(--text-primary)] flex items-center gap-2 tracking-tight uppercase">
                <Brain className="w-5 h-5 text-[var(--warning)]" />
                RESEARCH INTELLIGENCE (UNAVAILABLE)
              </h2>
            </div>
          </div>
          {renderPipeline()}
          <div className="p-6 bg-[var(--surface-muted)] border border-[var(--border)] rounded-md flex flex-col items-center justify-center text-center">
             <span className="text-[var(--warning)] font-bold text-lg mb-2">Forecast unavailable — insufficient model input data</span>
             <p className="text-[var(--text-secondary)] text-sm">The machine learning pipeline requires all upstream data stages to be successfully populated before generating a forecast. Please check the pipeline status above for missing components.</p>
          </div>
          {/* JSON Output */}
          <div className="mt-6 border border-[var(--border)] rounded-md overflow-hidden">
            <button 
              onClick={() => setShowJson(!showJson)}
              className="w-full flex items-center justify-between p-3 bg-[var(--surface-muted)] hover:bg-[var(--surface)] transition text-[12px] font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider"
            >
              <span className="flex items-center gap-2"><Cpu className="w-4 h-4"/> View Model Output</span>
              {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showJson && (
              <div className="p-4 bg-[var(--bg-primary)] border-t border-[var(--border)] overflow-x-auto max-h-[400px]">
                <pre className="font-mono text-[11px] text-[var(--text-secondary)]">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Safe extraction
  const daily = forecast?.daily || [];
  
  // Interpretation
  let interpretation = "Insufficient data for interpretation.";
  if (hasForecast && daily.length > 0) {
     const day1 = daily[0];
     const highestProbObj = [
       { label: "bull", prob: day1.bull?.probability || 0 },
       { label: "neutral", prob: day1.neutral?.probability || 0 },
       { label: "bear", prob: day1.bear?.probability || 0 }
     ].reduce((prev, current) => (prev.prob > current.prob) ? prev : current, { label: "", prob: 0 });
     
     const expectedMove = currentPrice && day1.expectedTarget ? (((day1.expectedTarget - currentPrice) / currentPrice) * 100) : 0;
     const dir = expectedMove > 0 ? "above" : "below";
     
     interpretation = `For the D+1 horizon, the model currently assigns the highest probability (${Math.round(highestProbObj.prob * 100)}%) to the ${highestProbObj.label.charAt(0).toUpperCase() + highestProbObj.label.slice(1)} scenario. The expected target of $${day1.expectedTarget?.toFixed(2)} is ${dir} the current market price (implied move of ${expectedMove.toFixed(2)}%). The confidence level of ${day1.confidence ? (day1.confidence * 100).toFixed(0) : "unknown"}% indicates the strength of the model signal given current market conditions.`;
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="bg-[var(--surface-solid)] border border-[var(--border)] rounded-md p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[var(--border)] pb-4 mb-4">
           <div>
             <h2 className="font-sans text-xl font-bold text-[var(--text-primary)] flex items-center gap-2 tracking-tight uppercase">
               <Brain className="w-5 h-5 text-[var(--info)]" />
               RESEARCH INTELLIGENCE
             </h2>
             <div className="font-mono text-[12px] text-[var(--text-secondary)] mt-1 tracking-wider uppercase">
               {symbol} · {companyName}
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[var(--border)] pb-6 mb-6">
          <div>
             <h3 className="font-mono text-[11px] font-bold text-[var(--text-secondary)] mb-3 uppercase tracking-widest">Market State</h3>
             <div className="grid grid-cols-2 gap-4">
               <FactItem label="Current Price" value={currentPrice ? `$${currentPrice.toFixed(2)}` : "-"} />
               <FactItem label="30D Return" value={technicals?.returns_30d ? `${(technicals.returns_30d * 100).toFixed(2)}%` : "-"} />
               <FactItem label="Volume" value={market?.volume || "-"} />
               <FactItem label="Volatility (30D)" value={technicals?.volatility ? `${(technicals.volatility * 100).toFixed(2)}%` : "-"} />
             </div>
          </div>
          
          <div>
             <h3 className="font-mono text-[11px] font-bold text-[var(--text-secondary)] mb-3 uppercase tracking-widest">Technical State</h3>
             <div className="grid grid-cols-2 gap-4">
               {technicals ? Object.entries(technicals).slice(0, 4).map(([k, v]: any) => {
                 if (k === 'overall_regime') return null;
                 return <FactItem key={k} label={k.replace(/_/g, ' ')} value={typeof v === "number" ? v.toFixed(2) : v} truncate />;
               }) : (
                 <span className="text-[13px] text-[var(--text-secondary)]">No technical data available</span>
               )}
             </div>
          </div>
        </div>

        {data.sentiment && (
        <div className="border border-[var(--border)] rounded-md bg-[var(--surface-muted)] p-5 mb-6">
           <h3 className="font-mono text-[11px] font-bold text-[var(--text-secondary)] mb-4 uppercase tracking-widest flex items-center gap-2">
             <Globe className="w-4 h-4" /> NEWS & NARRATIVE INTELLIGENCE
           </h3>
           <div className="grid grid-cols-4 gap-4 mb-4">
             <div>
               <span className="block font-mono text-[10px] text-[var(--text-secondary)] uppercase">Sentiment</span>
               <span className={cn("font-bold text-[16px]", data.sentiment.averageScore > 0 ? "text-[var(--positive)]" : data.sentiment.averageScore < 0 ? "text-[var(--negative)]" : "text-[var(--text-primary)]")}>
                 {data.sentiment.averageScore?.toFixed(2) || "0.0"}
               </span>
             </div>
             <div>
               <span className="block font-mono text-[10px] text-[var(--text-secondary)] uppercase">Articles (30D)</span>
               <span className="font-bold text-[16px] text-[var(--text-primary)] uppercase">{data.sentiment.articleCount || 0}</span>
             </div>
             <div>
               <span className="block font-mono text-[10px] text-[var(--text-secondary)] uppercase">Verdict</span>
               <span className="font-bold text-[16px] text-[var(--text-primary)] uppercase">{data.sentiment.overallVerdict || "-"}</span>
             </div>
             <div>
               <span className="block font-mono text-[10px] text-[var(--text-secondary)] uppercase">Avg Impact</span>
               <span className="font-bold text-[16px] text-[var(--text-primary)] uppercase">{data.sentiment.averageImpact?.toFixed(2) || "-"}</span>
             </div>
           </div>
        </div>
        )}

        {renderPipeline()}

        {hasForecast && (
        <div className="mb-6">
          <h3 className="font-mono text-[11px] font-bold text-[var(--text-secondary)] mb-4 uppercase tracking-widest">
            Probabilistic Price Scenarios (3-Day Horizon)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {daily.map((day: any) => {
              return (
                <div key={day.horizonDay} className="border border-[var(--border)] rounded-md p-5 bg-[var(--surface-solid)] flex flex-col">
                  <div className="flex justify-between items-center mb-4 border-b border-[var(--border)] pb-2">
                     <span className="font-mono text-[12px] font-bold text-[var(--text-primary)] uppercase">Day +{day.horizonDay}</span>
                     <span className="font-mono text-[10px] text-[var(--text-secondary)]">{day.date}</span>
                  </div>
                  
                  <div className="space-y-3 mb-4 flex-grow">
                    <ScenarioBar label="BULL" scenario={day.bull} currentPrice={currentPrice} color="bg-[var(--positive)]" textColor="text-[var(--positive)]" />
                    <ScenarioBar label="NEUTRAL" scenario={day.neutral} currentPrice={currentPrice} color="bg-[var(--info)]" textColor="text-[var(--info)]" />
                    <ScenarioBar label="BEAR" scenario={day.bear} currentPrice={currentPrice} color="bg-[var(--negative)]" textColor="text-[var(--negative)]" />
                  </div>
                  
                  <div className="border-t border-[var(--border)] border-dashed pt-3 mt-auto">
                     <div className="flex justify-between items-end mb-1">
                       <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase">Expected Target</span>
                       <span className="font-sans text-xl font-bold text-[var(--text-primary)]">${day.expectedTarget?.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-end">
                       <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase">Confidence</span>
                       <span className="font-mono text-[12px] font-bold text-[var(--info)]">{day.confidence ? `${(day.confidence * 100).toFixed(0)}%` : "-"}</span>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {hasForecast && (
        <div className="border border-[var(--border)] rounded-md bg-[var(--surface-muted)] p-5 mb-4">
           <h3 className="font-mono text-[11px] font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-widest">Research Interpretation</h3>
           <p className="font-sans text-[13px] text-[var(--text-primary)] leading-relaxed">
             {interpretation}
           </p>
        </div>
        )}

        <div className="mt-6 border border-[var(--border)] rounded-md overflow-hidden">
          <button 
            onClick={() => setShowJson(!showJson)}
            className="w-full flex items-center justify-between p-3 bg-[var(--surface-muted)] hover:bg-[var(--surface)] transition text-[12px] font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider"
          >
            <span className="flex items-center gap-2"><Cpu className="w-4 h-4"/> View Model Output</span>
            {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showJson && (
            <div className="p-4 bg-[var(--bg-primary)] border-t border-[var(--border)] overflow-x-auto max-h-[400px]">
              <pre className="font-mono text-[11px] text-[var(--text-secondary)]">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}


function PipelineNode({ label, active }: { label: string, active: boolean }) {
  return (
    <div className={cn("px-2 py-1.5 sm:px-3 rounded-md border font-mono text-[9px] sm:text-[10px] font-bold shrink-0 flex items-center justify-center text-center", active ? "bg-[var(--info)]/10 border-[var(--info)]/30 text-[var(--info)]" : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)]")}>
      {label}
    </div>
  )
}

function PipelineArrow() {
  return <div className="w-2 sm:w-4 h-[1px] bg-[var(--border)] shrink-0" />;
}

function ScenarioBar({ label, scenario, currentPrice, color, textColor }: { label: string, scenario: any, currentPrice: number, color: string, textColor: string }) {
  if (!scenario) return null;
  const prob = scenario.probability ? Math.round(scenario.probability * 100) : 0;
  const target = scenario.targetPrice;
  const move = currentPrice && target ? (((target - currentPrice) / currentPrice) * 100).toFixed(1) : null;
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between font-mono text-[12px]">
        <span className={cn("font-bold uppercase", textColor)}>{label}</span>
        <div className="flex gap-2 sm:gap-4">
          <span className="text-[var(--text-primary)] font-bold">{prob}%</span>
          <span className="text-[var(--text-secondary)] w-[50px] sm:w-[60px] text-right">{target ? `$${target.toFixed(2)}` : "-"}</span>
          <span className="text-[var(--text-secondary)] w-[40px] sm:w-[50px] text-right text-[10px] pt-[2px]">{move ? (parseFloat(move) > 0 ? `+${move}%` : `${move}%`) : ""}</span>
        </div>
      </div>
      <div className="w-full bg-[var(--surface)] rounded-full h-1.5 overflow-hidden">
        <div className={cn("h-full", color)} style={{ width: `${prob}%` }} />
      </div>
    </div>
  );
}

