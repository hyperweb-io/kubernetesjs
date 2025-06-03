import {
  useListCoreV1NamespaceQuery,
  useReadCoreV1NamespaceQuery,
  useCreateCoreV1Namespace,
  useDeleteCoreV1Namespace,
} from '../k8s/index'
import type { Namespace, NamespaceList } from 'kubernetesjs'

// Query keys
const NAMESPACES_KEY = ['namespaces'] as const

export function useNamespaces() {
  return useListCoreV1NamespaceQuery({ path: {}, query: {} })
}

export function useNamespace(name: string) {
  return useReadCoreV1NamespaceQuery({ path: { name }, query: {} })
}

export function useCreateNamespace() {
  const base = useCreateCoreV1Namespace()
  return {
    ...base,
    mutate: (
      { name, labels }: { name: string; labels?: Record<string, string> },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        {
          path: {},
          query: {},
          body: {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: { name, labels },
          },
        },
        opts
      ),
    mutateAsync: (
      { name, labels }: { name: string; labels?: Record<string, string> },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        {
          path: {},
          query: {},
          body: {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: { name, labels },
          },
        },
        opts
      ),
  }
}

export function useDeleteNamespace() {
  const base = useDeleteCoreV1Namespace()
  return {
    ...base,
    mutate: (name: string, opts?: Parameters<typeof base.mutate>[1]) =>
      base.mutate(
        { path: { name }, query: {} },
        opts
      ),
    mutateAsync: (name: string, opts?: Parameters<typeof base.mutateAsync>[1]) =>
      base.mutateAsync(
        { path: { name }, query: {} },
        opts
      ),
  }
}