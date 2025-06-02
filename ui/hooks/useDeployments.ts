import { 
  useListAppsV1NamespacedDeploymentQuery,
  useListAppsV1DeploymentForAllNamespacesQuery,
  useReadAppsV1NamespacedDeploymentQuery,
  useCreateAppsV1NamespacedDeploymentMutation,
  useReplaceAppsV1NamespacedDeploymentMutation,
  useDeleteAppsV1NamespacedDeploymentMutation
} from '@kubernetesjs/react'
import { usePreferredNamespace } from '../contexts/NamespaceContext'


export function useDeployments(namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  const allDeploymentsQuery = useListAppsV1DeploymentForAllNamespacesQuery({
    query: {},
  })

  const namespacedDeploymentsQuery = useListAppsV1NamespacedDeploymentQuery({
    path: { namespace: ns },
    query: {},
  })

  if (ns === '_all') {
    return allDeploymentsQuery
  } else {
    return namespacedDeploymentsQuery
  }
}

export function useDeployment(name: string, namespace?: string) {
  const { namespace: defaultNamespace } = usePreferredNamespace()
  const ns = namespace || defaultNamespace

  return useReadAppsV1NamespacedDeploymentQuery({
    path: { namespace: ns, name },
    query: {},
  })
}

export function useCreateDeployment() {
  return useCreateAppsV1NamespacedDeploymentMutation()
}

export function useUpdateDeployment() {
  return useReplaceAppsV1NamespacedDeploymentMutation()
}

export function useDeleteDeployment() {
  return useDeleteAppsV1NamespacedDeploymentMutation()
}

export function useScaleDeployment() {
  const updateDeployment = useReplaceAppsV1NamespacedDeploymentMutation()

  return updateDeployment
}
