import {
  useListCoreV1ConfigMapForAllNamespacesQuery,
  useListCoreV1NamespacedConfigMapQuery,
  useReadCoreV1NamespacedConfigMapQuery,
  useCreateCoreV1NamespacedConfigMap,
  useReplaceCoreV1NamespacedConfigMap,
  useDeleteCoreV1NamespacedConfigMap,
} from '../k8s/index'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { ConfigMap, ConfigMapList } from 'kubernetesjs'

// Query keys
const CONFIGMAPS_KEY = ['configmaps'] as const

export function useConfigMaps(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListCoreV1ConfigMapForAllNamespacesQuery({ query: {}, path: {} })
  }
  return useListCoreV1NamespacedConfigMapQuery({ path: { namespace: ns }, query: {} })
}

export function useConfigMap(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadCoreV1NamespacedConfigMapQuery({ path: { namespace: ns, name }, query: {} })
}

export function useCreateConfigMap() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useCreateCoreV1NamespacedConfigMap()
  return {
    ...base,
    mutate: (
      { configMap, namespace }: { configMap: ConfigMap; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: configMap },
        opts
      ),
    mutateAsync: (
      { configMap, namespace }: { configMap: ConfigMap; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: configMap },
        opts
      ),
  }
}

export function useUpdateConfigMap() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useReplaceCoreV1NamespacedConfigMap()
  return {
    ...base,
    mutate: (
      { name, configMap, namespace }: { name: string; configMap: ConfigMap; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: configMap },
        opts
      ),
    mutateAsync: (
      { name, configMap, namespace }: { name: string; configMap: ConfigMap; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: configMap },
        opts
      ),
  }
}

export function useDeleteConfigMap() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useDeleteCoreV1NamespacedConfigMap()
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