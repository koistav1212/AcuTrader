"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';



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
        const headers = getHeaders(token);
        
        // Fetch all data in parallel
        const [portfolioRes, watchlistRes, transactionsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/user/portfolio`, { headers }),
            fetch(`${API_BASE_URL}/user/watchlist`, { headers }),
            fetch(`${API_BASE_URL}/user/transactions`, { headers })
        ]);

        if (portfolioRes.ok) {
            const portfolioData = await portfolioRes.json();
            // Assuming portfolioData has structure { holdings: [], ... } based on typical API
            // Or if it returns just the array (based on user request description 'Portfolio data')
            // Adjust based on actual API response. Let's assume it returns { holdings: [...] } or just [...]
            // The previous code had `return NextResponse.json({ holdings, totalInvested })`
            if (portfolioData.holdings) {
                 setHoldings(portfolioData.holdings);
            } else if (Array.isArray(portfolioData)) {
                 setHoldings(portfolioData); // If it's just an array of holdings
            }
        }

        if (watchlistRes.ok) {
            const watchlistData = await watchlistRes.json();
            // Assuming simplified response or array of objects
            setWatchlist(Array.isArray(watchlistData) ? watchlistData : []);
        }

        if (transactionsRes.ok) {
            const transactionsData = await transactionsRes.json();
            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        }

    } catch (err: any) {
        console.error("Error fetching user data:", err);
        // Don't set global error here to avoid blocking UI, just log it
        // OR setError("Failed to load user data");
    } finally {
        setLoading(false);
    }
  }, [API_BASE_URL]);

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
    router.push('/api/auth/login'); // Redirect to login
  }, [router]);

  const toggleWatchlist = async (symbol: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/watchlist/toggle`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ symbol }),
      });

      if (!res.ok) throw new Error('Failed to toggle watchlist');

      const data = await res.json();
      
      // Optimistic update or re-fetch
      // If the API returns the new state (added: boolean), we can update local state
      // But re-fetching is safer to sync
      
      // Let's do optimistic update for instant feedback if we know the logic
      if (watchlistSymbols.has(symbol)) {
          setWatchlist(prev => prev.filter(i => i.symbol !== symbol));
      } else {
          setWatchlist(prev => [...prev, { symbol }]); // Mock basic item
      }

      await fetch(`${API_BASE_URL}/user/watchlist`, { headers: getHeaders() })
        .then(r => r.json())
        .then(d => setWatchlist(d));

    } catch (err) {
      console.error(err);
      // Revert if needed, or just show toast
    }
  };

  const buyStock = async (symbol: string, quantity: number, price: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/buy`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ symbol, quantity, price }),
      });

      if (!res.ok) throw new Error('Buy failed');

      // Refresh data to reflect new holdings/transactions
      await refreshData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const sellStock = async (symbol: string, quantity: number, price: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/sell`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ symbol, quantity, price }),
      });

      if (!res.ok) throw new Error('Sell failed');

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
        // If no token found, redirect to authentication page
        if (window.location.pathname !== '/') {
             router.push('/');
        }
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
