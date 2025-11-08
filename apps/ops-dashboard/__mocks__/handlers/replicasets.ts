import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { V1ReplicaSet } from "@kubernetesjs/ops"

export const createReplicaSetsListData = (): V1ReplicaSet[] => {
  return [
    {
      metadata: { 
        name: 'nginx-deployment-1234567890', 
        namespace: 'default', 
        uid: 'rs-1',
        labels: { 
          app: 'nginx',
          'pod-template-hash': '1234567890'
        },
        ownerReferences: [{
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: 'nginx-deployment',
          uid: 'deploy-1',
          controller: true,
          blockOwnerDeletion: true
        }]
      },
      spec: { 
        replicas: 3,
        selector: { matchLabels: { app: 'nginx', 'pod-template-hash': '1234567890' } },
        template: {
          metadata: { labels: { app: 'nginx', 'pod-template-hash': '1234567890' } },
          spec: { containers: [{ name: 'nginx', image: 'nginx:1.14.2' }] }
        }
      },
      status: { 
        replicas: 3,
        readyReplicas: 3,
        availableReplicas: 3,
        observedGeneration: 1
      }
    },
    {
      metadata: { 
        name: 'redis-deployment-abcdefghij', 
        namespace: 'default', 
        uid: 'rs-2',
        labels: { 
          app: 'redis',
          'pod-template-hash': 'abcdefghij'
        },
        ownerReferences: [{
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: 'redis-deployment',
          uid: 'deploy-2',
          controller: true,
          blockOwnerDeletion: true
        }]
      },
      spec: { 
        replicas: 1,
        selector: { matchLabels: { app: 'redis', 'pod-template-hash': 'abcdefghij' } },
        template: {
          metadata: { labels: { app: 'redis', 'pod-template-hash': 'abcdefghij' } },
          spec: { containers: [{ name: 'redis', image: 'redis:5.0.3-alpine' }] }
        }
      },
      status: { 
        replicas: 1,
        readyReplicas: 1,
        availableReplicas: 1,
        observedGeneration: 1
      }
    },
    {
      metadata: { 
        name: 'orphaned-replicaset', 
        namespace: 'default', 
        uid: 'rs-3',
        labels: { 
          app: 'orphaned'
        }
      },
      spec: { 
        replicas: 0,
        selector: { matchLabels: { app: 'orphaned' } },
        template: {
          metadata: { labels: { app: 'orphaned' } },
          spec: { containers: [{ name: 'orphaned', image: 'orphaned:latest' }] }
        }
      },
      status: { 
        replicas: 0,
        readyReplicas: 0,
        availableReplicas: 0,
        observedGeneration: 1
      }
    }
  ]
}

export const createReplicaSetsList = (replicaSets: V1ReplicaSet[] = createReplicaSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets`, ({ params }) => {
    const namespace = params.namespace as string
    const namespaceReplicaSets = replicaSets.filter(rs => rs.metadata.namespace === namespace)
      
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'ReplicaSetList',
      items: namespaceReplicaSets
    })
  })
}

export const createAllReplicaSetsList = (replicaSets: V1ReplicaSet[] = createReplicaSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/replicasets`, () => {
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'ReplicaSetList',
      items: replicaSets
    })
  })
}

// Error handlers
export const createReplicaSetsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllReplicaSetsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/apps/v1/replicasets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Network error handler
export const createReplicaSetsListNetworkError = () => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets`, () => {
    return HttpResponse.error()
  })
}

// Slow response handler for testing loading states
export const createReplicaSetsListSlow = (replicaSets: V1ReplicaSet[] = createReplicaSetsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespaceReplicaSets = replicaSets.filter(rs => rs.metadata.namespace === namespace)
      
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'ReplicaSetList',
      items: namespaceReplicaSets
    })
  })
}

// Scale handlers
export const createReplicaSetScale = () => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets/:name/scale`, ({ params, request }) => {
    const namespace = params.namespace as string
    const name = params.name as string
    
    return HttpResponse.json({
      apiVersion: 'autoscaling/v1',
      kind: 'Scale',
      metadata: {
        name,
        namespace
      },
      spec: {
        replicas: 5
      },
      status: {
        replicas: 5,
        selector: { app: 'nginx' }
      }
    })
  })
}

export const createReplicaSetScaleError = (status: number = 500, message: string = 'Scale failed') => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets/:name/scale`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Delete handlers
export const createReplicaSetDelete = () => {
  return http.delete(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets/:name`, ({ params }) => {
    const namespace = params.namespace as string
    const name = params.name as string
    
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'ReplicaSet',
      metadata: {
        name,
        namespace,
        deletionTimestamp: new Date().toISOString()
      }
    })
  })
}

export const createReplicaSetDeleteError = (status: number = 500, message: string = 'Delete failed') => {
  return http.delete(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets/:name`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Get single replicaset handler
export const getReplicaSet = (replicaSet: V1ReplicaSet) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets/:name`, ({ params }) => {
    const name = params.name as string
    const namespace = params.namespace as string
    if (name === replicaSet.metadata?.name && namespace === replicaSet.metadata?.namespace) {
      return HttpResponse.json(replicaSet)
    }
    return HttpResponse.json({ error: 'ReplicaSet not found' }, { status: 404 })
  })
}

// Update replicaset handler
export const updateReplicaSet = () => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets/:name`, async ({ request, params }) => {
    const body = await request.json() as V1ReplicaSet
    const name = params.name as string
    const namespace = params.namespace as string
    
    return HttpResponse.json({
      ...body,
      metadata: {
        ...body.metadata,
        name,
        namespace,
        resourceVersion: '12345',
        uid: `rs-${name}`
      }
    })
  })
}

// Update replicaset error handler
export const updateReplicaSetError = (status: number = 500, message: string = 'Update failed') => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/replicasets/:name`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}
