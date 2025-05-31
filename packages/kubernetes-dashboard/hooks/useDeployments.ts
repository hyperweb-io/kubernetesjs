import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useKubernetes } from '../contexts/KubernetesContext'
import type { Deployment, DeploymentList } from 'kubernetesjs'

// Query keys
const DEPLOYMENTS_KEY = ['deployments'] as const

export function useDeployments(namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<DeploymentList, Error>({
    queryKey: [...DEPLOYMENTS_KEY, ns],
    queryFn: async () => {
      if (ns === '_all') {
        // Fetch from all namespaces
        const result = await client.listAppsV1DeploymentForAllNamespaces({
          query: {},
        })
        return result
      } else {
        // Fetch from specific namespace
        const result = await client.listAppsV1NamespacedDeployment({
          path: { namespace: ns },
          query: {},
        })
        return result
      }
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })
}

export function useDeployment(name: string, namespace?: string) {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const ns = namespace || defaultNamespace

  return useQuery<Deployment, Error>({
    queryKey: [...DEPLOYMENTS_KEY, ns, name],
    queryFn: async () => {
      const result = await client.readAppsV1NamespacedDeployment({
        path: { namespace: ns, name },
        query: {},
      })
      return result
    },
    enabled: !!name,
  })
}

export function useCreateDeployment() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<Deployment, Error, { deployment: Deployment; namespace?: string }>({
    mutationFn: async ({ deployment, namespace }) => {
      const ns = namespace || defaultNamespace
      const result = await client.createAppsV1NamespacedDeployment({
        path: { namespace: ns },
        query: {},
        body: deployment,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...DEPLOYMENTS_KEY, ns] })
    },
  })
}

export function useUpdateDeployment() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<Deployment, Error, { name: string; deployment: Deployment; namespace?: string }>({
    mutationFn: async ({ name, deployment, namespace }) => {
      const ns = namespace || defaultNamespace
      const result = await client.replaceAppsV1NamespacedDeployment({
        path: { namespace: ns, name },
        query: {},
        body: deployment,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...DEPLOYMENTS_KEY, ns] })
    },
  })
}

export function useDeleteDeployment() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<void, Error, { name: string; namespace?: string }>({
    mutationFn: async ({ name, namespace }) => {
      const ns = namespace || defaultNamespace
      await client.deleteAppsV1NamespacedDeployment({
        path: { namespace: ns, name },
        query: {},
      })
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...DEPLOYMENTS_KEY, ns] })
    },
  })
}

export function useScaleDeployment() {
  const { client, namespace: defaultNamespace } = useKubernetes()
  const queryClient = useQueryClient()

  return useMutation<Deployment, Error, { name: string; replicas: number; namespace?: string }>({
    mutationFn: async ({ name, replicas, namespace }) => {
      const ns = namespace || defaultNamespace
      
      // First, get the current deployment
      const deployment = await client.readAppsV1NamespacedDeployment({
        path: { namespace: ns, name },
        query: {},
      })
      
      // Update the replicas
      if (deployment.spec) {
        deployment.spec.replicas = replicas
      }
      
      // Update the deployment
      const result = await client.replaceAppsV1NamespacedDeployment({
        path: { namespace: ns, name },
        query: {},
        body: deployment,
      })
      return result
    },
    onSuccess: (_, variables) => {
      const ns = variables.namespace || defaultNamespace
      queryClient.invalidateQueries({ queryKey: [...DEPLOYMENTS_KEY, ns] })
    },
  })
}