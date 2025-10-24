import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { PolicyV1PodDisruptionBudget } from "@interweb/interwebjs"

export const createPDBsListData = (): PolicyV1PodDisruptionBudget[] => {
  return [
    {
      metadata: { 
        name: 'nginx-pdb', 
        namespace: 'default', 
        uid: 'pdb-1',
        labels: { app: 'nginx' }
      },
      spec: { 
        minAvailable: 1,
        selector: { matchLabels: { app: 'nginx' } }
      },
      status: { 
        currentHealthy: 3,
        desiredHealthy: 2,
        disruptionsAllowed: 1
      }
    },
    {
      metadata: { 
        name: 'redis-pdb', 
        namespace: 'default', 
        uid: 'pdb-2',
        labels: { app: 'redis' }
      },
      spec: { 
        maxUnavailable: 1,
        selector: { matchLabels: { app: 'redis' } }
      },
      status: { 
        currentHealthy: 2,
        desiredHealthy: 2,
        disruptionsAllowed: 0
      }
    },
    {
      metadata: { 
        name: 'web-pdb', 
        namespace: 'production', 
        uid: 'pdb-3',
        labels: { app: 'web' }
      },
      spec: { 
        minAvailable: 2,
        selector: { matchLabels: { app: 'web' } }
      },
      status: { 
        currentHealthy: 1,
        desiredHealthy: 3,
        disruptionsAllowed: 0
      }
    }
  ]
}

export const createPDBsList = (pdbs: PolicyV1PodDisruptionBudget[] = createPDBsListData()) => {
  return http.get(`${API_BASE}/apis/policy/v1/namespaces/:namespace/poddisruptionbudgets`, ({ params }) => {
    const namespace = params.namespace as string
    const namespacePDBs = pdbs.filter(pdb => pdb.metadata.namespace === namespace)
      
    return HttpResponse.json({
      apiVersion: 'policy/v1',
      kind: 'PodDisruptionBudgetList',
      items: namespacePDBs
    })
  })
}

export const createAllPDBsList = (pdbs: PolicyV1PodDisruptionBudget[] = createPDBsListData()) => {
  return http.get(`${API_BASE}/apis/policy/v1/poddisruptionbudgets`, () => {
    return HttpResponse.json({
      apiVersion: 'policy/v1',
      kind: 'PodDisruptionBudgetList',
      items: pdbs
    })
  })
}

// Error handlers
export const createPDBsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/policy/v1/namespaces/:namespace/poddisruptionbudgets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllPDBsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/policy/v1/poddisruptionbudgets`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Network error handler
export const createPDBsListNetworkError = () => {
  return http.get(`${API_BASE}/apis/policy/v1/namespaces/:namespace/poddisruptionbudgets`, () => {
    return HttpResponse.error()
  })
}

// Slow response handler for testing loading states
export const createPDBsListSlow = (pdbs: PolicyV1PodDisruptionBudget[] = createPDBsListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/policy/v1/namespaces/:namespace/poddisruptionbudgets`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespacePDBs = pdbs.filter(pdb => pdb.metadata.namespace === namespace)
      
    return HttpResponse.json({
      apiVersion: 'policy/v1',
      kind: 'PodDisruptionBudgetList',
      items: namespacePDBs
    })
  })
}

// Delete PDB handler
export const deletePDBHandler = () => {
  return http.delete(`${API_BASE}/apis/policy/v1/namespaces/:namespace/poddisruptionbudgets/:name`, () => {
    return HttpResponse.json({}, { status: 200 })
  })
}

// Delete PDB error handler
export const deletePDBErrorHandler = (status: number = 404, message: string = 'Deletion failed') => {
  return http.delete(`${API_BASE}/apis/policy/v1/namespaces/:namespace/poddisruptionbudgets/:name`, () => {
    return HttpResponse.json({ error: message }, { status })
  })
}
