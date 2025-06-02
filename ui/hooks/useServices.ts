import {
  useListCoreV1ServiceForAllNamespacesQuery,
  useListCoreV1NamespacedServiceQuery,
  useReadCoreV1NamespacedServiceQuery,
  useCreateCoreV1NamespacedService,
  useReplaceCoreV1NamespacedService,
  useDeleteCoreV1NamespacedService
} from '@kubernetesjs/react'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { Service } from 'kubernetesjs'

export function useServices(namespace?: string) {
  const { namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListCoreV1ServiceForAllNamespacesQuery({ query: {} })
  }
  return useListCoreV1NamespacedServiceQuery({ path: { namespace: ns }, query: {} })
}

export function useService(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace
  return useReadCoreV1NamespacedServiceQuery({ path: { namespace: ns, name }, query: {} })
}

export function useCreateService() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useCreateCoreV1NamespacedService()
  return {
    ...mutation,
    mutate: ({ service, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace }, query: {}, body: service }),
    mutateAsync: ({ service, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace }, query: {}, body: service }),
  }
}

export function useUpdateService() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useReplaceCoreV1NamespacedService()
  return {
    ...mutation,
    mutate: ({ name, service, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace, name }, query: {}, body: service }),
    mutateAsync: ({ name, service, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace, name }, query: {}, body: service }),
  }
}

export function useDeleteService() {
  const { namespace: defaultNamespace } = useKubernetes()
  const mutation = useDeleteCoreV1NamespacedService()
  return {
    ...mutation,
    mutate: ({ name, namespace }) =>
      mutation.mutate({ path: { namespace: namespace || defaultNamespace, name }, query: {} }),
    mutateAsync: ({ name, namespace }) =>
      mutation.mutateAsync({ path: { namespace: namespace || defaultNamespace, name }, query: {} }),
  }
}