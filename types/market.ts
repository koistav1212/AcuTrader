export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: string;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose?: number;
  volume: number;
}

export interface SearchResult {
  symbol: string;
  instrument_name?: string;
  name?: string;
  exchange: string;
  type?: string;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface MarketMoversResponse {
  gainers: MarketMover[];
  losers: MarketMover[];
  active?: MarketMover[];
}

export interface Indicators {
  current_price: number;
  RSI?: number;
  MACD?: number;
  MACD_Signal?: number;
  SMA_20?: number;
  SMA_50?: number;
  SMA_200?: number;
  BB_High?: number;
  BB_Low?: number;
  ATR?: number;
  Volatility?: number;
  Volume_Spike?: number;
}

export interface MarketRegime {
  symbol: string;
  regime: string;
  confidence: number;
}

export interface SeasonalityData {
  period: string; // 'weekly', 'monthly', 'yearly'
  data: any[]; // day/month/year and avgReturn
}
