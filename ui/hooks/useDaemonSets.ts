import {
  useListAppsV1DaemonSetForAllNamespacesQuery,
  useListAppsV1NamespacedDaemonSetQuery,
  useReadAppsV1NamespacedDaemonSetQuery,
  useDeleteAppsV1NamespacedDaemonSet,
} from '../k8s/index'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { DaemonSet, DaemonSetList } from 'kubernetesjs'

// Query keys
const DAEMONSETS_KEY = ['daemonsets'] as const

export function useDaemonSets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListAppsV1DaemonSetForAllNamespacesQuery({ path: {}, query: {} })
  }
  return useListAppsV1NamespacedDaemonSetQuery({ path: { namespace: ns }, query: {} })
}

export function useDaemonSet(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadAppsV1NamespacedDaemonSetQuery({ path: { namespace: ns, name }, query: {} })
}

export function useDeleteDaemonSet() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useDeleteAppsV1NamespacedDaemonSet()
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
