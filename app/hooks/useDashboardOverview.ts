import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../lib/api/market';

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const res = await marketApi.getOverview();
      return res.data;
    },
    staleTime: 15 * 1000, // 15 seconds
  });
}
