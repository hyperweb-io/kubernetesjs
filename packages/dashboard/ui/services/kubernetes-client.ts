import { KubernetesClient } from 'kubernetesjs'

// Singleton instance
let client: KubernetesClient | null = null

export interface K8sConfig {
  endpoint: string
  token?: string
  namespace?: string
}

export function initializeClient(config: K8sConfig): KubernetesClient {
  client = new KubernetesClient({
    restEndpoint: config.endpoint,
    headers: config.token ? {
      'Authorization': `Bearer ${config.token}`
    } : undefined
  })
  return client
}

export function getClient(): KubernetesClient {
  if (!client) {
    // Default to local kubectl proxy
    client = new KubernetesClient({
      restEndpoint: 'http://localhost:8001'
    })
  }
  return client
}

// Helper functions for common operations
export async function listDeployments(namespace = 'default') {
  const k8s = getClient()
  try {
    const result = await k8s.listAppsV1NamespacedDeployment({
      path: { namespace }
    })
    return result.items || []
  } catch (error) {
    console.error('Error listing deployments:', error)
    return []
  }
}

export async function listServices(namespace = 'default') {
  const k8s = getClient()
  try {
    const result = await k8s.listCoreV1NamespacedService({
      path: { namespace }
    })
    return result.items || []
  } catch (error) {
    console.error('Error listing services:', error)
    return []
  }
}

export async function listSecrets(namespace = 'default') {
  const k8s = getClient()
  try {
    const result = await k8s.listCoreV1NamespacedSecret({
      path: { namespace }
    })
    return result.items || []
  } catch (error) {
    console.error('Error listing secrets:', error)
    return []
  }
}

export async function listConfigMaps(namespace = 'default') {
  const k8s = getClient()
  try {
    const result = await k8s.listCoreV1NamespacedConfigMap({
      path: { namespace }
    })
    return result.items || []
  } catch (error) {
    console.error('Error listing configmaps:', error)
    return []
  }
}

export async function listPods(namespace = 'default') {
  const k8s = getClient()
  try {
    const result = await k8s.listCoreV1NamespacedPod({
      path: { namespace }
    })
    return result.items || []
  } catch (error) {
    console.error('Error listing pods:', error)
    return []
  }
}