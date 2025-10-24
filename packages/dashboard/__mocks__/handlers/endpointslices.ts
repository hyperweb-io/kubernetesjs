import { http, HttpResponse } from 'msw'
import { type DiscoveryK8sIoV1EndpointSlice as EndpointSlice } from '@interweb/interwebjs'

export function createEndpointSlicesListData(): EndpointSlice[] {
  return [
    {
      apiVersion: 'discovery.k8s.io/v1',
      kind: 'EndpointSlice',
      metadata: {
        name: 'web-service-slice-1',
        namespace: 'default',
        labels: {
          'kubernetes.io/service-name': 'web-service'
        },
        creationTimestamp: '2024-01-15T10:30:00Z'
      },
      addressType: 'IPv4',
      endpoints: [
        {
          addresses: ['10.244.1.5'],
          conditions: { ready: true }
        },
        {
          addresses: ['10.244.1.6'],
          conditions: { ready: true }
        }
      ],
      ports: [
        { name: 'http', port: 80, protocol: 'TCP' },
        { name: 'https', port: 443, protocol: 'TCP' }
      ]
    },
    {
      apiVersion: 'discovery.k8s.io/v1',
      kind: 'EndpointSlice',
      metadata: {
        name: 'api-service-slice-1',
        namespace: 'default',
        labels: {
          'kubernetes.io/service-name': 'api-service'
        },
        creationTimestamp: '2024-01-15T10:30:00Z'
      },
      addressType: 'IPv4',
      endpoints: [
        {
          addresses: ['10.244.2.3'],
          conditions: { ready: true }
        }
      ],
      ports: [
        { name: 'api', port: 8080, protocol: 'TCP' }
      ]
    },
    {
      apiVersion: 'discovery.k8s.io/v1',
      kind: 'EndpointSlice',
      metadata: {
        name: 'db-service-slice-1',
        namespace: 'default',
        labels: {
          'kubernetes.io/service-name': 'db-service'
        },
        creationTimestamp: '2024-01-15T10:30:00Z'
      },
      addressType: 'IPv4',
      endpoints: [
        {
          addresses: ['10.244.3.1'],
          conditions: { ready: false }
        }
      ],
      ports: [
        { name: 'mysql', port: 3306, protocol: 'TCP' }
      ]
    }
  ]
}

export const createEndpointSliceDelete = () =>
  http.delete('/apis/discovery.k8s.io/v1/namespaces/:namespace/endpointslices/:name', () => {
    return HttpResponse.json({})
  })

export const createEndpointSlicesList = () =>
  http.get('/apis/discovery.k8s.io/v1/namespaces/:namespace/endpointslices', ({ request, params }) => {
    const namespace = params.namespace as string
    
    const data = createEndpointSlicesListData().filter(slice => slice.metadata?.namespace === namespace)
    
    return HttpResponse.json({
      apiVersion: 'discovery.k8s.io/v1',
      kind: 'EndpointSliceList',
      items: data
    })
  })

export const createAllEndpointSlicesList = () =>
  http.get('/apis/discovery.k8s.io/v1/endpointslices', () => {
    return HttpResponse.json({
      apiVersion: 'discovery.k8s.io/v1',
      kind: 'EndpointSliceList',
      items: createEndpointSlicesListData()
    })
  })

export const createEndpointSlicesListError = () =>
  http.get('/apis/discovery.k8s.io/v1/namespaces/:namespace/endpointslices', () => {
    return HttpResponse.error()
  })

export const createEndpointSlicesListSlow = () =>
  http.get('/apis/discovery.k8s.io/v1/namespaces/:namespace/endpointslices', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return HttpResponse.json({
      apiVersion: 'discovery.k8s.io/v1',
      kind: 'EndpointSliceList',
      items: createEndpointSlicesListData()
    })
  })
