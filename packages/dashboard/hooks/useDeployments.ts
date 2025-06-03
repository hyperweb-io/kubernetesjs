import {
  useListAppsV1DeploymentForAllNamespacesQuery,
  useListAppsV1NamespacedDeploymentQuery,
  useReadAppsV1NamespacedDeploymentQuery,
  useCreateAppsV1NamespacedDeployment,
  useReplaceAppsV1NamespacedDeployment,
  useDeleteAppsV1NamespacedDeployment,
  useReplaceAppsV1NamespacedDeploymentScale,
} from '../k8s/index'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { Deployment, DeploymentList, Scale } from 'kubernetesjs'

// Query keys
const DEPLOYMENTS_KEY = ['deployments'] as const

export function useDeployments(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListAppsV1DeploymentForAllNamespacesQuery({ path: {}, query: {} })
  }
  return useListAppsV1NamespacedDeploymentQuery({ path: { namespace: ns }, query: {} })
}

export function useDeployment(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadAppsV1NamespacedDeploymentQuery({ path: { namespace: ns, name }, query: {} })
}

export function useCreateDeployment() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useCreateAppsV1NamespacedDeployment()
  return {
    ...base,
    mutate: (
      { deployment, namespace }: { deployment: Deployment; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: deployment },
        opts
      ),
    mutateAsync: (
      { deployment, namespace }: { deployment: Deployment; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace }, query: {}, body: deployment },
        opts
      ),
  }
}

export function useUpdateDeployment() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useReplaceAppsV1NamespacedDeployment()
  return {
    ...base,
    mutate: (
      { name, deployment, namespace }: { name: string; deployment: Deployment; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: deployment },
        opts
      ),
    mutateAsync: (
      { name, deployment, namespace }: { name: string; deployment: Deployment; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        { path: { namespace: namespace || defaultNamespace, name }, query: {}, body: deployment },
        opts
      ),
  }
}

export function useDeleteDeployment() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useDeleteAppsV1NamespacedDeployment()
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

export function useScaleDeployment() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const base = useReplaceAppsV1NamespacedDeploymentScale()
  return {
    ...base,
    mutate: (
      { name, replicas, namespace }: { name: string; replicas: number; namespace?: string },
      opts?: Parameters<typeof base.mutate>[1]
    ) =>
      base.mutate(
        {
          path: { namespace: namespace || defaultNamespace, name },
          body: {
            apiVersion: 'autoscaling/v1',
            kind: 'Scale',
            metadata: { name, namespace: namespace || defaultNamespace },
            spec: { replicas },
          } as Scale,
        },
        opts
      ),
    mutateAsync: (
      { name, replicas, namespace }: { name: string; replicas: number; namespace?: string },
      opts?: Parameters<typeof base.mutateAsync>[1]
    ) =>
      base.mutateAsync(
        {
          path: { namespace: namespace || defaultNamespace, name },
          body: {
            apiVersion: 'autoscaling/v1',
            kind: 'Scale',
            metadata: { name, namespace: namespace || defaultNamespace },
            spec: { replicas },
          } as Scale,
        },
        opts
      ),
  }
}