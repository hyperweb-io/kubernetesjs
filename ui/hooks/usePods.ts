import { 
  useListCoreV1NamespacedPodQuery,
  useListCoreV1PodForAllNamespacesQuery,
  useReadCoreV1NamespacedPodQuery,
  useReadCoreV1NamespacedPodLogQuery,
  useDeleteCoreV1NamespacedPodMutation
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'


export function usePods(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  const allPodsQuery = useListCoreV1PodForAllNamespacesQuery({
    query: {},
  })

  const namespacedPodsQuery = useListCoreV1NamespacedPodQuery({
    path: { namespace: ns },
    query: {},
  })

  if (ns === '_all') {
    return allPodsQuery
  } else {
    return namespacedPodsQuery
  }
}

export function usePod(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadCoreV1NamespacedPodQuery({
    path: { namespace: ns, name },
    query: {},
  })
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
  return useDeleteCoreV1NamespacedPodMutation()
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
