"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowUpRight, ArrowDownRight, ArrowUpDown, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { cn } from "../lib/utils";
import { useUser } from "../context/UserContext";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

export default function MarketScreener() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://acutrader-backend.onrender.com/api";
  const { toggleWatchlist, watchlistSymbols, user } = useUser();
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggle = useCallback(async (e: React.MouseEvent, symbol: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    setToggling(symbol);
    try {
      await toggleWatchlist(symbol);
    } finally {
      setToggling(null);
    }
  }, [user, toggleWatchlist]);

  const deduplicate = (items: any[]) => {
    if (!Array.isArray(items)) return [];
    const seen = new Set();
    return items.filter((item) => {
      if (!item.symbol) return false;
      const key = item.symbol.toUpperCase();
      const duplicate = seen.has(key);
      seen.add(key);
      return !duplicate;
    });
  };

  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setErrorInfo(null);
    try {
      let endpoint = `${baseUrl}/market/trending`;
      if (query) {
        endpoint = `${baseUrl}/market/search?q=${query}`;
      }

      const res = await fetch(endpoint, { cache: "no-store" });

      if (!res.ok) {
        setErrorInfo(`HTTP Error: ${res.status}`);
        setData([]);
      } else {
        const json = await res.json();
        let rawData: any[] = [];

        if (Array.isArray(json)) {
          rawData = json;
        } else if (json.Stocks && Array.isArray(json.Stocks)) {
          rawData = json.Stocks;
        } else if (json.data && Array.isArray(json.data)) {
          rawData = json.data;
        } else if (json.data && json.data.data && Array.isArray(json.data.data)) {
          rawData = json.data.data;
        } else if (json.data && Array.isArray(json.data.quotes)) {
          rawData = json.data.quotes;
        } else {
          setErrorInfo(`Invalid JSON format: keys=${Object.keys(json).join(",")}`);
        }

        const deduped = deduplicate(rawData);
        setData(deduped);
      }
    } catch (err: any) {
      console.error("Fetch failed", err);
      setErrorInfo(`Fetch exception: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [query, baseUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStocks();
    }, query ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchStocks, query]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data;
  }, [data]);

  // Table Setup
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => {
          const item = row.original;
          const symbol = item.symbol;
          const imageUrl = item.image || `https://financialmodelingprep.com/image-stock/${symbol}.png`;

          return (
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-[var(--border)] shrink-0">
                <Image
                  src={imageUrl}
                  alt={symbol}
                  fill
                  className="object-contain p-0.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
              </div>
              <span className="font-bold font-sans text-[14px] text-[var(--text-primary)] group-hover:text-[var(--info)] transition-colors">
                {symbol}
              </span>
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.name || row.instrument_name || "",
        id: "name",
        header: "Company",
        cell: ({ getValue }) => (
          <span className="font-sans text-[13px] text-[var(--text-secondary)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] inline-block">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.current_price || row.price || 0,
        id: "price",
        header: () => <div className="text-right flex justify-end items-center gap-1">Price <ArrowUpDown className="w-3 h-3"/></div>,
        cell: ({ getValue }) => (
          <div className="text-right font-mono text-[13px] font-medium text-[var(--text-primary)]">
            {Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(getValue() as number)}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.percent_change || row.changesPercentage || row.change || 0,
        id: "change",
        header: () => <div className="text-right flex justify-end items-center gap-1">Change <ArrowUpDown className="w-3 h-3"/></div>,
        cell: ({ getValue }) => {
          const val = getValue() as number;
          const isPositive = val >= 0;
          return (
            <div
              className={cn(
                "flex items-center justify-end gap-1 font-mono text-[13px] font-bold",
                isPositive ? "text-[var(--positive)]" : "text-[var(--negative)]"
              )}
            >
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(val).toFixed(2)}%
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Watch</div>,
        cell: ({ row }) => {
          const symbol = row.original.symbol;
          return (
            <div className="text-center">
              <button
                onClick={(e) => handleToggle(e, symbol)}
                disabled={toggling === symbol}
                className={cn(
                  "p-2 rounded-full transition-all border border-transparent",
                  watchlistSymbols.has(symbol)
                    ? "bg-[var(--surface-muted)] text-[var(--text-primary)] hover:border-[var(--negative)] hover:text-[var(--negative)]"
                    : "bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:border-[var(--info)] hover:text-[var(--info)]"
                )}
                title={watchlistSymbols.has(symbol) ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {toggling === symbol ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : watchlistSymbols.has(symbol) ? (
                  <Minus className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.volume || 0,
        id: "volume",
        header: () => <div className="text-right flex justify-end items-center gap-1 hidden sm:flex">Volume <ArrowUpDown className="w-3 h-3"/></div>,
        cell: ({ row }) => {
          const volume = row.original.volume || 0;
          return (
            <div className="text-right font-mono text-[12px] text-[var(--text-secondary)] hidden sm:block">
              {volume > 0 ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(volume) : "-"}
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.exchange || "",
        id: "exchange",
        header: () => <div className="text-right hidden md:block">Exchange</div>,
        cell: ({ getValue }) => (
          <div className="text-right font-mono text-[12px] text-[var(--text-secondary)] hidden md:block">
            {getValue() as string}
          </div>
        ),
      },
    ],
    [toggling, watchlistSymbols, handleToggle]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="space-y-8 pb-20 relative min-h-screen max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
      {/* 🔍 SEARCH HERO */}
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <h1 className="page-title text-center">Market Screener</h1>
        <div className="w-full max-w-2xl relative">
          <input
            type="text"
            placeholder="Search by symbol, company or ISIN..."
            className="w-full p-4 pl-12 rounded-lg border border-[var(--border)] bg-[var(--surface-solid)] focus:ring-1 focus:ring-[var(--info)] outline-none transition-all font-sans text-[15px] text-[var(--text-primary)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />

          {loading && query && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--info)]" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* RESULTS TABLE */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[12px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
              {loading && !query ? "Loading Trending Stocks..." : `${filteredData.length} Results Found`}
            </h3>
            {!query && !loading && (
              <span className="text-[10px] px-2 py-1 rounded bg-[var(--surface-muted)] text-[var(--text-primary)] border border-[var(--border)] font-bold tracking-widest uppercase">
                Trending
              </span>
            )}
          </div>

          <div className="rounded-md border border-[var(--border)] bg-[var(--surface-solid)] shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] select-none",
                            header.column.getCanSort() ? "cursor-pointer hover:text-[var(--text-primary)]" : ""
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {loading && filteredData.length === 0 ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse bg-[var(--surface-solid)]">
                        <td className="px-4 py-4">
                          <div className="h-8 w-8 rounded-full bg-[var(--border)] inline-block mr-2" />
                          <div className="h-4 w-12 bg-[var(--border)] rounded inline-block" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-32 bg-[var(--border)] rounded" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-16 bg-[var(--border)] rounded ml-auto" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-12 bg-[var(--border)] rounded ml-auto" />
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <div className="h-4 w-12 bg-[var(--border)] rounded ml-auto" />
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <div className="h-4 w-20 bg-[var(--border)] rounded ml-auto" />
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="h-4 w-10 bg-[var(--border)] rounded ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => {
                      const symbol = row.original.symbol;
                      return (
                        <tr
                          key={row.id}
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              const enrichedItem = { ...row.original, logo: row.original.image || `https://financialmodelingprep.com/image-stock/${symbol}.png` };
                              sessionStorage.setItem(`stock_data_${symbol}`, JSON.stringify(enrichedItem));
                            }
                            router.push(`/stocks/${symbol}`);
                          }}
                          className="group cursor-pointer hover:bg-[var(--surface-muted)] transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-secondary)] font-sans text-[14px]">
                        {errorInfo ? (
                           <div className="text-red-500 font-mono">Error: {errorInfo}</div>
                        ) : query ? (
                           `No stocks found matching "${query}"` 
                        ) : (
                           "No stocks available matching your filters."
                        )}
                        <div className="mt-4 font-mono text-xs text-gray-500">
                          Debug: data.length={data.length}, filteredData.length={filteredData.length}, loading={loading.toString()}
                        </div>
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
