import { fetchWithAuth, API_BASE_URL } from './client';
import { Quote, HistoricalDataPoint, SearchResult, MarketMoversResponse } from '@/types/market';
import { ApiResponse } from '@/types/api';

export const marketApi = {
  getOverview: async () => {
    return fetchWithAuth(`${API_BASE_URL}/market/overview`);
  },
  
  getQuote: async (symbol: string): Promise<ApiResponse<Quote>> => {
    return fetchWithAuth(`${API_BASE_URL}/market/quote/${symbol}`);
  },

  getHistoricalData: async (symbol: string, range: string, interval: string, options?: RequestInit): Promise<ApiResponse<HistoricalDataPoint[]>> => {
    return fetchWithAuth(`${API_BASE_URL}/market/history/${symbol}?range=${range}&interval=${interval}`, options);
  },

  search: async (query: string): Promise<ApiResponse<SearchResult[]>> => {
    return fetchWithAuth(`${API_BASE_URL}/market/search?q=${query}`);
  },

  getMovers: async (): Promise<ApiResponse<MarketMoversResponse>> => {
    return fetchWithAuth(`${API_BASE_URL}/market/movers`);
  }
};
