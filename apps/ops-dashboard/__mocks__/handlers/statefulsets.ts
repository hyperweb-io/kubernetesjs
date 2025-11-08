import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { V1StatefulSet } from "@kubernetesjs/ops"

export const createStatefulSetsListData = (): V1StatefulSet[] => {
  return [
    {
      metadata: {
        name: 'web-statefulset',
        namespace: 'default',
        uid: 'ss-1',
        labels: { app: 'web' }
      },
      spec: {
        serviceName: 'web-service',
        replicas: 3,
        selector: { matchLabels: { app: 'web' } },
        template: {
          metadata: { labels: { app: 'web' } },
          spec: { containers: [{ name: 'web', image: 'nginx:1.14.2' }] }
        }
      },
      status: {
        replicas: 3,
        readyReplicas: 3,
        currentReplicas: 3,
        updatedReplicas: 3
      }
    },
    {
      metadata: {
        name: 'db-statefulset',
        namespace: 'default',
        uid: 'ss-2',
        labels: { app: 'database' }
      },
      spec: {
        serviceName: 'db-service',
        replicas: 1,
        selector: { matchLabels: { app: 'database' } },
        template: {
          metadata: { labels: { app: 'database' } },
          spec: { containers: [{ name: 'db', image: 'postgres:13' }] }
        }
      },
      status: {
        replicas: 1,
        readyReplicas: 1,
        currentReplicas: 1,
        updatedReplicas: 1
      }
    },
    {
      metadata: {
        name: 'pending-statefulset',
        namespace: 'kube-system',
        uid: 'ss-3',
        labels: { app: 'pending' }
      },
      spec: {
        serviceName: 'pending-service',
        replicas: 2,
        selector: { matchLabels: { app: 'pending' } },
        template: {
          metadata: { labels: { app: 'pending' } },
          spec: { containers: [{ name: 'pending', image: 'pending:latest' }] }
        }
      },
      status: {
        replicas: 0,
        readyReplicas: 0,
        currentReplicas: 0,
        updatedReplicas: 0
      }
    }
  ]
}

export const createStatefulSetsList = (statefulSets: V1StatefulSet[] = createStatefulSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets`, ({ params, request }) => {
    const namespace = params.namespace as string
    const namespaceStatefulSets = statefulSets.filter(ss => ss.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'StatefulSetList',
      items: namespaceStatefulSets
    })
  })
}

// Alternative handler that matches any statefulsets request
export const createStatefulSetsListAny = (statefulSets: V1StatefulSet[] = createStatefulSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets`, ({ params, request }) => {
    const namespace = params.namespace as string
    const namespaceStatefulSets = statefulSets.filter(ss => ss.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'StatefulSetList',
      items: namespaceStatefulSets
    })
  })
}

export const createAllStatefulSetsList = (statefulSets: V1StatefulSet[] = createStatefulSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/statefulsets`, () => {
    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'StatefulSetList',
      items: statefulSets
    })
  })
}

// Error handlers
export const createStatefulSetsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllStatefulSetsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/apps/v1/statefulsets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Network error handler
export const createStatefulSetsListNetworkError = () => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets`, () => {
    return HttpResponse.error()
  })
}

// Slow response handler for testing loading states
export const createStatefulSetsListSlow = (statefulSets: V1StatefulSet[] = createStatefulSetsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespaceStatefulSets = statefulSets.filter(ss => ss.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'apps/v1',
      kind: 'StatefulSetList',
      items: namespaceStatefulSets
    })
  })
}

// StatefulSet by name handler
export const createStatefulSetByName = (statefulSets: V1StatefulSet[] = createStatefulSetsListData()) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets/:name`, ({ params }) => {
    const namespace = params.namespace as string
    const name = params.name as string
    const statefulSet = statefulSets.find(ss => ss.metadata.namespace === namespace && ss.metadata.name === name)

    if (!statefulSet) {
      return HttpResponse.json(
        { error: 'StatefulSet not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(statefulSet)
  })
}

// StatefulSet details handler (alias for createStatefulSetByName)
export const createStatefulSetDetails = (statefulSet: V1StatefulSet) => {
  return http.get(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets/:name`, ({ params }) => {
    if (params.name === statefulSet.metadata?.name && params.namespace === statefulSet.metadata?.namespace) {
      return HttpResponse.json(statefulSet)
    }
    return HttpResponse.json({ error: 'StatefulSet not found' }, { status: 404 })
  })
}

// Scale StatefulSet handler
export const createStatefulSetScale = () => {
  return http.put(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets/:name/scale`, () => {
    return HttpResponse.json({
      apiVersion: 'autoscaling/v1',
      kind: 'Scale',
      metadata: { name: 'test', namespace: 'default' },
      spec: { replicas: 1 }
    })
  })
}

// Delete StatefulSet handler
export const createStatefulSetDelete = () => {
  return http.delete(`${API_BASE}/apis/apps/v1/namespaces/:namespace/statefulsets/:name`, () => {
    return HttpResponse.json({})
  })
}
