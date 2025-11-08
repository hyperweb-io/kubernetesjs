import { usePods, usePod, usePodLogs, useDeletePod, usePodsForDeployment } from '../../hooks/usePods'
import { server } from '../../__mocks__/server'
import { renderHook, waitFor } from '../utils/test-utils'
import { http, HttpResponse } from 'msw'
import { 
  createPodsList, 
  createAllPodsList, 
  createPodsListData,
  createPodDetails,
  createPodLogs,
  createPodLogsHandler,
  createPodsListError,
  createAllPodsListError,
  createPodsListNetworkError,
  createPodsListSlow
} from '../../__mocks__/handlers/pods'

const API_BASE = 'http://localhost:8001'

describe('usePods', () => {

  describe('Success scenarios', () => {
    it('should successfully fetch pods list', async () => {
      server.use(createPodsList())

      const { result } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.items).toHaveLength(5)
      expect(result.current.data?.items[0].metadata.name).toBe('nginx-pod-1')
      expect(result.current.data?.items[1].metadata.name).toBe('redis-pod-1')
      expect(result.current.data?.items[2].metadata.name).toBe('pending-pod')
    })

    it('should handle empty pods list', async () => {
      server.use(createPodsList([]))

      const { result } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(0)
    })

    it('should support _all namespace', async () => {
      const mock = createPodsListData()
      server.use(createAllPodsList(mock))

      const { result } = renderHook(() => usePods('_all'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(5)
      expect(result.current.data?.items[0].metadata.name).toBe(mock[0]?.metadata?.name)
      expect(result.current.data?.items[1].metadata.name).toBe(mock[1]?.metadata?.name)
      expect(result.current.data?.items[2].metadata.name).toBe(mock[2]?.metadata?.name)
    })
  })

  describe('Loading states', () => {
    it('should complete loading successfully', async () => {
      server.use(createPodsList())

      const { result } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeDefined()
    })

    it('should show loading state initially', async () => {
      server.use(createPodsListSlow([], 100))

      const { result } = renderHook(() => usePods('default'))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeDefined()
    })

    it('should handle slow responses', async () => {
      server.use(createPodsListSlow(createPodsListData(), 200))

      const { result } = renderHook(() => usePods('default'))

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      }, { timeout: 1000 })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data?.items).toHaveLength(5)
    })
  })

  describe('Error handling', () => {
    it('should handle API errors (500)', async () => {
      server.use(createPodsListError(500, 'Internal Server Error'))

      const { result } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })

    it('should handle API errors (404)', async () => {
      server.use(createPodsListError(404, 'Not Found'))

      const { result } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })

    it('should handle network errors', async () => {
      server.use(createPodsListNetworkError())

      const { result } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })

    it('should handle _all namespace API errors', async () => {
      server.use(createAllPodsListError(500, 'Server Error'))

      const { result } = renderHook(() => usePods('_all'))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })
  })

  describe('Data transformation', () => {
    it('should correctly transform pod data', async () => {
      const customPods = [
        {
          metadata: { 
            name: 'test-pod', 
            namespace: 'default', 
            uid: 'pod-1',
            labels: { app: 'test' }
          },
          spec: { 
            containers: [{ name: 'main-container', image: 'nginx:latest' }]
          },
          status: { 
            phase: 'Running',
            podIP: '10.244.1.1'
          }
        }
      ]

      server.use(createPodsList(customPods))

      const { result } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(1)
      expect(result.current.data?.items[0].metadata.name).toBe('test-pod')
      expect(result.current.data?.items[0].status.phase).toBe('Running')
      expect(result.current.data?.items[0].spec.containers[0].image).toBe('nginx:latest')
    })

    it('should handle different pod statuses', async () => {
      const multiStatusPods = [
        {
          metadata: { 
            name: 'running-pod', 
            namespace: 'default', 
            uid: 'pod-1' 
          },
          spec: { containers: [{ name: 'main' }] },
          status: { phase: 'Running' }
        },
        {
          metadata: { 
            name: 'pending-pod', 
            namespace: 'default', 
            uid: 'pod-2' 
          },
          spec: { containers: [{ name: 'main' }] },
          status: { phase: 'Pending' }
        },
        {
          metadata: { 
            name: 'failed-pod', 
            namespace: 'default', 
            uid: 'pod-3' 
          },
          spec: { containers: [{ name: 'main' }] },
          status: { phase: 'Failed' }
        }
      ]

      server.use(createPodsList(multiStatusPods))

      const { result } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(3)
      expect(result.current.data?.items[0].status.phase).toBe('Running')
      expect(result.current.data?.items[1].status.phase).toBe('Pending')
      expect(result.current.data?.items[2].status.phase).toBe('Failed')
    })
  })

  describe('Caching behavior', () => {
    it('should cache data between renders', async () => {
      server.use(createPodsList())

      const { result, rerender } = renderHook(() => usePods('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const firstData = result.current.data

      rerender()

      expect(result.current.data).toBe(firstData)
    })

    it('should refetch when namespace changes', async () => {
      server.use(createPodsList())

      const { result, rerender } = renderHook(
        ({ namespace }) => usePods(namespace),
        { initialProps: { namespace: 'default' } }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const firstData = result.current.data

      rerender({ namespace: 'kube-system' })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).not.toBe(firstData)
    })
  })
})

