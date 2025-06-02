import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { ConfigMap, ConfigMapList } from 'kubernetesjs'

// Query keys
const CONFIGMAPS_KEY = ['configmaps'] as const

export function useConfigMaps(namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<ConfigMapList, Error>({
    queryKey: [...CONFIGMAPS_KEY, ns],
    queryFn: async () => {
      if (ns === '_all') {
        const result = await client.listCoreV1ConfigMapForAllNamespaces({
          query: {},
        })
        return result
      } else {
        const result = await client.listCoreV1NamespacedConfigMap({
          path: { namespace: ns },
          query: {},
        })
        return result
      }
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })
}

export function useConfigMap(name: string, namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<ConfigMap, Error>({
    queryKey: [...CONFIGMAPS_KEY, ns, name],
    queryFn: async () => {
      const result = await client.readCoreV1NamespacedConfigMap({
        path: { namespace: ns, name },
        query: {},
      })
      return result
    },
    enabled: !!name,
    refetchOnMount: 'always',
    staleTime: 0,
  })
}

export function useCreateConfigMap() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<ConfigMap, Error, { configMap: ConfigMap; namespace?: string }>({
    mutationFn: async ({ configMap, namespace }) => {
      const ns = namespace || defaultNamespace
      const result = await client.createCoreV1NamespacedConfigMap({
        path: { namespace: ns },
        query: {},
        body: configMap,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...CONFIGMAPS_KEY, ns] })
    },
  })
}

export function useUpdateConfigMap() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<ConfigMap, Error, { name: string; configMap: ConfigMap; namespace?: string }>({
    mutationFn: async ({ name, configMap, namespace }) => {
      const ns = namespace || defaultNamespace
      const result = await client.replaceCoreV1NamespacedConfigMap({
        path: { namespace: ns, name },
        query: {},
        body: configMap,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...CONFIGMAPS_KEY, ns] })
    },
  })
}

export function useDeleteConfigMap() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<void, Error, { name: string; namespace?: string }>({
    mutationFn: async ({ name, namespace }) => {
      const ns = namespace || defaultNamespace
      await client.deleteCoreV1NamespacedConfigMap({
        path: { namespace: ns, name },
        query: {},
      })
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...CONFIGMAPS_KEY, ns] })
    },
  })
}