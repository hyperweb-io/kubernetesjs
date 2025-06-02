import { 
  useListCoreV1NamespacedServiceQuery,
  useListCoreV1ServiceForAllNamespacesQuery,
  useReadCoreV1NamespacedServiceQuery,
  useCreateCoreV1NamespacedServiceMutation,
  useReplaceCoreV1NamespacedServiceMutation,
  useDeleteCoreV1NamespacedServiceMutation
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'


export function useServices(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  const allServicesQuery = useListCoreV1ServiceForAllNamespacesQuery({
    query: {},
  })

  const namespacedServicesQuery = useListCoreV1NamespacedServiceQuery({
    path: { namespace: ns },
    query: {},
  })

  if (ns === '_all') {
    return allServicesQuery
  } else {
    return namespacedServicesQuery
  }
}

export function useService(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadCoreV1NamespacedServiceQuery({
    path: { namespace: ns, name },
    query: {},
  })
}

export function useCreateService() {
  return useCreateCoreV1NamespacedServiceMutation()
}

export function useUpdateService() {
  return useReplaceCoreV1NamespacedServiceMutation()
}

export function useDeleteService() {
  return useDeleteCoreV1NamespacedServiceMutation()
}
