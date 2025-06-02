import {
  useListAppsV1DaemonSetForAllNamespacesQuery,
  useListAppsV1NamespacedDaemonSetQuery,
  useReadAppsV1NamespacedDaemonSetQuery,
  useDeleteAppsV1NamespacedDaemonSet
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { DaemonSet } from 'kubernetesjs'

export function useDaemonSets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListAppsV1DaemonSetForAllNamespacesQuery({ query: {} })
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
  const mutation = useDeleteAppsV1NamespacedDaemonSet()
  return {
    ...mutation,
    mutate: ({ name, namespace }) =>
      mutation.mutate({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
      }),
    mutateAsync: ({ name, namespace }) =>
      mutation.mutateAsync({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
      }),
  }
}
