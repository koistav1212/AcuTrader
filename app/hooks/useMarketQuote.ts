import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../lib/api/market';

export function useMarketQuote(symbol: string, enabled = true) {
  return useQuery({
    queryKey: ['quote', symbol],
    queryFn: async () => {
      const res = await marketApi.getQuote(symbol);
      return res.data;
    },
    enabled: !!symbol && enabled,
    refetchInterval: 15 * 1000, // Polling every 15s
    staleTime: 10 * 1000,
  });
}
