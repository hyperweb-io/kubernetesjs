import { InterwebClient } from '@interweb/interwebjs'

// Singleton instance
let client: InterwebClient | null = null
let authHeaders: any = {}

export interface K8sConfig {
  endpoint: string
  token?: string
  namespace?: string
}

export function initializeClient(config: K8sConfig): InterwebClient {
  client = new InterwebClient({
    restEndpoint: config.endpoint,
    kubeconfig: '', // Add required properties
    namespace: config.namespace || 'default',
    context: 'default'
  })
  
  // Store auth headers for later use
  if (config.token) {
    authHeaders = {
      'Authorization': `Bearer ${config.token}`
    }
  }
  
  return client
}

export function getClient(): InterwebClient {
  if (!client) {
    // Default to local kubectl proxy
    client = new InterwebClient({
      restEndpoint: 'http://localhost:8001',
      kubeconfig: '',
      namespace: 'default',
      context: 'default'
    })
  }
  return client
}

// Helper functions for common operations
export async function listDeployments(namespace = 'default') {
  const k8s = getClient()
  try {
    const result = await k8s.listAppsV1NamespacedDeployment({
      path: { namespace },
      query: {}
    }, { headers: authHeaders })
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
      path: { namespace },
      query: {}
    }, { headers: authHeaders })
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
      path: { namespace },
      query: {}
    }, { headers: authHeaders })
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
      path: { namespace },
      query: {}
    }, { headers: authHeaders })
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
      path: { namespace },
      query: {}
    }, { headers: authHeaders })
    return result.items || []
  } catch (error) {
    console.error('Error listing pods:', error)
    return []
  }
}
