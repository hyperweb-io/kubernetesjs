import type { ClusterOverview } from '@kubernetesjs/client';
import { useQuery } from '@tanstack/react-query';

export function useClusterStatus() {
  return useQuery<ClusterOverview>({
    queryKey: ['cluster-status'],
    queryFn: async () => {
      const response = await fetch('/api/cluster/status');
      if (!response.ok) {
        throw new Error('Failed to fetch cluster status');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
