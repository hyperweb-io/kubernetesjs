import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { Secret, SecretList } from 'kubernetesjs'

// Query keys
const SECRETS_KEY = ['secrets'] as const

export function useSecrets(namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<SecretList, Error>({
    queryKey: [...SECRETS_KEY, ns],
    queryFn: async () => {
      const result = await client.listCoreV1NamespacedSecret({
        path: { namespace: ns },
        query: {},
      })
      return result
    },
  })
}

export function useSecret(name: string, namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<Secret, Error>({
    queryKey: [...SECRETS_KEY, ns, name],
    queryFn: async () => {
      const result = await client.readCoreV1NamespacedSecret({
        path: { namespace: ns, name },
        query: {},
      })
      return result
    },
    enabled: !!name,
  })
}

export function useCreateSecret() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<Secret, Error, { secret: Secret; namespace?: string }>({
    mutationFn: async ({ secret, namespace }) => {
      const ns = namespace || defaultNamespace
      const result = await client.createCoreV1NamespacedSecret({
        path: { namespace: ns },
        query: {},
        body: secret,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...SECRETS_KEY, ns] })
    },
  })
}

export function useUpdateSecret() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<Secret, Error, { name: string; secret: Secret; namespace?: string }>({
    mutationFn: async ({ name, secret, namespace }) => {
      const ns = namespace || defaultNamespace
      const result = await client.replaceCoreV1NamespacedSecret({
        path: { namespace: ns, name },
        query: {},
        body: secret,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...SECRETS_KEY, ns] })
    },
  })
}

export function useDeleteSecret() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<void, Error, { name: string; namespace?: string }>({
    mutationFn: async ({ name, namespace }) => {
      const ns = namespace || defaultNamespace
      await client.deleteCoreV1NamespacedSecret({
        path: { namespace: ns, name },
        query: {},
      })
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...SECRETS_KEY, ns] })
    },
  })
}