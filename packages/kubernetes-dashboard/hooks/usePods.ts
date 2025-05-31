import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { Pod, PodList } from 'kubernetesjs'

// Query keys
const PODS_KEY = ['pods'] as const

export function usePods(namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<PodList, Error>({
    queryKey: [...PODS_KEY, ns],
    queryFn: async () => {
      const result = await client.listCoreV1NamespacedPod({
        path: { namespace: ns },
        query: {},
      })
      return result
    },
  })
}

export function usePod(name: string, namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<Pod, Error>({
    queryKey: [...PODS_KEY, ns, name],
    queryFn: async () => {
      const result = await client.readCoreV1NamespacedPod({
        path: { namespace: ns, name },
        query: {},
      })
      return result
    },
    enabled: !!name,
  })
}

export function usePodLogs(name: string, namespace?: string, container?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<string, Error>({
    queryKey: [...PODS_KEY, ns, name, 'logs', container],
    queryFn: async () => {
      const result = await client.readCoreV1NamespacedPodLog({
        path: { namespace: ns, name },
        query: container ? { container } : {},
      })
      return result as string
    },
    enabled: !!name,
  })
}

export function useDeletePod() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<void, Error, { name: string; namespace?: string }>({
    mutationFn: async ({ name, namespace }) => {
      const ns = namespace || defaultNamespace
      await client.deleteCoreV1NamespacedPod({
        path: { namespace: ns, name },
        query: {},
      })
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...PODS_KEY, ns] })
    },
  })
}

export function usePodsForDeployment(deploymentName: string, namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<PodList, Error>({
    queryKey: [...PODS_KEY, ns, 'deployment', deploymentName],
    queryFn: async () => {
      const result = await client.listCoreV1NamespacedPod({
        path: { namespace: ns },
        query: {
          labelSelector: `app=${deploymentName}`,
        },
      })
      return result
    },
    enabled: !!deploymentName,
  })
}