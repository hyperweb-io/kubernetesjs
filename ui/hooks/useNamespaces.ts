import {
  useListCoreV1NamespaceQuery,
  useReadCoreV1NamespaceQuery,
  useCreateCoreV1Namespace,
  useDeleteCoreV1Namespace
} from '@kubernetesjs/react'

export function useNamespaces() {
  return useListCoreV1NamespaceQuery({ path: {}, query: {} })
}

export function useNamespace(name: string) {
  return useReadCoreV1NamespaceQuery({ path: { name }, query: {} })
}

export function useCreateNamespace() {
  const mutation = useCreateCoreV1Namespace()
  return {
    ...mutation,
    mutate: ({ name, labels }) =>
      mutation.mutate({
        path: {},
        query: {},
        body: {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: { name, labels },
        },
      }),
    mutateAsync: ({ name, labels }) =>
      mutation.mutateAsync({
        path: {},
        query: {},
        body: {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: { name, labels },
        },
      }),
  }
}

export function useDeleteNamespace() {
  const mutation = useDeleteCoreV1Namespace()
  return {
    ...mutation,
    mutate: (name: string) =>
      mutation.mutate({ path: { name }, query: {} }),
    mutateAsync: (name: string) =>
      mutation.mutateAsync({ path: { name }, query: {} }),
  }
}