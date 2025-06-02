import { 
  useListCoreV1NamespacedConfigMapQuery,
  useListCoreV1ConfigMapForAllNamespacesQuery,
  useReadCoreV1NamespacedConfigMapQuery,
  useCreateCoreV1NamespacedConfigMapMutation,
  useReplaceCoreV1NamespacedConfigMapMutation,
  useDeleteCoreV1NamespacedConfigMapMutation
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'


export function useConfigMaps(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  const allConfigMapsQuery = useListCoreV1ConfigMapForAllNamespacesQuery({
    query: {},
  })

  const namespacedConfigMapsQuery = useListCoreV1NamespacedConfigMapQuery({
    path: { namespace: ns },
    query: {},
  })

  if (ns === '_all') {
    return allConfigMapsQuery
  } else {
    return namespacedConfigMapsQuery
  }
}

export function useConfigMap(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadCoreV1NamespacedConfigMapQuery({
    path: { namespace: ns, name },
    query: {},
  })
}

export function useCreateConfigMap() {
  return useCreateCoreV1NamespacedConfigMapMutation()
}

export function useUpdateConfigMap() {
  return useReplaceCoreV1NamespacedConfigMapMutation()
}

export function useDeleteConfigMap() {
  return useDeleteCoreV1NamespacedConfigMapMutation()
}
