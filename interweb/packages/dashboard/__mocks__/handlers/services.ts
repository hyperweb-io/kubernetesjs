import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"
import { V1Service } from "@interweb/interwebjs"

export const createServicesListData = (): V1Service[] => {
  return [
    {
      metadata: {
        name: 'test-service-1',
        namespace: 'default',
        uid: 'service-1'
      },
      spec: {
        type: 'ClusterIP',
        ports: [
          {
            port: 80,
            targetPort: 8080,
            protocol: 'TCP'
          }
        ],
        selector: {
          app: 'test-app-1'
        }
      },
      status: {
        loadBalancer: {}
      }
    },
    {
      metadata: {
        name: 'test-service-2',
        namespace: 'default',
        uid: 'service-2'
      },
      spec: {
        type: 'LoadBalancer',
        ports: [
          {
            port: 443,
            targetPort: 8443,
            protocol: 'TCP'
          }
        ],
        selector: {
          app: 'test-app-2'
        }
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
        name: 'test-service-3',
        namespace: 'kube-system',
        uid: 'service-3'
      },
      spec: {
        type: 'NodePort',
        ports: [
          {
            port: 3000,
            targetPort: 3000,
            nodePort: 30080,
            protocol: 'TCP'
          }
        ],
        selector: {
          app: 'test-app-3'
        }
      },
      status: {
        loadBalancer: {}
      }
    }
  ]
}

export const createServicesList = (services: V1Service[] = createServicesListData()) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/services`, ({ params }) => {
    const namespace = params.namespace as string
    const namespaceServices = services.filter(service => service.metadata?.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ServiceList',
      items: namespaceServices
    })
  })
}

export const createAllServicesList = (services: V1Service[] = createServicesListData()) => {
  return http.get(`${API_BASE}/api/v1/services`, () => {
    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ServiceList',
      items: services
    })
  })
}

export const createServicesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/services`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createAllServicesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/v1/services`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createServicesListSlow = (services: V1Service[] = createServicesListData(), delay: number = 1000) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/services`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    const namespace = params.namespace as string
    const namespaceServices = services.filter(service => service.metadata?.namespace === namespace)

    return HttpResponse.json({
      apiVersion: 'v1',
      kind: 'ServiceList',
      items: namespaceServices
    })
  })
}

export const deleteServiceHandler = (name: string, namespace: string) => {
  return http.delete(`${API_BASE}/api/v1/namespaces/:namespace/services/:name`, ({ params }) => {
    if (params.name === name && params.namespace === namespace) {
      return HttpResponse.json({}, { status: 200 })
    }
    return HttpResponse.json({ error: 'Service not found' }, { status: 404 })
  })
}

export const deleteServiceErrorHandler = (name: string, namespace: string, status: number = 500, message: string = 'Deletion failed') => {
  return http.delete(`${API_BASE}/api/v1/namespaces/:namespace/services/:name`, ({ params }) => {
    if (params.name === name && params.namespace === namespace) {
      return HttpResponse.json({ error: message }, { status })
    }
    return HttpResponse.json({ error: 'Service not found' }, { status: 404 })
  })
}

export const createServiceHandler = (service: V1Service) => {
  return http.post(`${API_BASE}/api/v1/namespaces/:namespace/services`, () => {
    return HttpResponse.json(service, { status: 201 })
  })
}

export const createServiceErrorHandler = (status: number = 400, message: string = 'Creation failed') => {
  return http.post(`${API_BASE}/api/v1/namespaces/:namespace/services`, () => {
    return HttpResponse.json({ error: message }, { status })
  })
}

export const createServicesListNetworkError = () => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/services`, () => {
    return HttpResponse.error()
  })
}

// Get single service handler
export const getService = (service: V1Service) => {
  return http.get(`${API_BASE}/api/v1/namespaces/:namespace/services/:name`, ({ params }) => {
    const name = params.name as string
    const namespace = params.namespace as string
    if (name === service.metadata.name && namespace === service.metadata.namespace) {
      return HttpResponse.json(service)
    }
    return HttpResponse.json({ error: 'Service not found' }, { status: 404 })
  })
}

// Update service handler
export const updateService = () => {
  return http.put(`${API_BASE}/api/v1/namespaces/:namespace/services/:name`, async ({ request, params }) => {
    const body = await request.json() as V1Service
    const name = params.name as string
    const namespace = params.namespace as string
    
    return HttpResponse.json({
      ...body,
      metadata: {
        ...body.metadata,
        name,
        namespace,
        resourceVersion: '12345',
        uid: `service-${name}`
      }
    })
  })
}

// Update service error handler
export const updateServiceError = (status: number = 500, message: string = 'Update failed') => {
  return http.put(`${API_BASE}/api/v1/namespaces/:namespace/services/:name`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}