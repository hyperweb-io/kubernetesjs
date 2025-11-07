import { 
  useConfigMaps, 
  useConfigMap, 
  useCreateConfigMap, 
  useUpdateConfigMap, 
  useDeleteConfigMap 
} from '../../hooks/useConfigMaps'
import { server } from '../../__mocks__/server'
import { http, HttpResponse } from 'msw'
import { renderHook, waitFor, act } from '../utils/test-utils'
import { 
  createConfigMapsList, 
  createAllConfigMapsList, 
  createConfigMapsListData,
  createConfigMapsListError,
  createAllConfigMapsListError,
  createConfigMapsListNetworkError,
  createConfigMapsListSlow,
  getConfigMap,
  createConfigMap,
  createConfigMapUpdate,
  createConfigMapDelete
} from '../../__mocks__/handlers/configmaps'

describe('useConfigMaps', () => {
  it('should successfully fetch configmaps list', async () => {
    server.use(createConfigMapsList())

    const { result } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.items).toHaveLength(3)
    expect(result.current.data?.items[0].metadata.name).toBe('app-config')
    expect(result.current.data?.items[1].metadata.name).toBe('redis-config')
    expect(result.current.data?.items[2].metadata.name).toBe('empty-config')
  })

  it('should handle empty configmaps list', async () => {
    server.use(createConfigMapsList([]))

    const { result } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(0)
  })

  it('should support _all namespace', async () => {
    const mock = createConfigMapsListData()
    server.use(createAllConfigMapsList(mock))

    const { result } = renderHook(() => useConfigMaps('_all'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(3)
    expect(result.current.data?.items[0].metadata.name).toBe(mock[0]?.metadata?.name)
    expect(result.current.data?.items[1].metadata.name).toBe(mock[1]?.metadata?.name)
  })

  it('should complete loading successfully', async () => {
    server.use(createConfigMapsList())

    const { result } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })

  it('should show loading state initially', async () => {
    server.use(createConfigMapsListSlow([], 100))

    const { result } = renderHook(() => useConfigMaps('default'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })

  it('should handle slow responses', async () => {
    server.use(createConfigMapsListSlow(createConfigMapsListData(), 200))

    const { result } = renderHook(() => useConfigMaps('default'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    }, { timeout: 1000 })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data?.items).toHaveLength(3)
  })

  it('should handle API errors (500)', async () => {
    server.use(createConfigMapsListError(500, 'Internal Server Error'))

    const { result } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle API errors (404)', async () => {
    server.use(createConfigMapsListError(404, 'Not Found'))

    const { result } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle network errors', async () => {
    server.use(createConfigMapsListNetworkError())

    const { result } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle _all namespace API errors', async () => {
    server.use(createAllConfigMapsListError(500, 'Server Error'))

    const { result } = renderHook(() => useConfigMaps('_all'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should correctly transform configmap data', async () => {
    const customConfigMaps = [
      {
        metadata: { 
          name: 'test-config', 
          namespace: 'default', 
          uid: 'cm-1',
          labels: { app: 'test' }
        },
        data: {
          'config.yaml': 'database:\n  host: localhost\n  port: 5432',
          'secrets.env': 'API_KEY=secret123\nDB_PASSWORD=password'
        }
      }
    ]

    server.use(createConfigMapsList(customConfigMaps))

    const { result } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0].metadata.name).toBe('test-config')
    expect(result.current.data?.items[0].data['config.yaml']).toContain('database:')
    expect(result.current.data?.items[0].data['secrets.env']).toContain('API_KEY=secret123')
  })

  it('should handle configmaps with different data structures', async () => {
    const multiDataConfigMaps = [
      {
        metadata: { 
          name: 'json-config', 
          namespace: 'default', 
          uid: 'cm-1' 
        },
        data: {
          'app.json': '{"name": "my-app", "version": "1.0.0"}'
        }
      },
      {
        metadata: { 
          name: 'empty-config', 
          namespace: 'default', 
          uid: 'cm-2' 
        },
        data: {}
      },
      {
        metadata: { 
          name: 'binary-config', 
          namespace: 'default', 
          uid: 'cm-3' 
        },
        data: {
          'binary.data': Buffer.from('binary content').toString('base64')
        }
      }
    ]

    server.use(createConfigMapsList(multiDataConfigMaps))

    const { result } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(3)
    expect(result.current.data?.items[0].data['app.json']).toContain('"name": "my-app"')
    expect(Object.keys(result.current.data?.items[1].data || {})).toHaveLength(0)
    expect(result.current.data?.items[2].data['binary.data']).toBeDefined()
  })

  it('should cache data between renders', async () => {
    server.use(createConfigMapsList())

    const { result, rerender } = renderHook(() => useConfigMaps('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const firstData = result.current.data

    rerender()

    expect(result.current.data).toBe(firstData)
  })

  it('should refetch when namespace changes', async () => {
    server.use(createConfigMapsList())

    const { result, rerender } = renderHook(
      ({ namespace }) => useConfigMaps(namespace),
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

describe('useConfigMap', () => {
  it('should fetch single configmap successfully', async () => {
    const mockConfigMap = {
      metadata: { name: 'test-config', namespace: 'default', uid: 'cm-1' },
      data: { key: 'value' }
    }

    server.use(getConfigMap(mockConfigMap))

    const { result } = renderHook(() => useConfigMap('test-config', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockConfigMap)
  })

  it('should handle configmap not found', async () => {
    const handler = http.get('http://localhost:8001/api/v1/namespaces/:namespace/configmaps/:name', () => {
      return HttpResponse.json({ error: 'ConfigMap not found' }, { status: 404 })
    })

    server.use(handler)

    const { result } = renderHook(() => useConfigMap('non-existent', 'default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})

describe('useCreateConfigMap', () => {
  const mockConfigMap = {
    metadata: { name: 'new-config', namespace: 'default', uid: 'cm-new' },
    data: { key: 'value' }
  }

  it('should create configmap successfully', async () => {
    server.use(createConfigMap())

    const { result } = renderHook(() => useCreateConfigMap())

    await act(async () => {
      await result.current.mutateAsync({
        configMap: mockConfigMap,
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle creation errors', async () => {
    const handler = http.post('http://localhost:8001/api/v1/namespaces/:namespace/configmaps', () => {
      return HttpResponse.json({ error: 'Creation failed' }, { status: 400 })
    })

    server.use(handler)

    const { result } = renderHook(() => useCreateConfigMap())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          configMap: {} as any,
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

describe('useUpdateConfigMap', () => {
  const mockConfigMap = {
    metadata: { name: 'updated-config', namespace: 'default', uid: 'cm-updated' },
    data: { key: 'updated-value' }
  }

  it('should update configmap successfully', async () => {
    server.use(createConfigMapUpdate())

    const { result } = renderHook(() => useUpdateConfigMap())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'updated-config',
        configMap: mockConfigMap,
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle update errors', async () => {
    const handler = http.put('http://localhost:8001/api/v1/namespaces/:namespace/configmaps/:name', () => {
      return HttpResponse.json({ error: 'Update failed' }, { status: 400 })
    })

    server.use(handler)

    const { result } = renderHook(() => useUpdateConfigMap())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'updated-config',
          configMap: {} as any,
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

describe('useDeleteConfigMap', () => {
  it('should delete configmap successfully', async () => {
    server.use(createConfigMapDelete())

    const { result } = renderHook(() => useDeleteConfigMap())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-config',
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle deletion errors', async () => {
    const handler = http.delete('http://localhost:8001/api/v1/namespaces/:namespace/configmaps/:name', () => {
      return HttpResponse.json({ error: 'Deletion failed' }, { status: 404 })
    })

    server.use(handler)

    const { result } = renderHook(() => useDeleteConfigMap())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'non-existent-config',
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

