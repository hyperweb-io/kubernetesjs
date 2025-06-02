import {
  useListPodsQuery,
  useListCoreV1NamespacedPodQuery,
  useReadCoreV1NamespacedPodQuery,
  useReadCoreV1NamespacedPodLogQuery,
  useDeleteCoreV1NamespacedPod
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { Pod } from 'kubernetesjs'

export function usePods(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListPodsQuery({ query: {} })
  }
  return useListCoreV1NamespacedPodQuery({ path: { namespace: ns }, query: {} })
}

export function usePod(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace
  return useReadCoreV1NamespacedPodQuery({ path: { namespace: ns, name }, query: {} })
}

export function usePodLogs(name: string, namespace?: string, container?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace
  return useReadCoreV1NamespacedPodLogQuery({
    path: { namespace: ns, name },
    query: container ? { container } : {},
  })
}

export function useDeletePod() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const mutation = useDeleteCoreV1NamespacedPod()
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

export function usePodsForDeployment(deploymentName: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useListCoreV1NamespacedPodQuery({
    path: { namespace: ns },
    query: {
      labelSelector: `app=${deploymentName}`,
    },
  })
}