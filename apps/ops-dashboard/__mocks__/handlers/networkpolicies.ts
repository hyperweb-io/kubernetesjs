import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { NetworkingK8sIoV1NetworkPolicy } from "@kubernetesjs/ops"

export const createNetworkPoliciesListData = (): NetworkingK8sIoV1NetworkPolicy[] => {
  return [
    {
      metadata: {
        name: 'web-policy',
        namespace: 'default',
        uid: 'netpol-1',
        labels: { app: 'web' },
        creationTimestamp: '2024-01-15T10:30:00Z'
      },
      spec: {
        podSelector: {
          matchLabels: {
            app: 'web'
          }
        },
        policyTypes: ['Ingress'],
        ingress: [
          {
            from: [
              {
                podSelector: {
                  matchLabels: {
                    app: 'frontend'
                  }
                }
              }
            ],
            ports: [
              {
                protocol: 'TCP',
                port: 8080
              }
            ]
          }
        ]
      }
    },
    {
      metadata: {
        name: 'api-policy',
        namespace: 'default',
        uid: 'netpol-2',
        labels: { app: 'api' },
        creationTimestamp: '2024-01-15T11:00:00Z'
      },
      spec: {
        podSelector: {
          matchLabels: {
            app: 'api'
          }
        },
        policyTypes: ['Ingress', 'Egress'],
        ingress: [
          {
            from: [
              {
                podSelector: {
                  matchLabels: {
                    app: 'web'
                  }
                }
              }
            ],
            ports: [
              {
                protocol: 'TCP',
                port: 3000
              }
            ]
          }
        ],
        egress: [
          {
            to: [
              {
                podSelector: {
                  matchLabels: {
                    app: 'database'
                  }
                }
              }
            ],
            ports: [
              {
                protocol: 'TCP',
                port: 5432
              }
            ]
          }
        ]
      }
    },
    {
      metadata: {
        name: 'deny-all-policy',
        namespace: 'kube-system',
        uid: 'netpol-3',
        labels: { app: 'security' },
        creationTimestamp: '2024-01-15T12:00:00Z'
      },
      spec: {
        podSelector: {},
        policyTypes: ['Ingress', 'Egress']
      }
    }
  ]
}

export const createNetworkPoliciesList = (policies: NetworkingK8sIoV1NetworkPolicy[] = createNetworkPoliciesListData()) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/networkpolicies`, ({ params, request }) => {
    const namespace = params.namespace as string
    const namespacePolicies = policies.filter(pol => pol.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'networking.k8s.io/v1',
      kind: 'NetworkPolicyList',
      items: namespacePolicies
    })
  })
}

export const createAllNetworkPoliciesList = (policies: NetworkingK8sIoV1NetworkPolicy[] = createNetworkPoliciesListData()) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/networkpolicies`, () => {
    return HttpResponse.json({
      apiVersion: 'networking.k8s.io/v1',
      kind: 'NetworkPolicyList',
      items: policies
    })
  })
}

// Error handlers
export const createNetworkPoliciesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/networkpolicies`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllNetworkPoliciesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/networkpolicies`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Network error handler
export const createNetworkPoliciesListNetworkError = () => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/networkpolicies`, () => {
    return HttpResponse.error()
  })
}

// Slow response handler for testing loading states
export const createNetworkPoliciesListSlow = (policies: NetworkingK8sIoV1NetworkPolicy[] = createNetworkPoliciesListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/networkpolicies`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespacePolicies = policies.filter(pol => pol.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'networking.k8s.io/v1',
      kind: 'NetworkPolicyList',
      items: namespacePolicies
    })
  })
}

// NetworkPolicy by name handler
export const createNetworkPolicyByName = (policies: NetworkingK8sIoV1NetworkPolicy[] = createNetworkPoliciesListData()) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/networkpolicies/:name`, ({ params }) => {
    const namespace = params.namespace as string
    const name = params.name as string
    const policy = policies.find(pol => pol.metadata.namespace === namespace && pol.metadata.name === name)

    if (!policy) {
      return HttpResponse.json(
        { error: 'NetworkPolicy not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(policy)
  })
}

// NetworkPolicy details handler (alias for createNetworkPolicyByName)
export const createNetworkPolicyDetails = (policy: NetworkingK8sIoV1NetworkPolicy) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/networkpolicies/:name`, ({ params }) => {
    if (params.name === policy.metadata?.name && params.namespace === policy.metadata?.namespace) {
      return HttpResponse.json(policy)
    }
    return HttpResponse.json({ error: 'NetworkPolicy not found' }, { status: 404 })
  })
}

// Delete NetworkPolicy handler
export const createNetworkPolicyDelete = () => {
  return http.delete(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/networkpolicies/:name`, () => {
    return HttpResponse.json({})
  })
}
