import {
  useListAppsV1ReplicaSetForAllNamespacesQuery,
  useListAppsV1NamespacedReplicaSetQuery,
  useReadAppsV1NamespacedReplicaSetQuery,
  useDeleteAppsV1NamespacedReplicaSet,
  useReplaceAppsV1NamespacedReplicaSetScale
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { ReplicaSet } from 'kubernetesjs'

export function useReplicaSets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListAppsV1ReplicaSetForAllNamespacesQuery({ query: {} })
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
  const mutation = useDeleteAppsV1NamespacedReplicaSet()
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

export function useScaleReplicaSet() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const mutation = useReplaceAppsV1NamespacedReplicaSetScale()
  return {
    ...mutation,
    mutate: ({ name, replicas, namespace }) =>
      mutation.mutate({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
        body: { spec: { replicas } },
      }),
    mutateAsync: ({ name, replicas, namespace }) =>
      mutation.mutateAsync({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
        body: { spec: { replicas } },
      }),
  }
}
