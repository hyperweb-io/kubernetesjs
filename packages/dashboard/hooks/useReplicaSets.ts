import {
  useListAppsV1ReplicaSetForAllNamespacesQuery,
  useListAppsV1NamespacedReplicaSetQuery,
  useReadAppsV1NamespacedReplicaSetQuery,
  useDeleteAppsV1NamespacedReplicaSet,
  useReplaceAppsV1NamespacedReplicaSetScale,
} from '../k8s/index'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { ReplicaSet, ReplicaSetList, Scale } from 'kubernetesjs'

// Query keys
const REPLICASETS_KEY = ['replicasets'] as const

export function useReplicaSets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListAppsV1ReplicaSetForAllNamespacesQuery({ path: {}, query: {} })
  }
  return useListAppsV1NamespacedReplicaSetQuery({ path: { namespace: ns }, query: {} })
}

export function useReplicaSet(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadAppsV1NamespacedReplicaSetQuery({ path: { namespace: ns, name }, query: {} })
}

export function useDeleteReplicaSet() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useDeleteAppsV1NamespacedReplicaSet()
  return {
    ...base,
    mutate: (
      { name, namespace }: { name: string; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace, name }, query: {} },
        opts
      ),
    mutateAsync: (
      { name, namespace }: { name: string; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace, name }, query: {} },
        opts
      ),
  }
}

export function useScaleReplicaSet() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useReplaceAppsV1NamespacedReplicaSetScale()
  return {
    ...base,
    mutate: (
      { name, replicas, namespace }: { name: string; replicas: number; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        {
          path: { namespace: namespace || defaultNamespace, name },
          body: {
            apiVersion: 'autoscaling/v1',
            kind: 'Scale',
            metadata: { name, namespace: namespace || defaultNamespace },
            spec: { replicas },
          } as Scale,
        },
        opts
      ),
    mutateAsync: (
      { name, replicas, namespace }: { name: string; replicas: number; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        {
          path: { namespace: namespace || defaultNamespace, name },
          body: {
            apiVersion: 'autoscaling/v1',
            kind: 'Scale',
            metadata: { name, namespace: namespace || defaultNamespace },
            spec: { replicas },
          } as Scale,
        },
        opts
      ),
  }
}
