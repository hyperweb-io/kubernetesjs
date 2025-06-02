import {
  useListCoreV1ConfigMapForAllNamespacesQuery,
  useListCoreV1NamespacedConfigMapQuery,
  useReadCoreV1NamespacedConfigMapQuery,
  useCreateCoreV1NamespacedConfigMap,
  useReplaceCoreV1NamespacedConfigMap,
  useDeleteCoreV1NamespacedConfigMap
} from '@kubernetesjs/react'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { ConfigMap } from 'kubernetesjs'

export function useConfigMaps(namespace?: string) {
  const { namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListCoreV1ConfigMapForAllNamespacesQuery({ query: {} })
  }
  return useListCoreV1NamespacedConfigMapQuery({ path: { namespace: ns }, query: {} })
}

export function useConfigMap(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace
  return useReadCoreV1NamespacedConfigMapQuery({ path: { namespace: ns, name }, query: {} })
}

export function useCreateConfigMap() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useCreateCoreV1NamespacedConfigMap()
  return {
    ...mutation,
    mutate: ({ configMap, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace }, query: {}, body: configMap }),
    mutateAsync: ({ configMap, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace }, query: {}, body: configMap }),
  }
}

export function useUpdateConfigMap() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useReplaceCoreV1NamespacedConfigMap()
  return {
    ...mutation,
    mutate: ({ name, configMap, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace, name }, query: {}, body: configMap }),
    mutateAsync: ({ name, configMap, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace, name }, query: {}, body: configMap }),
  }
}

export function useDeleteConfigMap() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useDeleteCoreV1NamespacedConfigMap()
  return {
    ...mutation,
    mutate: ({ name, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace, name }, query: {} }),
    mutateAsync: ({ name, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace, name }, query: {} }),
  }
}