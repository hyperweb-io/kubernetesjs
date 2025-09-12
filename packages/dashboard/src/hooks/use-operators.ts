import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { OperatorInfo } from '@/lib/interweb-client';

export function useOperators() {
  return useQuery<OperatorInfo[]>({
    queryKey: ['operators'],
    queryFn: async () => {
      const response = await fetch('/api/operators');
      if (!response.ok) {
        throw new Error('Failed to fetch operators');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}

export function useOperatorMutation() {
  const queryClient = useQueryClient();

  const installOperator = useMutation({
    mutationFn: async (operatorName: string) => {
      const response = await fetch(`/api/operators/${operatorName}/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error('Failed to install operator');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['cluster-status'] });
    },
  });

  const uninstallOperator = useMutation({
    mutationFn: async (operatorName: string) => {
      const response = await fetch(`/api/operators/${operatorName}/install`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to uninstall operator');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['cluster-status'] });
    },
  });

  return { installOperator, uninstallOperator };
}
