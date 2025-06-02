import {
  useListPodsQuery,
  useListCoreV1NamespacedPodQuery,
  useReadCoreV1NamespacedPodQuery,
  useReadCoreV1NamespacedPodLogQuery,
  useDeleteCoreV1NamespacedPod,
} from '../k8s/index'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { Pod, PodList } from 'kubernetesjs'

// Query keys
const PODS_KEY = ['pods'] as const

export function usePods(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListPodsQuery({ path: {}, query: {} })
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
  const base = useDeleteCoreV1NamespacedPod()
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

export function usePodsForDeployment(deploymentName: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useListCoreV1NamespacedPodQuery({
    path: { namespace: ns },
    query: { labelSelector: `app=${deploymentName}` },
  })
}