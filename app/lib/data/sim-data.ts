// --- Types ---
export interface PortfolioValuePoint {
  date: string;
  value: number;
}

export interface SectorPoint {
  name: string;
  value: number; // Percentage share of portfolio
}

export interface Holding {
  symbol: string;
  quantity: number;
  avgCost: number;
  marketPrice: number;
  dailyChange: number; // Percentage
}

export interface Transaction {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  date: string;
  quantity: number;
  price: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export interface PeerPerformancePoint {
  month: string;
  value: number;
}

export interface Peer {
  id: string;
  name: string;
  avatar: string; // URL or placeholder
  holdings: Holding[];
  performanceHistory: PeerPerformancePoint[]; // Monthly performance for comparison
}

// --- Mock Data ---

export const portfolioValueData: PortfolioValuePoint[] = [
  { date: "Mon", value: 10000 },
  { date: "Tue", value: 10250 },
  { date: "Wed", value: 10100 },
  { date: "Thu", value: 10450 },
  { date: "Fri", value: 10510 },
  { date: "Sat", value: 10480 },
];

export const sectorData: SectorPoint[] = [
  { name: "Technology", value: 45 },
  { name: "Finance", value: 25 },
  { name: "Energy", value: 15 },
  { name: "Healthcare", value: 10 },
  { name: "Other", value: 5 },
];

export const holdings: Holding[] = [
  {
    symbol: "AAPL",
    quantity: 10,
    avgCost: 150.00,
    marketPrice: 157.50,
    dailyChange: 0.85,
  },
  {
    symbol: "GOOGL",
    quantity: 5,
    avgCost: 1200.00,
    marketPrice: 1180.50,
    dailyChange: -1.25,
  },
  {
    symbol: "TSLA",
    quantity: 2,
    avgCost: 900.00,
    marketPrice: 915.20,
    dailyChange: 1.69,
  },
  {
    symbol: "MSFT",
    quantity: 15,
    avgCost: 280.00,
    marketPrice: 281.40,
    dailyChange: 0.15,
  },
];

export const transactions: Transaction[] = [
  { id: "tx1", symbol: "AAPL", type: "BUY", date: "2024-01-15", quantity: 5, price: 145.00 },
  { id: "tx2", symbol: "TSLA", type: "SELL", date: "2024-02-10", quantity: 1, price: 890.00 },
  { id: "tx3", symbol: "NVDA", type: "BUY", date: "2024-03-05", quantity: 10, price: 420.00 },
  { id: "tx4", symbol: "GOOGL", type: "BUY", date: "2024-03-20", quantity: 2, price: 1150.00 },
];

export const watchlist: WatchlistItem[] = [
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 3400.00, change: -0.50 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 605.00, change: 1.25 },
  { symbol: "META", name: "Meta Platforms", price: 310.00, change: 0.90 },
];

export const peers: Peer[] = [
  {
    id: "peer1",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?u=peer1",
    holdings: [
      { symbol: "NVDA", quantity: 20, avgCost: 400, marketPrice: 475, dailyChange: 2.1 },
      { symbol: "AMD", quantity: 50, avgCost: 100, marketPrice: 115, dailyChange: 1.5 },
    ],
    performanceHistory: [
      { month: "Jan", value: 10000 },
      { month: "Feb", value: 11500 },
      { month: "Mar", value: 12100 },
      { month: "Apr", value: 11800 },
      { month: "May", value: 13500 },
      { month: "Jun", value: 14200 },
    ],
  },
  {
    id: "peer2",
    name: "Sarah Lee",
    avatar: "https://i.pravatar.cc/150?u=peer2",
    holdings: [
      { symbol: "AAPL", quantity: 15, avgCost: 140, marketPrice: 157, dailyChange: 0.8 },
      { symbol: "MSFT", quantity: 10, avgCost: 260, marketPrice: 281, dailyChange: 0.2 },
    ],
    performanceHistory: [
      { month: "Jan", value: 10000 },
      { month: "Feb", value: 10200 },
      { month: "Mar", value: 10500 },
      { month: "Apr", value: 10900 },
      { month: "May", value: 11200 },
      { month: "Jun", value: 11500 },
    ],
  },
  {
    id: "peer3",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/150?u=peer3",
    holdings: [
      { symbol: "TSLA", quantity: 5, avgCost: 850, marketPrice: 915, dailyChange: 1.7 },
      { symbol: "COIN", quantity: 20, avgCost: 80, marketPrice: 75, dailyChange: -2.5 },
    ],
    performanceHistory: [
      { month: "Jan", value: 10000 },
      { month: "Feb", value: 9500 },
      { month: "Mar", value: 11000 },
      { month: "Apr", value: 10500 },
      { month: "May", value: 12000 },
      { month: "Jun", value: 12800 },
    ],
  },
];

// User's own performance history for comparison
export const userPerformanceHistory: PeerPerformancePoint[] = [
  { month: "Jan", value: 10000 },
  { month: "Feb", value: 10800 },
  { month: "Mar", value: 11200 },
  { month: "Apr", value: 11500 },
  { month: "May", value: 11900 },
  { month: "Jun", value: 12500 },
];

export const tradeableStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 157.50, change: 0.85 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 1180.50, change: -1.25 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 915.20, change: 1.69 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 3400.00, change: -0.50 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 475.20, change: 2.10 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 170.80, change: 0.05 },
];

export const CHART_COLORS = [
  "#22c55e", // Green
  "#0ea5e9", // Sky Blue
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#a855f7", // Purple
];

// --- Other Constants ---
export const STARTING_BALANCE = 10000.00;
export const USER_ID = "user-1a2b-3c4d-5e6f";