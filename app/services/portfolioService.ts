
export interface PortfolioSummary {
  equity: number;
  balance: number; // Available Cash
  unrealizedPnl: number;
  dayPnl: number;
  cash: number;
}

export interface Holding {
  symbol: string;
  side: "LONG" | "SHORT" | "BUY" | "SELL"; // Added LONG/SHORT based on API
  quantity: number;
  avgCost: number;     // Matches API
  currentPrice: number; // Matches API
  marketValue: number;
  unrealizedPnl: number;
  returnPercent: number; // Matches API
}

export interface EquityPoint {
  date: string; // ISO date
  equity: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

async function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE_URL}/market/portfolio/summary`, { headers });
  if (!res.ok) throw new Error("Failed to fetch portfolio summary");
  return res.json();
}

export async function getHoldings(): Promise<Holding[]> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE_URL}/market/portfolio/positions`, { headers });
  if (!res.ok) throw new Error("Failed to fetch holdings");
  
  const data = await res.json();
  // Handle both array or object with positions/holdings property
  if (Array.isArray(data)) return data;
  if (data.positions && Array.isArray(data.positions)) return data.positions;
  if (data.holdings && Array.isArray(data.holdings)) return data.holdings;
  
  return []; // Fallback
}

export async function getEquityHistory(): Promise<EquityPoint[]> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE_URL}/market/portfolio/equity-history`, { headers });
  if (!res.ok) throw new Error("Failed to fetch equity history");
  return res.json();
}
