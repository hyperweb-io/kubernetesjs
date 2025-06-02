import {
  useListCoreV1ServiceForAllNamespacesQuery,
  useListCoreV1NamespacedServiceQuery,
  useReadCoreV1NamespacedServiceQuery,
  useCreateCoreV1NamespacedService,
  useReplaceCoreV1NamespacedService,
  useDeleteCoreV1NamespacedService,
} from '../k8s/index'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { Service, ServiceList } from 'kubernetesjs'

// Query keys
const SERVICES_KEY = ['services'] as const

export function useServices(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListCoreV1ServiceForAllNamespacesQuery({ path: {}, query: {} })
  }
  return useListCoreV1NamespacedServiceQuery({ path: { namespace: ns }, query: {} })
}

export function useService(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadCoreV1NamespacedServiceQuery({ path: { namespace: ns, name }, query: {} })
}

export function useCreateService() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useCreateCoreV1NamespacedService()
  return {
    ...base,
    mutate: (
      { service, namespace }: { service: Service; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: service },
        opts
      ),
    mutateAsync: (
      { service, namespace }: { service: Service; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: service },
        opts
      ),
  }
}

export function useUpdateService() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useReplaceCoreV1NamespacedService()
  return {
    ...base,
    mutate: (
      { name, service, namespace }: { name: string; service: Service; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: service },
        opts
      ),
    mutateAsync: (
      { name, service, namespace }: { name: string; service: Service; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: service },
        opts
      ),
  }
}

export function useDeleteService() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useDeleteCoreV1NamespacedService()
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