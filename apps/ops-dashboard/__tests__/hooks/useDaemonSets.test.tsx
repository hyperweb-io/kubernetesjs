import { useDaemonSets, useDaemonSet, useDeleteDaemonSet } from '../../hooks/useDaemonSets'
import { server } from '../../__mocks__/server'
import { renderHook, waitFor } from '../utils/test-utils'
import { http, HttpResponse } from 'msw'
import { 
  createDaemonSetsList, 
  createAllDaemonSetsList, 
  createDaemonSetsListData,
  createDaemonSetDetails,
  createDaemonSetsListError,
  createAllDaemonSetsListError,
  createDaemonSetsListNetworkError,
  createDaemonSetsListSlow
} from '../../__mocks__/handlers/daemonsets'

const API_BASE = 'http://localhost:8001'

describe('useDaemonSets', () => {

  describe('Success scenarios', () => {
    it('should successfully fetch daemonsets list', async () => {
      server.use(createDaemonSetsList())

      const { result } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.items).toHaveLength(2) // default namespace has 2 daemonsets
      expect(result.current.data?.items[0].metadata.name).toBe('nginx-daemonset')
      expect(result.current.data?.items[1].metadata.name).toBe('redis-daemonset')
    })

    it('should handle empty daemonsets list', async () => {
      server.use(createDaemonSetsList([]))

      const { result } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(0)
    })

    it('should support _all namespace', async () => {
      const mock = createDaemonSetsListData()
      server.use(createAllDaemonSetsList(mock))

      const { result } = renderHook(() => useDaemonSets('_all'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(3)
      expect(result.current.data?.items[0].metadata.name).toBe(mock[0]?.metadata?.name)
      expect(result.current.data?.items[1].metadata.name).toBe(mock[1]?.metadata?.name)
      expect(result.current.data?.items[2].metadata.name).toBe(mock[2]?.metadata?.name)
    })
  })

  describe('Loading states', () => {
    it('should complete loading successfully', async () => {
      server.use(createDaemonSetsList())

      const { result } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeDefined()
    })

    it('should show loading state initially', async () => {
      server.use(createDaemonSetsListSlow([], 100))

      const { result } = renderHook(() => useDaemonSets('default'))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeUndefined()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeDefined()
    })

    it('should handle slow responses', async () => {
      server.use(createDaemonSetsListSlow(createDaemonSetsListData(), 200))

      const { result } = renderHook(() => useDaemonSets('default'))

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      }, { timeout: 1000 })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.data?.items).toHaveLength(2)
    })
  })

  describe('Error handling', () => {
    it('should handle API errors (500)', async () => {
      server.use(createDaemonSetsListError(500, 'Internal Server Error'))

      const { result } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })

    it('should handle API errors (404)', async () => {
      server.use(createDaemonSetsListError(404, 'Not Found'))

      const { result } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })

    it('should handle network errors', async () => {
      server.use(createDaemonSetsListNetworkError())

      const { result } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })

    it('should handle _all namespace API errors', async () => {
      server.use(createAllDaemonSetsListError(500, 'Server Error'))

      const { result } = renderHook(() => useDaemonSets('_all'))

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeUndefined()
    })
  })

  describe('Data transformation', () => {
    it('should correctly transform daemonset data', async () => {
      const customDaemonSets = [
        {
          metadata: { 
            name: 'test-daemonset', 
            namespace: 'default', 
            uid: 'ds-1',
            labels: { app: 'test' }
          },
          spec: { 
            selector: { matchLabels: { app: 'test' } },
            template: {
              metadata: { labels: { app: 'test' } },
              spec: { containers: [{ name: 'main-container', image: 'nginx:latest' }] }
            }
          },
          status: { 
            currentNumberScheduled: 2,
            numberReady: 2,
            desiredNumberScheduled: 2,
            numberAvailable: 2
          }
        }
      ]

      server.use(createDaemonSetsList(customDaemonSets))

      const { result } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(1)
      expect(result.current.data?.items[0].metadata.name).toBe('test-daemonset')
      expect(result.current.data?.items[0].status.currentNumberScheduled).toBe(2)
      expect(result.current.data?.items[0].spec.template.spec.containers[0].image).toBe('nginx:latest')
    })

    it('should handle different daemonset statuses', async () => {
      const multiStatusDaemonSets = [
        {
          metadata: { 
            name: 'ready-daemonset', 
            namespace: 'default', 
            uid: 'ds-1' 
          },
          spec: { 
            selector: { matchLabels: { app: 'ready' } },
            template: {
              metadata: { labels: { app: 'ready' } },
              spec: { containers: [{ name: 'main' }] }
            }
          },
          status: { 
            currentNumberScheduled: 3,
            numberReady: 3,
            desiredNumberScheduled: 3,
            numberAvailable: 3
          }
        },
        {
          metadata: { 
            name: 'pending-daemonset', 
            namespace: 'default', 
            uid: 'ds-2' 
          },
          spec: { 
            selector: { matchLabels: { app: 'pending' } },
            template: {
              metadata: { labels: { app: 'pending' } },
              spec: { containers: [{ name: 'main' }] }
            }
          },
          status: { 
            currentNumberScheduled: 0,
            numberReady: 0,
            desiredNumberScheduled: 2,
            numberAvailable: 0
          }
        }
      ]

      server.use(createDaemonSetsList(multiStatusDaemonSets))

      const { result } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(2)
      expect(result.current.data?.items[0].status.numberReady).toBe(3)
      expect(result.current.data?.items[1].status.numberReady).toBe(0)
    })
  })

  describe('Caching behavior', () => {
    it('should cache data between renders', async () => {
      server.use(createDaemonSetsList())

      const { result, rerender } = renderHook(() => useDaemonSets('default'))

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const firstData = result.current.data

      rerender()

      expect(result.current.data).toBe(firstData)
    })

    it('should refetch when namespace changes', async () => {
      server.use(createDaemonSetsList())

      const { result, rerender } = renderHook(
        ({ namespace }) => useDaemonSets(namespace),
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

describe('useDaemonSet', () => {

  it('should fetch specific daemonset', async () => {
    const mockDaemonSet = {
      metadata: { 
        name: 'test-daemonset', 
        namespace: 'default', 
        uid: 'ds-1' 
      },
      spec: { 
        selector: { matchLabels: { app: 'test' } },
        template: {
          metadata: { labels: { app: 'test' } },
          spec: { containers: [{ name: 'main' }] }
        }
      },
      status: { 
        currentNumberScheduled: 1,
        numberReady: 1,
        desiredNumberScheduled: 1,
        numberAvailable: 1
      }
    }

    server.use(createDaemonSetDetails(mockDaemonSet))

    const { result } = renderHook(() => useDaemonSet('test-daemonset', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.metadata.name).toBe('test-daemonset')
  })
})

describe('useDeleteDaemonSet', () => {

  it('should delete daemonset successfully', async () => {
    server.use(
      http.delete(`${API_BASE}/apis/apps/v1/namespaces/:namespace/daemonsets/:name`, () => {
        return HttpResponse.json({}, { status: 200 })
      })
    )

    const { result } = renderHook(() => useDeleteDaemonSet())

    expect(result.current.mutate).toBeDefined()
    expect(result.current.mutateAsync).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.mutateAsync).toBe('function')
  })
})
