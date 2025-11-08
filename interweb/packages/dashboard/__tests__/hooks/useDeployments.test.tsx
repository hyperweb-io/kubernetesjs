

import { renderHook, waitFor, act } from '../utils/test-utils'
import { 
  useDeployments, 
  useCreateDeployment, 
  useUpdateDeployment, 
  useDeleteDeployment, 
  useScaleDeployment 
} from '../../hooks/useDeployments'
import { server } from '../../__mocks__/server'
import { 
  createAllDeploymentsList, 
  createDeploymentsList, 
  createDeploymentsListData,
  createDeploymentsListError,
  createAllDeploymentsListError,
  createDeploymentsListNetworkError,
  createDeploymentsListSlow,
  createDeploymentHandler,
  createDeploymentErrorHandler,
  updateDeploymentHandler,
  updateDeploymentErrorHandler,
  deleteDeploymentHandler,
  deleteDeploymentErrorHandler,
  scaleDeploymentHandler,
  scaleDeploymentErrorHandler,
  scaleDeploymentWithNamespaceValidationHandler
} from '../../__mocks__/handlers/deployments'

/**
 * useDeployments Hook Tests
 * 
 * This file contains comprehensive tests for the useDeployments hook and its
 * related mutation hooks. The tests are organized into two main sections:
 * 
 * 1. QUERY HOOKS TESTS - Tests for data fetching operations
 *    - Success scenarios (fetching, empty lists, _all namespace)
 *    - Loading states (initial loading, slow responses)
 *    - Error handling (API errors, network errors)
 *    - Data transformation (custom data, different namespaces)
 *    - Caching behavior (data caching, refetching)
 * 
 * 2. MUTATION HOOKS TESTS - Tests for data modification operations
 *    - useCreateDeployment (create operations)
 *    - useUpdateDeployment (update operations)
 *    - useDeleteDeployment (delete operations)
 *    - useScaleDeployment (scaling operations)
 * 
 * Total: 23 test cases covering all CRUD operations and edge cases
 */

// ============================================================================
// QUERY HOOKS TESTS
// ============================================================================

