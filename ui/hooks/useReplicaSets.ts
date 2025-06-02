import { 
  useListAppsV1NamespacedReplicaSetQuery,
  useListAppsV1ReplicaSetForAllNamespacesQuery,
  useReadAppsV1NamespacedReplicaSetQuery,
  useDeleteAppsV1NamespacedReplicaSetMutation,
  useReplaceAppsV1NamespacedReplicaSetMutation
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'


export function useReplicaSets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  const allReplicaSetsQuery = useListAppsV1ReplicaSetForAllNamespacesQuery({
    query: {},
  })

  const namespacedReplicaSetsQuery = useListAppsV1NamespacedReplicaSetQuery({
    path: { namespace: ns },
    query: {},
  })

  if (ns === '_all') {
    return allReplicaSetsQuery
  } else {
    return namespacedReplicaSetsQuery
  }
}

export function useReplicaSet(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadAppsV1NamespacedReplicaSetQuery({
    path: { namespace: ns, name },
    query: {},
  })
}

export function useDeleteReplicaSet() {
  return useDeleteAppsV1NamespacedReplicaSetMutation()
}

export function useScaleReplicaSet() {
  const updateReplicaSet = useReplaceAppsV1NamespacedReplicaSetMutation()

  return updateReplicaSet
}
