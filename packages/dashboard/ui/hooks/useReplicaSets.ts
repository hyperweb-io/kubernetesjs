import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { ReplicaSet, ReplicaSetList } from 'kubernetesjs'

// Query keys
const REPLICASETS_KEY = ['replicasets'] as const

export function useReplicaSets(namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<ReplicaSetList, Error>({
    queryKey: [...REPLICASETS_KEY, ns],
    queryFn: async () => {
      if (ns === '_all') {
        const result = await client.listAppsV1ReplicaSetForAllNamespaces({
          query: {},
        })
        return result
      } else {
        const result = await client.listAppsV1NamespacedReplicaSet({
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

export function useReplicaSet(name: string, namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<ReplicaSet, Error>({
    queryKey: [...REPLICASETS_KEY, ns, name],
    queryFn: async () => {
      const result = await client.readAppsV1NamespacedReplicaSet({
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

export function useDeleteReplicaSet() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<void, Error, { name: string; namespace?: string }>({
    mutationFn: async ({ name, namespace }) => {
      const ns = namespace || defaultNamespace
      await client.deleteAppsV1NamespacedReplicaSet({
        path: { namespace: ns, name },
        query: {},
      })
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...REPLICASETS_KEY, ns] })
    },
  })
}

export function useScaleReplicaSet() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<ReplicaSet, Error, { name: string; replicas: number; namespace?: string }>({
    mutationFn: async ({ name, replicas, namespace }) => {
      const ns = namespace || defaultNamespace
      
      // First, get the current replicaset
      const replicaSet = await client.readAppsV1NamespacedReplicaSet({
        path: { namespace: ns, name },
        query: {},
      })
      
      // Update the replicas
      if (replicaSet.spec) {
        replicaSet.spec.replicas = replicas
      }
      
      // Update the replicaset
      const result = await client.replaceAppsV1NamespacedReplicaSet({
        path: { namespace: ns, name },
        query: {},
        body: replicaSet,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...REPLICASETS_KEY, ns] })
    },
  })
}
