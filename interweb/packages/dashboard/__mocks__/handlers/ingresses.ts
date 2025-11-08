import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { NetworkingK8sIoV1Ingress } from "@interweb/interwebjs"

export const createIngressesListData = (): NetworkingK8sIoV1Ingress[] => {
  return [
    {
      metadata: {
        name: 'web-ingress',
        namespace: 'default',
        uid: 'ingress-1',
        labels: { app: 'web' },
        creationTimestamp: '2024-01-15T10:30:00Z',
        annotations: {
          'kubernetes.io/ingress.class': 'nginx'
        }
      },
      spec: {
        ingressClassName: 'nginx',
        rules: [
          {
            host: 'example.com',
            http: {
              paths: [
                {
                  path: '/',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'web-service',
                      port: { number: 80 }
                    }
                  }
                },
                {
                  path: '/api',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'api-service',
                      port: { number: 8080 }
                    }
                  }
                }
              ]
            }
          }
        ],
        tls: [
          {
            hosts: ['example.com'],
            secretName: 'example-tls'
          }
        ]
      },
      status: {
        loadBalancer: {
          ingress: [
            {
              ip: '192.168.1.100'
            }
          ]
        }
      }
    },
    {
      metadata: {
        name: 'api-ingress',
        namespace: 'default',
        uid: 'ingress-2',
        labels: { app: 'api' },
        creationTimestamp: '2024-01-15T11:00:00Z'
      },
      spec: {
        ingressClassName: 'traefik',
        rules: [
          {
            host: 'api.example.com',
            http: {
              paths: [
                {
                  path: '/v1',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'api-v1-service',
                      port: { number: 3000 }
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      status: {
        loadBalancer: {
          ingress: []
        }
      }
    },
    {
      metadata: {
        name: 'admin-ingress',
        namespace: 'kube-system',
        uid: 'ingress-3',
        labels: { app: 'admin' },
        creationTimestamp: '2024-01-15T12:00:00Z'
      },
      spec: {
        ingressClassName: 'istio',
        rules: [
          {
            host: 'admin.example.com',
            http: {
              paths: [
                {
                  path: '/admin',
                  pathType: 'Prefix',
                  backend: {
                    service: {
                      name: 'admin-service',
                      port: { number: 9000 }
                    }
                  }
                }
              ]
            }
          }
        ],
        tls: [
          {
            hosts: ['admin.example.com'],
            secretName: 'admin-tls'
          }
        ]
      },
      status: {
        loadBalancer: {
          ingress: [
            {
              hostname: 'admin-lb.example.com'
            }
          ]
        }
      }
    }
  ]
}

export const createIngressesList = (ingresses: NetworkingK8sIoV1Ingress[] = createIngressesListData()) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/ingresses`, ({ params, request }) => {
    const namespace = params.namespace as string
    const namespaceIngresses = ingresses.filter(ing => ing.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'networking.k8s.io/v1',
      kind: 'IngressList',
      items: namespaceIngresses
    })
  })
}

export const createAllIngressesList = (ingresses: NetworkingK8sIoV1Ingress[] = createIngressesListData()) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/ingresses`, () => {
    return HttpResponse.json({
      apiVersion: 'networking.k8s.io/v1',
      kind: 'IngressList',
      items: ingresses
    })
  })
}

// Error handlers
export const createIngressesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/ingresses`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllIngressesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/ingresses`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

// Network error handler
export const createIngressesListNetworkError = () => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/ingresses`, () => {
    return HttpResponse.error()
  })
}

// Slow response handler for testing loading states
export const createIngressesListSlow = (ingresses: NetworkingK8sIoV1Ingress[] = createIngressesListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/ingresses`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespaceIngresses = ingresses.filter(ing => ing.metadata.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'networking.k8s.io/v1',
      kind: 'IngressList',
      items: namespaceIngresses
    })
  })
}

// Ingress by name handler
export const createIngressByName = (ingresses: NetworkingK8sIoV1Ingress[] = createIngressesListData()) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/ingresses/:name`, ({ params }) => {
    const namespace = params.namespace as string
    const name = params.name as string
    const ingress = ingresses.find(ing => ing.metadata.namespace === namespace && ing.metadata.name === name)

    if (!ingress) {
      return HttpResponse.json(
        { error: 'Ingress not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(ingress)
  })
}

// Ingress details handler (alias for createIngressByName)
export const createIngressDetails = (ingress: NetworkingK8sIoV1Ingress) => {
  return http.get(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/ingresses/:name`, ({ params }) => {
    if (params.name === ingress.metadata?.name && params.namespace === ingress.metadata?.namespace) {
      return HttpResponse.json(ingress)
    }
    return HttpResponse.json({ error: 'Ingress not found' }, { status: 404 })
  })
}

// Delete Ingress handler
export const createIngressDelete = () => {
  return http.delete(`${API_BASE}/apis/networking.k8s.io/v1/namespaces/:namespace/ingresses/:name`, () => {
    return HttpResponse.json({})
  })
}
