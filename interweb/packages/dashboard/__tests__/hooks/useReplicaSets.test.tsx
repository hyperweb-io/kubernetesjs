import { 
  useReplicaSets, 
  useReplicaSet, 
  useDeleteReplicaSet, 
  useScaleReplicaSet 
} from '../../hooks/useReplicaSets'
import { server } from '../../__mocks__/server'
import { http, HttpResponse } from 'msw'
import { renderHook, waitFor, act } from '../utils/test-utils'
import { 
  createReplicaSetsList, 
  createAllReplicaSetsList, 
  createReplicaSetsListData,
  createReplicaSetsListError,
  createAllReplicaSetsListError,
  createReplicaSetsListNetworkError,
  createReplicaSetsListSlow,
  getReplicaSet,
  updateReplicaSet,
  createReplicaSetDelete,
  createReplicaSetScale
} from '../../__mocks__/handlers/replicasets'

describe('useReplicaSets', () => {
  it('should successfully fetch replicasets list', async () => {
    server.use(createReplicaSetsList())

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.items).toHaveLength(3)
    expect(result.current.data?.items[0].metadata.name).toBe('nginx-deployment-1234567890')
    expect(result.current.data?.items[1].metadata.name).toBe('redis-deployment-abcdefghij')
    expect(result.current.data?.items[2].metadata.name).toBe('orphaned-replicaset')
  })

  it('should handle empty replicasets list', async () => {
    server.use(createReplicaSetsList([]))

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(0)
  })

  it('should support _all namespace', async () => {
    const mock = createReplicaSetsListData()
    server.use(createAllReplicaSetsList(mock))

    const { result } = renderHook(() => useReplicaSets('_all'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(3)
    expect(result.current.data?.items[0].metadata.name).toBe(mock[0]?.metadata?.name)
    expect(result.current.data?.items[1].metadata.name).toBe(mock[1]?.metadata?.name)
  })

  it('should complete loading successfully', async () => {
    server.use(createReplicaSetsList())

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })

  it('should show loading state initially', async () => {
    server.use(createReplicaSetsListSlow([], 100))

    const { result } = renderHook(() => useReplicaSets('default'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })

  it('should handle slow responses', async () => {
    server.use(createReplicaSetsListSlow(createReplicaSetsListData(), 200))

    const { result } = renderHook(() => useReplicaSets('default'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    }, { timeout: 1000 })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data?.items).toHaveLength(3)
  })

  it('should handle API errors (500)', async () => {
    server.use(createReplicaSetsListError(500, 'Internal Server Error'))

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle API errors (404)', async () => {
    server.use(createReplicaSetsListError(404, 'Not Found'))

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle network errors', async () => {
    server.use(createReplicaSetsListNetworkError())

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle _all namespace API errors', async () => {
    server.use(createAllReplicaSetsListError(500, 'Server Error'))

    const { result } = renderHook(() => useReplicaSets('_all'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should correctly transform replicaset data', async () => {
    const customReplicaSets = [
      {
        metadata: { 
          name: 'test-rs-1', 
          namespace: 'default', 
          uid: 'rs-1',
          labels: { app: 'test' },
          ownerReferences: [
            {
              kind: 'Deployment',
              name: 'test-deployment',
              uid: 'deploy-1',
              apiVersion: 'apps/v1'
            }
          ]
        },
        spec: { 
          replicas: 2,
          selector: { matchLabels: { app: 'test' } }
        },
        status: { 
          readyReplicas: 2, 
          replicas: 2,
          observedGeneration: 1
        }
      }
    ]

    server.use(createReplicaSetsList(customReplicaSets))

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0].metadata.name).toBe('test-rs-1')
    expect(result.current.data?.items[0].spec.replicas).toBe(2)
    expect(result.current.data?.items[0].status.readyReplicas).toBe(2)
    expect(result.current.data?.items[0].metadata.ownerReferences?.[0].kind).toBe('Deployment')
  })

  it('should handle replicasets with different statuses', async () => {
    const multiStatusReplicaSets = [
      {
        metadata: { 
          name: 'ready-rs', 
          namespace: 'default', 
          uid: 'rs-1' 
        },
        spec: { replicas: 3 },
        status: { 
          readyReplicas: 3, 
          replicas: 3,
          observedGeneration: 1
        }
      },
      {
        metadata: { 
          name: 'scaling-rs', 
          namespace: 'default', 
          uid: 'rs-2' 
        },
        spec: { replicas: 5 },
        status: { 
          readyReplicas: 3, 
          replicas: 5,
          observedGeneration: 1
        }
      },
      {
        metadata: { 
          name: 'failed-rs', 
          namespace: 'default', 
          uid: 'rs-3' 
        },
        spec: { replicas: 2 },
        status: { 
          readyReplicas: 0, 
          replicas: 2,
          observedGeneration: 1
        }
      }
    ]

    server.use(createReplicaSetsList(multiStatusReplicaSets))

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(3)
    expect(result.current.data?.items[0].status.readyReplicas).toBe(3)
    expect(result.current.data?.items[1].status.readyReplicas).toBe(3)
    expect(result.current.data?.items[2].status.readyReplicas).toBe(0)
  })

  it('should handle replicasets with owner references', async () => {
    const ownedReplicaSets = [
      {
        metadata: { 
          name: 'owned-rs', 
          namespace: 'default', 
          uid: 'rs-1',
          ownerReferences: [
            {
              kind: 'Deployment',
              name: 'nginx-deployment',
              uid: 'deploy-1',
              apiVersion: 'apps/v1',
              controller: true
            }
          ]
        },
        spec: { replicas: 1 },
        status: { readyReplicas: 1, replicas: 1 }
      },
      {
        metadata: { 
          name: 'orphan-rs', 
          namespace: 'default', 
          uid: 'rs-2'
        },
        spec: { replicas: 1 },
        status: { readyReplicas: 1, replicas: 1 }
      }
    ]

    server.use(createReplicaSetsList(ownedReplicaSets))

    const { result } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(2)
    expect(result.current.data?.items[0].metadata.ownerReferences).toHaveLength(1)
    expect(result.current.data?.items[0].metadata.ownerReferences?.[0].kind).toBe('Deployment')
    expect(result.current.data?.items[1].metadata.ownerReferences).toBeUndefined()
  })

  it('should cache data between renders', async () => {
    server.use(createReplicaSetsList())

    const { result, rerender } = renderHook(() => useReplicaSets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const firstData = result.current.data

    rerender()

    expect(result.current.data).toBe(firstData)
  })

  it('should refetch when namespace changes', async () => {
    server.use(createReplicaSetsList())

    const { result, rerender } = renderHook(
      ({ namespace }) => useReplicaSets(namespace),
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

// ============================================================================
// MUTATION HOOKS TESTS
// ============================================================================

describe('useReplicaSet', () => {
  it('should fetch single replicaset successfully', async () => {
    const mockReplicaSet = {
      metadata: { name: 'test-rs', namespace: 'default', uid: 'rs-1' },
      spec: { replicas: 3 },
      status: { readyReplicas: 3, replicas: 3 }
    }

    server.use(getReplicaSet(mockReplicaSet))

    const { result } = renderHook(() => useReplicaSet('test-rs', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockReplicaSet)
  })

  it('should handle replicaset not found', async () => {
    const handler = http.get('http://localhost:8001/apis/apps/v1/namespaces/:namespace/replicasets/:name', () => {
      return HttpResponse.json({ error: 'ReplicaSet not found' }, { status: 404 })
    })

    server.use(handler)

    const { result } = renderHook(() => useReplicaSet('non-existent', 'default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})

describe('useDeleteReplicaSet', () => {
  it('should delete replicaset successfully', async () => {
    server.use(createReplicaSetDelete())

    const { result } = renderHook(() => useDeleteReplicaSet())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-rs',
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle deletion errors', async () => {
    const handler = http.delete('http://localhost:8001/apis/apps/v1/namespaces/:namespace/replicasets/:name', () => {
      return HttpResponse.json({ error: 'Deletion failed' }, { status: 404 })
    })

    server.use(handler)

    const { result } = renderHook(() => useDeleteReplicaSet())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'non-existent-rs',
          namespace: 'default'
        })
      } catch (error) {
        // Expected to throw
      }
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

describe('useScaleReplicaSet', () => {
  it('should scale replicaset successfully', async () => {
    server.use(createReplicaSetScale())

    const { result } = renderHook(() => useScaleReplicaSet())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-rs',
        replicas: 5,
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle scaling errors', async () => {
    const handler = http.put('http://localhost:8001/apis/apps/v1/namespaces/:namespace/replicasets/:name/scale', () => {
      return HttpResponse.json({ error: 'Scaling failed' }, { status: 400 })
    })

    server.use(handler)

    const { result } = renderHook(() => useScaleReplicaSet())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'test-rs',
          replicas: -1, // Invalid replicas
          namespace: 'default'
        })
      } catch (error) {
        // Expected to throw
      }
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })

  it('should use default namespace when not provided', async () => {
    server.use(createReplicaSetScale())

    const { result } = renderHook(() => useScaleReplicaSet())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-rs',
        replicas: 3
        // No namespace provided, should use default
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
