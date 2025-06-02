import { 
  useListCoreV1NamespaceQuery,
  useReadCoreV1NamespaceQuery,
  useCreateCoreV1NamespaceMutation,
  useDeleteCoreV1NamespaceMutation
} from '@kubernetesjs/react'

export function useNamespaces() {
  return useListCoreV1NamespaceQuery({
    query: {},
  })
}

export function useNamespace(name: string) {
  return useReadCoreV1NamespaceQuery({
    path: { name },
    query: {},
  })
}

export function useCreateNamespace() {
  return useCreateCoreV1NamespaceMutation()
}

export function useDeleteNamespace() {
  return useDeleteCoreV1NamespaceMutation()
}
