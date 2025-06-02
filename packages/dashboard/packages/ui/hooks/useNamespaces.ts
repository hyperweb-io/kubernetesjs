import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { Namespace, NamespaceList } from 'kubernetesjs'

// Query keys
const NAMESPACES_KEY = ['namespaces'] as const

export function useNamespaces() {
  const { client } = useKubernetes()

  return useQuery<NamespaceList, Error>({
    queryKey: NAMESPACES_KEY,
    queryFn: async () => {
      const result = await client.listCoreV1Namespace({
        path: {},
        query: {},
      })
      return result
    },
  })
}

export function useNamespace(name: string) {
  const { client } = useKubernetes()

  return useQuery<Namespace, Error>({
    queryKey: [...NAMESPACES_KEY, name],
    queryFn: async () => {
      const result = await client.readCoreV1Namespace({
        path: { name },
        query: {},
      })
      return result
    },
    enabled: !!name,
  })
}

export function useCreateNamespace() {
  const { client } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<Namespace, Error, { name: string; labels?: Record<string, string> }>({
    mutationFn: async ({ name, labels }) => {
      const result = await client.createCoreV1Namespace({
        path: {},
        query: {},
        body: {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name,
            labels,
          },
        },
      })
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NAMESPACES_KEY })
    },
  })
}

export function useDeleteNamespace() {
  const { client } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (name) => {
      await client.deleteCoreV1Namespace({
        path: { name },
        query: {},
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NAMESPACES_KEY })
    },
  })
}