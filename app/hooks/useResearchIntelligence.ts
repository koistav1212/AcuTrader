import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth, API_BASE_URL } from '../lib/api/client';

export function useResearchIntelligence(symbol: string) {
  return useQuery({
    queryKey: ['researchIntelligence', symbol],
    queryFn: async ({ signal }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/research/${symbol}`, { signal });
      return res.data;
    },
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
