import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { V1Namespace } from "@kubernetesjs/ops"

export const createNamespacesListData = (): V1Namespace[] => {
  return [
    {
      metadata: { 
        name: 'default', 
        uid: 'ns-1',
        labels: { 'kubernetes.io/metadata.name': 'default' },
        creationTimestamp: new Date('2023-01-01T00:00:00Z')
      },
      spec: {},
      status: { phase: 'Active' }
    },
    {
      metadata: { 
        name: 'kube-system', 
        uid: 'ns-2',
        labels: { 'kubernetes.io/metadata.name': 'kube-system' },
        creationTimestamp: new Date('2023-01-01T00:00:00Z')
      },
      spec: {},
      status: { phase: 'Active' }
    },
    {
      metadata: { 
        name: 'kube-public', 
        uid: 'ns-3',
        labels: { 'kubernetes.io/metadata.name': 'kube-public' },
        creationTimestamp: new Date('2023-01-01T00:00:00Z')
      },
      spec: {},
      status: { phase: 'Active' }
    },
    {
      metadata: { 
        name: 'test-namespace', 
        uid: 'ns-4',
        labels: { 'kubernetes.io/metadata.name': 'test-namespace', 'environment': 'test' },
        creationTimestamp: new Date('2023-01-15T10:30:00Z')
      },
      spec: {},
      status: { phase: 'Active' }
    }
  ]
}

export const createNamespacesList = (namespaces: V1Namespace[] = createNamespacesListData()) => {
  return http.get(`${API_BASE}/api/v1/namespaces`, () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'NamespaceList',
      items: namespaces
    })
  })
}

// Error handlers
export const createNamespacesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/namespaces`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Network error handler
export const createNamespacesListNetworkError = () => {
  return http.get(`${API_BASE}/api/v1/namespaces`, () => {
    return HttpResponse.error()
  })
}

// Slow response handler for testing loading states
export const createNamespacesListSlow = (namespaces: V1Namespace[] = createNamespacesListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/api/v1/namespaces`, async () => {
    await new Promise(resolve => setTimeout(resolve, delay))
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'NamespaceList',
      items: namespaces
    })
  })
}

// Create namespace handler
export const createNamespace = () => {
  return http.post(`${API_BASE}/api/v1/namespaces`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: { 
        name: body.metadata?.name || 'new-namespace', 
        uid: 'new-ns-uid',
        creationTimestamp: new Date().toISOString()
      },
      spec: {},
      status: { phase: 'Active' }
    }, { status: 201 })
  })
}

// Get single namespace handler
export const getNamespace = (namespace: V1Namespace) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:name`, ({ params }) => {
    const name = params.name as string
    if (name === namespace.metadata.name) {
      return HttpResponse.json(namespace)
    }
    return HttpResponse.json({ error: 'Namespace not found' }, { status: 404 })
  })
}

// Delete namespace handler
export const deleteNamespace = () => {
  return http.delete(`${API_BASE}/api/v1/namespaces/:name`, () => {
    return HttpResponse.json({}, { status: 200 })
  })
}
