import {
  useListCoreV1SecretForAllNamespacesQuery,
  useListCoreV1NamespacedSecretQuery,
  useReadCoreV1NamespacedSecretQuery,
  useCreateCoreV1NamespacedSecret,
  useReplaceCoreV1NamespacedSecret,
  useDeleteCoreV1NamespacedSecret
} from '@kubernetesjs/react'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { Secret } from 'kubernetesjs'

export function useSecrets(namespace?: string) {
  const { namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListCoreV1SecretForAllNamespacesQuery({ query: {} })
  }
  return useListCoreV1NamespacedSecretQuery({ path: { namespace: ns }, query: {} })
}

export function useSecret(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace
  return useReadCoreV1NamespacedSecretQuery({ path: { namespace: ns, name }, query: {} })
}

export function useCreateSecret() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useCreateCoreV1NamespacedSecret()
  return {
    ...mutation,
    mutate: ({ secret, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace }, query: {}, body: secret }),
    mutateAsync: ({ secret, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace }, query: {}, body: secret }),
  }
}

export function useUpdateSecret() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useReplaceCoreV1NamespacedSecret()
  return {
    ...mutation,
    mutate: ({ name, secret, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace, name }, query: {}, body: secret }),
    mutateAsync: ({ name, secret, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace, name }, query: {}, body: secret }),
  }
}

export function useDeleteSecret() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useDeleteCoreV1NamespacedSecret()
  return {
    ...mutation,
    mutate: ({ name, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace, name }, query: {} }),
    mutateAsync: ({ name, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace, name }, query: {} }),
  }
}