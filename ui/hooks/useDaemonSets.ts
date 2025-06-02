import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { DaemonSet, DaemonSetList } from 'kubernetesjs'

// Query keys
const DAEMONSETS_KEY = ['daemonsets'] as const

export function useDaemonSets(namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<DaemonSetList, Error>({
    queryKey: [...DAEMONSETS_KEY, ns],
    queryFn: async () => {
      if (ns === '_all') {
        const result = await client.listAppsV1DaemonSetForAllNamespaces({
          query: {},
        })
        return result
      } else {
        const result = await client.listAppsV1NamespacedDaemonSet({
          path: { namespace: ns },
          query: {},
        })
        return result
      }
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })
}

export function useDaemonSet(name: string, namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<DaemonSet, Error>({
    queryKey: [...DAEMONSETS_KEY, ns, name],
    queryFn: async () => {
      const result = await client.readAppsV1NamespacedDaemonSet({
        path: { namespace: ns, name },
        query: {},
      })
      return result
    },
    enabled: !!name,
    refetchOnMount: 'always',
    staleTime: 0,
  })
}

export function useDeleteDaemonSet() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<void, Error, { name: string; namespace?: string }>({
    mutationFn: async ({ name, namespace }) => {
      const ns = namespace || defaultNamespace
      await client.deleteAppsV1NamespacedDaemonSet({
        path: { namespace: ns, name },
        query: {},
      })
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...DAEMONSETS_KEY, ns] })
    },
  })
}
