import { fetchWithAuth, ML_API_URL, API_BASE_URL } from './client';
import { Indicators, MarketRegime, SeasonalityData } from '@/types/market';
import { ApiResponse } from '@/types/api';

export const mlApi = {
  getIndicators: async (symbol: string): Promise<Indicators> => {
    return fetchWithAuth(`${ML_API_URL}/indicators?symbol=${symbol}`);
  },

  getRegime: async (symbol: string): Promise<MarketRegime> => {
    return fetchWithAuth(`${ML_API_URL}/regime?symbol=${symbol}`);
  },

  getSeasonality: async (symbol: string, period: string): Promise<ApiResponse<SeasonalityData>> => {
    return fetchWithAuth(`${API_BASE_URL}/market/seasonality/${symbol}?period=${period}`);
  }
};
