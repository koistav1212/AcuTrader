import { useQuery } from '@tanstack/react-query';
import { mlApi } from '../lib/api/ml';

export function useIndicators(symbol: string) {
  return useQuery({
    queryKey: ['indicators', symbol],
    queryFn: async () => {
      const res = await mlApi.getIndicators(symbol);
      return res;
    },
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMarketRegime(symbol: string) {
  return useQuery({
    queryKey: ['marketRegime', symbol],
    queryFn: async () => {
      const res = await mlApi.getRegime(symbol);
      return res;
    },
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
  });
}
