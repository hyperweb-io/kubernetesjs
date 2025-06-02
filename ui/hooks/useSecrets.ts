import { 
  useListCoreV1NamespacedSecretQuery,
  useListCoreV1SecretForAllNamespacesQuery,
  useReadCoreV1NamespacedSecretQuery,
  useCreateCoreV1NamespacedSecretMutation,
  useReplaceCoreV1NamespacedSecretMutation,
  useDeleteCoreV1NamespacedSecretMutation
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'


export function useSecrets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  const allSecretsQuery = useListCoreV1SecretForAllNamespacesQuery({
    query: {},
  })

  const namespacedSecretsQuery = useListCoreV1NamespacedSecretQuery({
    path: { namespace: ns },
    query: {},
  })

  if (ns === '_all') {
    return allSecretsQuery
  } else {
    return namespacedSecretsQuery
  }
}

export function useSecret(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadCoreV1NamespacedSecretQuery({
    path: { namespace: ns, name },
    query: {},
  })
}

export function useCreateSecret() {
  return useCreateCoreV1NamespacedSecretMutation()
}

export function useUpdateSecret() {
  return useReplaceCoreV1NamespacedSecretMutation()
}

export function useDeleteSecret() {
  return useDeleteCoreV1NamespacedSecretMutation()
}
