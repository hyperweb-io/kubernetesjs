import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { Endpoints } from "@kubernetesjs/ops"

export const createEndpointsListData = (): Endpoints[] => {
  return [
    {
      metadata: {
        name: 'web-service',
        namespace: 'default',
        uid: 'ep-1',
        labels: { app: 'web' },
        creationTimestamp: '2024-01-15T10:30:00Z'
      },
      subsets: [
        {
          addresses: [
            { ip: '10.244.1.10' },
            { ip: '10.244.1.11' }
          ],
          ports: [
            { name: 'http', port: 8080, protocol: 'TCP' },
            { name: 'metrics', port: 9090, protocol: 'TCP' }
          ]
        }
      ]
    },
    {
      metadata: {
        name: 'api-service',
        namespace: 'default',
        uid: 'ep-2',
        labels: { app: 'api' },
        creationTimestamp: '2024-01-15T11:00:00Z'
      },
      subsets: [
        {
          addresses: [
            { ip: '10.244.2.10' },
            { ip: '10.244.2.11' },
            { ip: '10.244.2.12' }
          ],
          ports: [
            { name: 'http', port: 3000, protocol: 'TCP' }
          ]
        }
      ]
    },
    {
      metadata: {
        name: 'db-service',
        namespace: 'kube-system',
        uid: 'ep-3',
        labels: { app: 'database' },
        creationTimestamp: '2024-01-15T12:00:00Z'
      },
      subsets: [] // Empty endpoints
    },
    {
      metadata: {
        name: 'kubernetes',
        namespace: 'default',
        uid: 'ep-4',
        labels: { component: 'apiserver' },
        creationTimestamp: '2024-01-15T09:00:00Z'
      },
      subsets: [
        {
          addresses: [
            { ip: '192.168.1.100' }
          ],
          ports: [
            { name: 'https', port: 6443, protocol: 'TCP' }
          ]
        }
      ]
    }
  ]
}

export const createEndpointsList = (endpoints: Endpoints[] = createEndpointsListData()) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/endpoints`, ({ params, request }) => {
    const namespace = params.namespace as string
    const namespaceEndpoints = endpoints.filter(ep => ep.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'EndpointsList',
      items: namespaceEndpoints
    })
  })
}

export const createAllEndpointsList = (endpoints: Endpoints[] = createEndpointsListData()) => {
  return http.get(`${API_BASE}/api/v1/endpoints`, () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'EndpointsList',
      items: endpoints
    })
  })
}

// Error handlers
export const createEndpointsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/endpoints`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllEndpointsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/endpoints`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Network error handler
export const createEndpointsListNetworkError = () => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/endpoints`, () => {
    return HttpResponse.error()
  })
}

// Slow response handler for testing loading states
export const createEndpointsListSlow = (endpoints: Endpoints[] = createEndpointsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/endpoints`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespaceEndpoints = endpoints.filter(ep => ep.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'EndpointsList',
      items: namespaceEndpoints
    })
  })
}

// Endpoint by name handler
export const createEndpointByName = (endpoints: Endpoints[] = createEndpointsListData()) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/endpoints/:name`, ({ params }) => {
    const namespace = params.namespace as string
    const name = params.name as string
    const endpoint = endpoints.find(ep => ep.metadata.namespace === namespace && ep.metadata.name === name)

    if (!endpoint) {
      return HttpResponse.json(
        { error: 'Endpoints not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(endpoint)
  })
}

// Endpoint details handler (alias for createEndpointByName)
export const createEndpointDetails = (endpoint: Endpoints) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/endpoints/:name`, ({ params }) => {
    if (params.name === endpoint.metadata?.name && params.namespace === endpoint.metadata?.namespace) {
      return HttpResponse.json(endpoint)
    }
    return HttpResponse.json({ error: 'Endpoints not found' }, { status: 404 })
  })
}

// Delete Endpoint handler
export const createEndpointDelete = () => {
  return http.delete(`${API_BASE}/api/v1/namespaces/:namespace/endpoints/:name`, () => {
    return HttpResponse.json({})
  })
}
