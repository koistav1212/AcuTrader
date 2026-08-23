import { fetchWithAuth, API_BASE_URL } from './client';

export const portfolioApi = {
  getPortfolio: async () => {
    return fetchWithAuth(`${API_BASE_URL}/user/portfolio`);
  },

  getTransactions: async () => {
    return fetchWithAuth(`${API_BASE_URL}/user/transactions`);
  },

  getWatchlist: async () => {
    return fetchWithAuth(`${API_BASE_URL}/user/watchlist`);
  },

  toggleWatchlist: async (symbol: string) => {
    return fetchWithAuth(`${API_BASE_URL}/user/watchlist/toggle`, {
      method: 'POST',
      body: JSON.stringify({ symbol })
    });
  },

  trade: async (payload: { symbol: string; quantity: number; action: 'BUY' | 'SELL'; type?: string; price?: number }) => {
    return fetchWithAuth(`${API_BASE_URL}/market/trade`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