describe('useDeployments', () => {
  it('should successfully fetch deployment list', async () => {
    server.use(createDeploymentsList())

    const { result } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.items).toHaveLength(2)
    expect(result.current.data?.items[0].metadata.name).toBe('nginx-deployment')
    expect(result.current.data?.items[1].metadata.name).toBe('redis-deployment')
  })

  it('should handle empty deployment list', async () => {
    server.use(createDeploymentsList([]))

    const { result } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(0)
  })

  it('should support _all namespace', async () => {
    const mock = createDeploymentsListData()
    server.use(createAllDeploymentsList(mock))

    const { result } = renderHook(() => useDeployments('_all'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(2)
    expect(result.current.data?.items[0].metadata.name).toBe(mock[0]?.metadata?.name)
    expect(result.current.data?.items[1].metadata.name).toBe(mock[1]?.metadata?.name)
  })

  it('should complete loading successfully', async () => {
    server.use(createDeploymentsList())

    const { result } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })

  it('should show loading state initially', async () => {
    server.use(createDeploymentsListSlow([], 100))

    const { result } = renderHook(() => useDeployments('default'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })

  it('should handle slow responses', async () => {
    server.use(createDeploymentsListSlow(createDeploymentsListData(), 200))

    const { result } = renderHook(() => useDeployments('default'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    }, { timeout: 1000 })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data?.items).toHaveLength(2)
  })

  it('should handle API errors (500)', async () => {
    server.use(createDeploymentsListError(500, 'Internal Server Error'))

    const { result } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle API errors (404)', async () => {
    server.use(createDeploymentsListError(404, 'Not Found'))

    const { result } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle network errors', async () => {
    server.use(createDeploymentsListNetworkError())

    const { result } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle _all namespace API errors', async () => {
    server.use(createAllDeploymentsListError(500, 'Server Error'))

    const { result } = renderHook(() => useDeployments('_all'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should correctly transform deployment data', async () => {
    const customDeployments = [
      {
        metadata: { 
          name: 'test-deployment', 
          namespace: 'default', 
          uid: 'deploy-1',
          labels: { app: 'test' }
        },
        spec: { 
          replicas: 2,
          selector: { matchLabels: { app: 'test' } },
          template: { 
            spec: { 
              containers: [{ name: 'test', image: 'test:latest' }] 
            } 
          }
        },
        status: { 
          readyReplicas: 2, 
          replicas: 2,
          conditions: [
            { type: 'Available', status: 'True' }
          ]
        }
      }
    ]

    server.use(createDeploymentsList(customDeployments))

    const { result } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0].metadata.name).toBe('test-deployment')
    expect(result.current.data?.items[0].spec.replicas).toBe(2)
    expect(result.current.data?.items[0].status.readyReplicas).toBe(2)
  })

  it('should handle different namespaces correctly', async () => {
    const multiNamespaceDeployments = [
      {
        metadata: { 
          name: 'deploy-1', 
          namespace: 'default', 
          uid: 'deploy-1' 
        },
        spec: { replicas: 1 },
        status: { readyReplicas: 1, replicas: 1 }
      },
      {
        metadata: { 
          name: 'deploy-2', 
          namespace: 'kube-system', 
          uid: 'deploy-2' 
        },
        spec: { replicas: 1 },
        status: { readyReplicas: 1, replicas: 1 }
      }
    ]

    server.use(createDeploymentsList(multiNamespaceDeployments))

    const { result } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Should only return deployments from 'default' namespace
    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0].metadata.namespace).toBe('default')
  })

  it('should cache data between renders', async () => {
    server.use(createDeploymentsList())

    const { result, rerender } = renderHook(() => useDeployments('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const firstData = result.current.data

    // Re-render should use cached data
    rerender()

    expect(result.current.data).toBe(firstData)
  })

  it('should refetch when namespace changes', async () => {
    server.use(createDeploymentsList())

    const { result, rerender } = renderHook(
      ({ namespace }) => useDeployments(namespace),
      { initialProps: { namespace: 'default' } }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const firstData = result.current.data

    // Change namespace
    rerender({ namespace: 'kube-system' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Should have different data (even if empty, it's a new query)
    expect(result.current.data).not.toBe(firstData)
  })
})

// ============================================================================
// MUTATION HOOKS TESTS
// ============================================================================

describe('useCreateDeployment', () => {
  const mockDeployment = {
    metadata: {
      name: 'test-deployment',
      namespace: 'default',
      uid: 'deploy-test'
    },
    spec: {
      replicas: 3,
      selector: { matchLabels: { app: 'test' } },
      template: {
        spec: {
          containers: [{ name: 'test', image: 'nginx:latest' }]
        }
      }
    },
    status: { readyReplicas: 0, replicas: 0 }
  }

  it('should create deployment successfully', async () => {
    server.use(createDeploymentHandler(mockDeployment))

    const { result } = renderHook(() => useCreateDeployment())

    await act(async () => {
      await result.current.mutateAsync({
        deployment: mockDeployment,
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle creation errors', async () => {
    server.use(createDeploymentErrorHandler(400, 'Creation failed'))

    const { result } = renderHook(() => useCreateDeployment())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          deployment: {} as any,
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

describe('useUpdateDeployment', () => {
  const mockDeployment = {
    metadata: {
      name: 'test-deployment',
      namespace: 'default',
      uid: 'deploy-test'
    },
    spec: {
      replicas: 5,
      selector: { matchLabels: { app: 'test' } },
      template: {
        spec: {
          containers: [{ name: 'test', image: 'nginx:latest' }]
        }
      }
    },
    status: { readyReplicas: 0, replicas: 0 }
  }

  it('should update deployment successfully', async () => {
    server.use(updateDeploymentHandler(mockDeployment))

    const { result } = renderHook(() => useUpdateDeployment())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-deployment',
        deployment: mockDeployment,
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle update errors', async () => {
    server.use(updateDeploymentErrorHandler(400, 'Update failed'))

    const { result } = renderHook(() => useUpdateDeployment())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'test-deployment',
          deployment: {} as any,
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

describe('useDeleteDeployment', () => {
  it('should delete deployment successfully', async () => {
    server.use(deleteDeploymentHandler())

    const { result } = renderHook(() => useDeleteDeployment())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-deployment',
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle deletion errors', async () => {
    server.use(deleteDeploymentErrorHandler(404, 'Deletion failed'))

    const { result } = renderHook(() => useDeleteDeployment())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'non-existent-deployment',
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

describe('useScaleDeployment', () => {
  it('should scale deployment successfully', async () => {
    server.use(scaleDeploymentHandler(5))

    const { result } = renderHook(() => useScaleDeployment())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-deployment',
        replicas: 5,
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle scaling errors', async () => {
    server.use(scaleDeploymentErrorHandler(400, 'Scaling failed'))

    const { result } = renderHook(() => useScaleDeployment())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'test-deployment',
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
    server.use(scaleDeploymentWithNamespaceValidationHandler(3, 'default'))

    const { result } = renderHook(() => useScaleDeployment())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-deployment',
        replicas: 3
        // No namespace provided, should use default
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
