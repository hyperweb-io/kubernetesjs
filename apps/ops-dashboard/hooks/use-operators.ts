import type { OperatorInfo } from '@kubernetesjs/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    refetchInterval: 20000,
    staleTime: 0, // Always consider stale so invalidation refetches immediately
  });
}

export function useOperatorMutation() {
  const queryClient = useQueryClient();

  const installOperator = useMutation({
    mutationFn: async (operatorName: string) => {
      const response = await fetch(`/api/operators/${operatorName}/install?wait=true&timeoutMs=240000`, {
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
      queryClient.refetchQueries({ queryKey: ['operators'], type: 'active' });
    },
  });

  const uninstallOperator = useMutation({
    mutationFn: async (operatorName: string) => {
      const response = await fetch(`/api/operators/${operatorName}/install?wait=true&timeoutMs=240000`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to uninstall operator');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['cluster-status'] });
      queryClient.refetchQueries({ queryKey: ['operators'], type: 'active' });
    },
  });

  return { installOperator, uninstallOperator };
}
