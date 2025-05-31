import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { Service, ServiceList } from 'kubernetesjs'

// Query keys
const SERVICES_KEY = ['services'] as const

export function useServices(namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<ServiceList, Error>({
    queryKey: [...SERVICES_KEY, ns],
    queryFn: async () => {
      if (ns === '_all') {
        const result = await client.listCoreV1ServiceForAllNamespaces({
          query: {},
        })
        return result
      } else {
        const result = await client.listCoreV1NamespacedService({
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

export function useService(name: string, namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<Service, Error>({
    queryKey: [...SERVICES_KEY, ns, name],
    queryFn: async () => {
      const result = await client.readCoreV1NamespacedService({
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

export function useCreateService() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<Service, Error, { service: Service; namespace?: string }>({
    mutationFn: async ({ service, namespace }) => {
      const ns = namespace || defaultNamespace
      const result = await client.createCoreV1NamespacedService({
        path: { namespace: ns },
        query: {},
        body: service,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...SERVICES_KEY, ns] })
    },
  })
}

export function useUpdateService() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<Service, Error, { name: string; service: Service; namespace?: string }>({
    mutationFn: async ({ name, service, namespace }) => {
      const ns = namespace || defaultNamespace
      const result = await client.replaceCoreV1NamespacedService({
        path: { namespace: ns, name },
        query: {},
        body: service,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...SERVICES_KEY, ns] })
    },
  })
}

export function useDeleteService() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<void, Error, { name: string; namespace?: string }>({
    mutationFn: async ({ name, namespace }) => {
      const ns = namespace || defaultNamespace
      await client.deleteCoreV1NamespacedService({
        path: { namespace: ns, name },
        query: {},
      })
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...SERVICES_KEY, ns] })
    },
  })
}