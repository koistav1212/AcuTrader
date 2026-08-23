import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../lib/api/market';

export function useMarketSearch(query: string) {
  return useQuery({
    queryKey: ['marketSearch', query],
    queryFn: async () => {
      if (!query) return [];
      const res = await marketApi.search(query);
      return res.data;
    },
    enabled: !!query,
  });
}
