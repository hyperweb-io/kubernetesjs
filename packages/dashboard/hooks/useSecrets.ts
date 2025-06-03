import {
  useListCoreV1SecretForAllNamespacesQuery,
  useListCoreV1NamespacedSecretQuery,
  useReadCoreV1NamespacedSecretQuery,
  useCreateCoreV1NamespacedSecret,
  useReplaceCoreV1NamespacedSecret,
  useDeleteCoreV1NamespacedSecret,
} from '../k8s/index'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { Secret, SecretList } from 'kubernetesjs'

// Query keys
const SECRETS_KEY = ['secrets'] as const

export function useSecrets(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListCoreV1SecretForAllNamespacesQuery({ path: {}, query: {} })
  }
  return useListCoreV1NamespacedSecretQuery({ path: { namespace: ns }, query: {} })
}

export function useSecret(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadCoreV1NamespacedSecretQuery({ path: { namespace: ns, name }, query: {} })
}

export function useCreateSecret() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useCreateCoreV1NamespacedSecret()
  return {
    ...base,
    mutate: (
      { secret, namespace }: { secret: Secret; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: secret },
        opts
      ),
    mutateAsync: (
      { secret, namespace }: { secret: Secret; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: secret },
        opts
      ),
  }
}

export function useUpdateSecret() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useReplaceCoreV1NamespacedSecret()
  return {
    ...base,
    mutate: (
      { name, secret, namespace }: { name: string; secret: Secret; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: secret },
        opts
      ),
    mutateAsync: (
      { name, secret, namespace }: { name: string; secret: Secret; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: secret },
        opts
      ),
  }
}

export function useDeleteSecret() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useDeleteCoreV1NamespacedSecret()
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