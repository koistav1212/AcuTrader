import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../lib/api/market';

export function useMarketMovers() {
  return useQuery({
    queryKey: ['marketMovers'],
    queryFn: async () => {
      const res = await marketApi.getMovers();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}
