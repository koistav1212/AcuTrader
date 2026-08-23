import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../lib/api/portfolio';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await portfolioApi.getPortfolio();
      return res; // Depending on API wrapper
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await portfolioApi.getTransactions();
      return res;
    },
  });
}

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const res = await portfolioApi.getWatchlist();
      return res;
    },
  });
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => portfolioApi.toggleWatchlist(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

export function useTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { symbol: string; quantity: number; action: 'BUY' | 'SELL'; type?: string; price?: number }) => portfolioApi.trade(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
    },
  });
}
