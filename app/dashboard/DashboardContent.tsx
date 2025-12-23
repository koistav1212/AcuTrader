"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import {
  Briefcase,
  DollarSign,
  LineChart as ChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KPICard } from "../components/shared/KpiCard";
import MarketOverview from "../components/dashboard/MarketOverview";
import {
  portfolioValueData,
  STARTING_BALANCE,
} from "../lib/data/sim-data";
import { useUser } from "../context/UserContext";
import { cn } from "../lib/utils";

const COLORS = ["#00C805", "#FF5000", "#3B82F6", "#A855F7", "#F59E0B", "#64748B"];

export default function DashboardSection() {
  const { holdings } = useUser();
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchQuotes() {
      if (holdings.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const promises = holdings.map(h => 
           fetch(`${baseUrl}/market/quote/${h.symbol}`).then(r => r.json()).catch(() => ({}))
        );
        
        const results = await Promise.all(promises);
        const newQuotes: Record<string, any> = {};
        
        results.forEach((q, i) => {
           if (q && (q.symbol || holdings[i].symbol)) {
              newQuotes[q.symbol || holdings[i].symbol] = q;
           }
        });

        if (mounted) {
          setQuotes(newQuotes);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard quotes", e);
        if (mounted) setLoading(false);
      }
    }

    fetchQuotes();

    return () => { mounted = false; };
  }, [holdings]);


  // --- CALCULATIONS ---

  let totalPortfolioValue = 0;
  let totalDailyPL = 0;
  let allocationData: { name: string; value: number }[] = [];
  let movers: { symbol: string; change: number; price: number }[] = [];

  holdings.forEach(h => {
     const quote = quotes[h.symbol] || {};
     const price = quote.regularMarketPrice || quote.current_price || h.avgCost || 0;
    //  Prioritize percent_change
     const changePercent = quote.percent_change || quote.regularMarketChangePercent || 0;
     const changeAmount = (price * changePercent) / 100; // approx daily change per share
     
     const value = h.quantity * price;
     const pl = h.quantity * changeAmount;

     totalPortfolioValue += value;
     totalDailyPL += pl;

     allocationData.push({ name: h.symbol, value });
     movers.push({ symbol: h.symbol, change: changePercent, price });
  });

  // Asset Allocation: Top 5 + Others
  allocationData.sort((a, b) => b.value - a.value);
  const topAllocation = allocationData.slice(0, 5);
  const otherValue = allocationData.slice(5).reduce((sum, item) => sum + item.value, 0);
  if (otherValue > 0) {
    topAllocation.push({ name: "Others", value: otherValue });
  }

  // Movers: Top Gainers & Losers
  movers.sort((a, b) => b.change - a.change);
  const topGainers = movers.filter(m => m.change > 0).slice(0, 3);
  const topLosers = [...movers].filter(m => m.change < 0).reverse().slice(0, 3);

  // Totals
  const totalInvested = holdings.reduce((acc, h) => acc + (h.quantity * h.avgCost), 0);
  const availableCash = STARTING_BALANCE - totalInvested; // Simplified cash logic from sim-data
  const totalAccountValue = totalPortfolioValue + availableCash;

  const dailyPLPercent = totalPortfolioValue > 0 ? (totalDailyPL / totalPortfolioValue) * 100 : 0;
  const isPositiveDay = totalDailyPL >= 0;

  return (
    <section className="space-y-6">

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Total Account Value"
          subtitle="Cash + Holdings"
          value={`$${totalAccountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Briefcase}
          accent="from-[var(--accent)] to-[var(--accent-hover)]"
          change={holdings.length > 0 ? "Real-time" : "No holdings"}
        />

        <KPICard
          title="Available Cash"
          subtitle="Ready for trading"
          value={`$${availableCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          accent="from-[var(--accent)] to-[var(--accent-hover)]"
        />

        <KPICard
          title="Daily P&L"
          subtitle="Today's performance"
          value={`${isPositiveDay ? "+" : ""}$${totalDailyPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={isPositiveDay ? TrendingUp : TrendingDown}
          change={`${isPositiveDay ? "+" : ""}${dailyPLPercent.toFixed(2)}%`}
          isPositive={isPositiveDay}
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">

        {/* PORTFOLIO TREND (Mock Data for History) */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl transition-colors">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Portfolio Trend
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Last 6 Trading Days (Simulated)
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioValueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--chart-grid)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    `$${(value / 1000).toFixed(1)}k`
                  }
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--text)' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--accent)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--accent)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTOR / ASSET ALLOCATION */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl transition-colors flex flex-col">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Asset Allocation
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Distribution by Value
            </p>
          </div>

          <div className="flex-1 min-h-[250px] flex items-center justify-center relative">
             {topAllocation.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={topAllocation}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {topAllocation.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--card)" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value: number) => `$${value.toFixed(2)}`}
                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--text)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="text-center text-[var(--text-secondary)] text-sm">
                    No holdings to display.
                </div>
             )}
             
             {/* Legend Overlay / Center Text */}
             {topAllocation.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-xs text-[var(--text-secondary)] font-medium">Top</p>
                        <p className="text-xl font-bold text-[var(--text)]">{topAllocation[0].name}</p>
                    </div>
                </div>
             )}
          </div>
        </div>

      </div>

      {/* MARKET OVERVIEW - TOP GAINERS & LOSERS */}
      <MarketOverview />

      {/* TACTICAL MOVERS */}
      <div className="grid gap-6 md:grid-cols-2">
         {/* Top Gainers */}
         <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-[var(--profit)]/10 text-[var(--profit)]">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[var(--text)]">Top Gainers</h3>
             </div>
             {topGainers.length > 0 ? (
                 <div className="space-y-3">
                    {topGainers.map(g => (
                        <div key={g.symbol} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] hover:bg-[var(--bg-secondary)] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 rounded-full bg-[var(--profit)]"></div>
                                <div>
                                    <p className="font-bold text-sm text-[var(--text)]">{g.symbol}</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-mono">${g.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <span className="text-[var(--profit)] font-bold text-sm flex items-center gap-1">
                                <ArrowUpRight className="w-4 h-4" />
                                {g.change}%
                            </span>
                        </div>
                    ))}
                 </div>
             ) : (
                 <p className="text-sm text-[var(--text-secondary)] py-4 text-center">No gainers today.</p>
             )}
         </div>

         {/* Top Losers */}
         <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-[var(--loss)]/10 text-[var(--loss)]">
                    <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[var(--text)]">Top Losers</h3>
             </div>
             {topLosers.length > 0 ? (
                 <div className="space-y-3">
                    {topLosers.map(l => (
                        <div key={l.symbol} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] hover:bg-[var(--bg-secondary)] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 rounded-full bg-[var(--loss)]"></div>
                                <div>
                                    <p className="font-bold text-sm text-[var(--text)]">{l.symbol}</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-mono">${l.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <span className="text-[var(--loss)] font-bold text-sm flex items-center gap-1">
                                <ArrowDownRight className="w-4 h-4" />
                                {Math.abs(l.change).toFixed(2)}%
                            </span>
                        </div>
                    ))}
                 </div>
             ) : (
                 <p className="text-sm text-[var(--text-secondary)] py-4 text-center">No losers today.</p>
             )}
         </div>
      </div>

    </section>
  );
}
