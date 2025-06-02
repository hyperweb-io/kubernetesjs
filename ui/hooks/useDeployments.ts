import {
  useListAppsV1DeploymentForAllNamespacesQuery,
  useListAppsV1NamespacedDeploymentQuery,
  useReadAppsV1NamespacedDeploymentQuery,
  useCreateAppsV1NamespacedDeployment,
  useReplaceAppsV1NamespacedDeployment,
  useDeleteAppsV1NamespacedDeployment,
  useReplaceAppsV1NamespacedDeploymentScale
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'
import type { Deployment } from 'kubernetesjs'

export function useDeployments(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  if (ns === '_all') {
    return useListAppsV1DeploymentForAllNamespacesQuery({ query: {} })
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
  const mutation = useCreateAppsV1NamespacedDeployment()
  return {
    ...mutation,
    mutate: ({ deployment, namespace }) =>
      mutation.mutate({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
        },
        query: {},
        body: deployment,
      }),
    mutateAsync: ({ deployment, namespace }) =>
      mutation.mutateAsync({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
        },
        query: {},
        body: deployment,
      }),
  }
}

export function useUpdateDeployment() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const mutation = useReplaceAppsV1NamespacedDeployment()
  return {
    ...mutation,
    mutate: ({ name, deployment, namespace }) =>
      mutation.mutate({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
        body: deployment,
      }),
    mutateAsync: ({ name, deployment, namespace }) =>
      mutation.mutateAsync({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
        body: deployment,
      }),
  }
}

export function useDeleteDeployment() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const mutation = useDeleteAppsV1NamespacedDeployment()
  return {
    ...mutation,
    mutate: ({ name, namespace }) =>
      mutation.mutate({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
      }),
    mutateAsync: ({ name, namespace }) =>
      mutation.mutateAsync({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
      }),
  }
}

export function useScaleDeployment() {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const mutation = useReplaceAppsV1NamespacedDeploymentScale()
  return {
    ...mutation,
    mutate: ({ name, replicas, namespace }) =>
      mutation.mutate({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
        body: { spec: { replicas } },
      }),
    mutateAsync: ({ name, replicas, namespace }) =>
      mutation.mutateAsync({
        path: {
          namespace: namespace || (defaultNamespace === '_all' ? 'default' : defaultNamespace),
          name,
        },
        query: {},
        body: { spec: { replicas } },
      }),
  }
}