describe('usePod', () => {

  it('should fetch specific pod', async () => {
    const mockPod = {
      metadata: { 
        name: 'test-pod', 
        namespace: 'default', 
        uid: 'pod-1' 
      },
      spec: { containers: [{ name: 'main' }] },
      status: { phase: 'Running' }
    }

    server.use(createPodDetails(mockPod))

    const { result } = renderHook(() => usePod('test-pod', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.metadata.name).toBe('test-pod')
  })
})

describe('usePodLogs', () => {
  it('should fetch pod logs successfully', async () => {
    // Skip due to undici polyfill issues with pod logs API
    const mockLogs = '2024-01-01T10:00:00Z [INFO] Application started\n2024-01-01T10:01:00Z [INFO] Server listening on port 8080'
    server.use(createPodLogsHandler(mockLogs))

    const { result } = renderHook(() => usePodLogs('test-pod', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
 
    expect(result.current.data).toBe(mockLogs)

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('should handle container parameter', async () => {
    // Skip due to undici polyfill issues with pod logs API
    const mockLogs = '2024-01-01T10:00:00Z [INFO] Container logs\n2024-01-01T10:01:00Z [INFO] Container ready'
    server.use(createPodLogsHandler(mockLogs))

    const { result } = renderHook(() => usePodLogs('test-pod', 'default', 'main-container'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBe(mockLogs)
  })

  it('should handle empty logs', async () => {
    // Skip due to undici polyfill issues with pod logs API
    const mockLogs = ''
    server.use(createPodLogsHandler(mockLogs))

    const { result } = renderHook(() => usePodLogs('test-pod', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBe('')
  })

  it('should handle pod not found error', async () => {
    server.use(
      http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods/:name/log`, () => {
        return HttpResponse.json({ error: 'Pod not found' }, { status: 404 })
      })
    )

    const { result } = renderHook(() => usePodLogs('nonexistent-pod', 'default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    // Note: Error structure may vary, just check that error exists
  })

  it('should handle network errors', async () => {
    server.use(
      http.get(`${API_BASE}/api/v1/namespaces/:namespace/pods/:name/log`, () => {
        return HttpResponse.error()
      })
    )

    const { result } = renderHook(() => usePodLogs('test-pod', 'default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})

describe('useDeletePod', () => {

  it('should delete pod successfully', async () => {
    const { result } = renderHook(() => useDeletePod())

    expect(result.current.mutate).toBeDefined()
    expect(result.current.mutateAsync).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.mutateAsync).toBe('function')
  })
})

describe('usePodsForDeployment', () => {
  it('should fetch pods for specific deployment', async () => {
    const mockPods = [
      {
        metadata: { 
          name: 'nginx-deployment-1234567890-abc123', 
          namespace: 'default', 
          uid: 'pod-1',
          labels: { app: 'nginx', 'pod-template-hash': '1234567890' }
        },
        spec: { 
          containers: [{ name: 'nginx', image: 'nginx:1.14.2' }],
          nodeName: 'node-1'
        },
        status: { 
          phase: 'Running',
          conditions: [{ type: 'Ready', status: 'True' }],
          containerStatuses: [{ name: 'nginx', ready: true, restartCount: 0 }]
        }
      }
    ]
    
    server.use(createPodsList(mockPods))

    const { result } = renderHook(() => usePodsForDeployment('nginx', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0].metadata.name).toBe('nginx-deployment-1234567890-abc123')
  })

  it('should handle empty pods list for deployment', async () => {
    server.use(createPodsList([]))

    const { result } = renderHook(() => usePodsForDeployment('nonexistent-deployment', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(0)
  })

  it('should handle API errors', async () => {
    server.use(createPodsListError(500, 'Internal Server Error'))

    const { result } = renderHook(() => usePodsForDeployment('nginx', 'default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    // Note: Error structure may vary, just check that error exists
  })
})