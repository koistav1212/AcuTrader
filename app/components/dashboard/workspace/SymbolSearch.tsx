"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { marketApi } from "@/app/lib/api/market";

interface SymbolSearchProps {
  value: string;
  onSelect: (symbol: string) => void;
  exchanges?: string[];
  placeholder?: string;
  className?: string;
}

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export function SymbolSearch({
  value,
  onSelect,
  exchanges = ["NASDAQ", "NYSE"],
  placeholder = "Search symbol or company...",
  className,
}: SymbolSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal input value if external value changes (optional, but good for single source of truth)
  useEffect(() => {
    if (!isOpen) {
      setQuery(value);
    }
  }, [value, isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchSymbols = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setIsOpen(true);
    setActiveIndex(-1);

    try {
      // marketApi.searchSymbol needs to be called, assuming it is defined in lib/api/market
      // For now we'll do a direct fetch if marketApi doesn't have it or we'll assume it exists
      // The instruction asks for GET /api/market/search?query=:query&exchanges=NASDAQ,NYSE
      // So we will use fetch.
      const url = `http://localhost:4000/api/market/search?q=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Search request failed");
      const data = await response.json();
      
      if (data.success && data.data) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Unable to search symbols at this time.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== value || isOpen) {
         searchSymbols(query);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, searchSymbols, value, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSelect(result.symbol);
    setQuery(result.symbol);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-[var(--text-muted)]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
             setQuery(e.target.value);
             if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
             if (query.length > 0) setIsOpen(true);
             // Select all text on focus for easy replacement
             inputRef.current?.select();
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-primary)] pl-9 pr-3 py-2 rounded-md text-[13px] focus:outline-none focus:border-[var(--info)] transition-colors placeholder:text-[var(--text-muted)] font-mono"
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-[var(--text-muted)]" />
        )}
      </div>

      {isOpen && (query.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--surface-solid)] border border-[var(--border)] rounded-md shadow-lg z-50 overflow-hidden max-h-[300px] overflow-y-auto">
          {isLoading && results.length === 0 && !error ? (
            <div className="p-4 text-center text-[13px] text-[var(--text-secondary)] font-sans flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--info)]" />
              Searching market data...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-[13px] text-[var(--negative)] font-sans flex flex-col items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-[13px] text-[var(--text-secondary)] font-sans">
              No supported symbol found.
            </div>
          ) : (
            <ul className="py-1">
              {results.map((result, index) => (
                <li
                  key={`${result.symbol}-${index}`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "px-4 py-2 cursor-pointer flex items-center justify-between transition-colors",
                    activeIndex === index
                      ? "bg-[var(--surface-muted)]"
                      : "hover:bg-[var(--surface-muted)]/50"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-[14px] font-bold text-[var(--text-primary)]">
                      {result.symbol}
                    </span>
                    <span className="font-sans text-[12px] text-[var(--text-secondary)] truncate max-w-[200px]">
                      {result.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-muted)] tracking-wider">
                      {result.exchange}
                    </span>
                    {result.type && (
                      <span className="font-sans text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {result.type}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
