// Client-side API service for Kubernetes operations through our Next.js proxy

export interface Deployment {
  metadata: {
    name: string
    namespace: string
    creationTimestamp: string
    labels?: Record<string, string>
  }
  spec: {
    replicas: number
    selector: {
      matchLabels: Record<string, string>
    }
    template: {
      spec: {
        containers: Array<{
          name: string
          image: string
          ports?: Array<{
            containerPort: number
            protocol?: string
          }>
        }>
      }
    }
  }
  status: {
    replicas?: number
    updatedReplicas?: number
    readyReplicas?: number
    availableReplicas?: number
    conditions?: Array<{
      type: string
      status: string
      reason?: string
      message?: string
    }>
  }
}

export interface DeploymentList {
  items: Deployment[]
}

export interface Service {
  metadata: {
    name: string
    namespace: string
    creationTimestamp: string
    labels?: Record<string, string>
  }
  spec: {
    type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'
    selector?: Record<string, string>
    ports?: Array<{
      name?: string
      protocol: string
      port: number
      targetPort: number | string
      nodePort?: number
    }>
    clusterIP?: string
    externalName?: string
    externalIPs?: string[]
  }
  status?: {
    loadBalancer?: {
      ingress?: Array<{
        ip?: string
        hostname?: string
      }>
    }
  }
}

export interface ServiceList {
  items: Service[]
}

export interface Secret {
  metadata: {
    name: string
    namespace: string
    creationTimestamp: string
    labels?: Record<string, string>
  }
  type: string
  data?: Record<string, string> // base64 encoded
  stringData?: Record<string, string> // plain text (for creation)
  immutable?: boolean
}

export interface SecretList {
  items: Secret[]
}

export interface ConfigMap {
  metadata: {
    name: string
    namespace: string
    creationTimestamp: string
    labels?: Record<string, string>
  }
  data?: Record<string, string>
  binaryData?: Record<string, string> // base64 encoded
  immutable?: boolean
}

export interface ConfigMapList {
  items: ConfigMap[]
}

class K8sAPIClient {
  private baseUrl = '/api/k8s'

  async request<T>(path: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('K8s API request failed:', error)
      throw error
    }
  }

  // Deployments
  async listDeployments(namespace: string = 'default'): Promise<DeploymentList> {
    return this.request<DeploymentList>(`/apis/apps/v1/namespaces/${namespace}/deployments`)
  }

  async getDeployment(namespace: string, name: string): Promise<Deployment> {
    return this.request<Deployment>(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`)
  }

  async scaleDeployment(namespace: string, name: string, replicas: number): Promise<Deployment> {
    const patch = {
      spec: {
        replicas: replicas
      }
    }
    return this.request<Deployment>(
      `/apis/apps/v1/namespaces/${namespace}/deployments/${name}`,
      {
        method: 'PATCH',
        body: JSON.stringify(patch),
        headers: {
          'Content-Type': 'application/strategic-merge-patch+json',
        },
      }
    )
  }

  async deleteDeployment(namespace: string, name: string): Promise<any> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`, {
      method: 'DELETE',
    })
  }

  // Services
  async listServices(namespace: string = 'default'): Promise<ServiceList> {
    return this.request<ServiceList>(`/api/v1/namespaces/${namespace}/services`)
  }

  async getService(namespace: string, name: string): Promise<Service> {
    return this.request<Service>(`/api/v1/namespaces/${namespace}/services/${name}`)
  }

  async deleteService(namespace: string, name: string): Promise<any> {
    return this.request(`/api/v1/namespaces/${namespace}/services/${name}`, {
      method: 'DELETE',
    })
  }

  // Secrets
  async listSecrets(namespace: string = 'default'): Promise<SecretList> {
    return this.request<SecretList>(`/api/v1/namespaces/${namespace}/secrets`)
  }

  async getSecret(namespace: string, name: string): Promise<Secret> {
    return this.request<Secret>(`/api/v1/namespaces/${namespace}/secrets/${name}`)
  }

  async createSecret(namespace: string, secret: Secret): Promise<Secret> {
    return this.request<Secret>(`/api/v1/namespaces/${namespace}/secrets`, {
      method: 'POST',
      body: JSON.stringify(secret),
    })
  }

  async deleteSecret(namespace: string, name: string): Promise<any> {
    return this.request(`/api/v1/namespaces/${namespace}/secrets/${name}`, {
      method: 'DELETE',
    })
  }

  // ConfigMaps
  async listConfigMaps(namespace: string = 'default'): Promise<ConfigMapList> {
    return this.request<ConfigMapList>(`/api/v1/namespaces/${namespace}/configmaps`)
  }

  async getConfigMap(namespace: string, name: string): Promise<ConfigMap> {
    return this.request<ConfigMap>(`/api/v1/namespaces/${namespace}/configmaps/${name}`)
  }

  async updateConfigMap(namespace: string, name: string, configMap: ConfigMap): Promise<ConfigMap> {
    return this.request<ConfigMap>(`/api/v1/namespaces/${namespace}/configmaps/${name}`, {
      method: 'PUT',
      body: JSON.stringify(configMap),
    })
  }

  async deleteConfigMap(namespace: string, name: string): Promise<any> {
    return this.request(`/api/v1/namespaces/${namespace}/configmaps/${name}`, {
      method: 'DELETE',
    })
  }

  // Pods
  async listPods(namespace: string = 'default') {
    return this.request(`/api/v1/namespaces/${namespace}/pods`)
  }
}

export const k8sAPI = new K8sAPIClient()