import { useQuery } from '@tanstack/react-query';
import { mlApi } from '../lib/api/ml';

export function useSeasonality(symbol: string, period: string) {
  return useQuery({
    queryKey: ['seasonality', symbol, period],
    queryFn: async () => {
      const res = await mlApi.getSeasonality(symbol, period);
      return res.data;
    },
    enabled: !!symbol && !!period,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
