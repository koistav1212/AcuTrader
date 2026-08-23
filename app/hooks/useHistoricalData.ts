import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../lib/api/market';

export function useHistoricalData(symbol: string, range: string = '1M', interval: string = '1d') {
  return useQuery({
    queryKey: ['historicalData', symbol, range, interval],
    queryFn: async ({ signal }) => {
      const res = await marketApi.getHistoricalData(symbol, range, interval, { signal });
      return res.data;
    },
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
