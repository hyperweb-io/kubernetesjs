import { 
  useListAppsV1NamespacedDaemonSetQuery,
  useListAppsV1DaemonSetForAllNamespacesQuery,
  useReadAppsV1NamespacedDaemonSetQuery,
  useDeleteAppsV1NamespacedDaemonSetMutation
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'


export function useDaemonSets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  const allDaemonSetsQuery = useListAppsV1DaemonSetForAllNamespacesQuery({
    query: {},
  })

  const namespacedDaemonSetsQuery = useListAppsV1NamespacedDaemonSetQuery({
    path: { namespace: ns },
    query: {},
  })

  if (ns === '_all') {
    return allDaemonSetsQuery
  } else {
    return namespacedDaemonSetsQuery
  }
}

export function useDaemonSet(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadAppsV1NamespacedDaemonSetQuery({
    path: { namespace: ns, name },
    query: {},
  })
}

export function useDeleteDaemonSet() {
  return useDeleteAppsV1NamespacedDaemonSetMutation()
}
