"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { portfolioApi } from '../lib/api/portfolio';

// Define types based on the user's requirements/external API
interface User {
  id: string; // or _id
  firstName: string;
  lastName: string;
  email: string;
  // add other fields if needed
}

interface Holding {
  symbol: string;
  quantity: number;
  avgCost: number;
  marketPrice?: number; // Might come from API or need to be fetched separately
  dailyChange?: number;
  totalValue?: number;
  return?: number;
  returnPercent?: number;
}

interface Transaction {
  id?: string;
  _id?: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  date: string;
}

interface WatchlistItem {
  symbol: string;
  addedAt?: string;
}

interface UserContextType {
  user: User | null;
  holdings: Holding[];
  transactions: Transaction[];
  watchlist: WatchlistItem[];
  watchlistSymbols: Set<string>; // For O(1) lookups
  loading: boolean;
  error: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  toggleWatchlist: (symbol: string) => Promise<void>;
  buyStock: (symbol: string, quantity: number, price: number) => Promise<void>;
  sellStock: (symbol: string, quantity: number, price: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchlistSymbols, setWatchlistSymbols] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Update set of symbols whenever watchlist changes
  useEffect(() => {
    const symbols = new Set(watchlist.map(item => item.symbol));
    setWatchlistSymbols(symbols);
  }, [watchlist]);

  const getHeaders = (token?: string) => {
    const t = token || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${t}`
    };
  };

  const fetchUserData = useCallback(async (token: string) => {
    setLoading(true);
    try {
        const [portfolioRes, watchlistRes, transactionsRes] = await Promise.all([
            portfolioApi.getPortfolio(),
            portfolioApi.getWatchlist(),
            portfolioApi.getTransactions()
        ]);

        const portfolioData = portfolioRes.data || portfolioRes;
        if (portfolioData.holdings) {
             setHoldings(portfolioData.holdings);
        } else if (Array.isArray(portfolioData)) {
             setHoldings(portfolioData); 
        }

        const watchlistData = watchlistRes.data || watchlistRes;
        setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);

        const transactionsData = transactionsRes.data || transactionsRes;
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);

    } catch (err: any) {
        console.error("Error fetching user data:", err);
    } finally {
        setLoading(false);
    }
  }, []);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    fetchUserData(token);
  }, [fetchUserData]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setHoldings([]);
    setWatchlist([]);
    setTransactions([]);
    router.push('/auth/login'); // Redirect to login page
  }, [router]);

  const toggleWatchlist = async (symbol: string) => {
    try {
      await portfolioApi.toggleWatchlist(symbol);
      
      if (watchlistSymbols.has(symbol)) {
          setWatchlist(prev => prev.filter(i => i.symbol !== symbol));
      } else {
          setWatchlist(prev => [...prev, { symbol }]); 
      }

      const d = await portfolioApi.getWatchlist();
      setWatchlist(d.data || d);

    } catch (err) {
      console.error(err);
    }
  };

  const buyStock = async (symbol: string, quantity: number, price: number) => {
    try {
      await portfolioApi.trade({ symbol, quantity, action: 'BUY', price });
      await refreshData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const sellStock = async (symbol: string, quantity: number, price: number) => {
    try {
      await portfolioApi.trade({ symbol, quantity, action: 'SELL', price });
      await refreshData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const refreshData = useCallback(async () => {
      const token = localStorage.getItem('token');
      if (token) await fetchUserData(token);
  }, [fetchUserData]);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
        try {
            setUser(JSON.parse(savedUser));
            fetchUserData(token); 
        } catch (e) {
            console.error("Failed to parse user data", e);
            logout();
        }
    } else {
        setLoading(false);
    }
  }, [fetchUserData, logout, router]);

  return (
    <UserContext.Provider value={{
      user,
      holdings,
      transactions,
      watchlist,
      watchlistSymbols,
      loading,
      error,
      login,
      logout,
      toggleWatchlist,
      buyStock,
      sellStock,
      refreshData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
