import { 
  useSecrets, 
  useSecret, 
  useCreateSecret, 
  useUpdateSecret, 
  useDeleteSecret 
} from '../../hooks/useSecrets'
import { server } from '../../__mocks__/server'
import { http, HttpResponse } from 'msw'
import { renderHook, waitFor, act } from '../utils/test-utils'
import { 
  createSecretsList, 
  createAllSecretsList, 
  createSecretsListData,
  createSecretsListError,
  createAllSecretsListError,
  createSecretsListNetworkError,
  createSecretsListSlow,
  getSecret,
  createSecretHandler,
  updateSecret,
  deleteSecretHandler
} from '../../__mocks__/handlers/secrets'

describe('useSecrets', () => {
  it('should successfully fetch secrets list', async () => {
    server.use(createSecretsList())

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.items).toHaveLength(2)
    expect(result.current.data?.items[0].metadata.name).toBe('test-secret-1')
    expect(result.current.data?.items[1].metadata.name).toBe('test-secret-2')
  })

  it('should handle empty secrets list', async () => {
    server.use(createSecretsList([]))

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(0)
  })

  it('should support _all namespace', async () => {
    const mock = createSecretsListData()
    server.use(createAllSecretsList(mock))

    const { result } = renderHook(() => useSecrets('_all'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(3)
    expect(result.current.data?.items[0].metadata.name).toBe(mock[0]?.metadata?.name)
    expect(result.current.data?.items[1].metadata.name).toBe(mock[1]?.metadata?.name)
    expect(result.current.data?.items[2].metadata.name).toBe(mock[2]?.metadata?.name)
  })

  it('should complete loading successfully', async () => {
    server.use(createSecretsList())

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })

  it('should show loading state initially', async () => {
    server.use(createSecretsListSlow([], 100))

    const { result } = renderHook(() => useSecrets('default'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeDefined()
  })

  it('should handle slow responses', async () => {
    server.use(createSecretsListSlow(createSecretsListData(), 200))

    const { result } = renderHook(() => useSecrets('default'))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    }, { timeout: 1000 })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data?.items).toHaveLength(2)
  })

  it('should handle API errors (500)', async () => {
    server.use(createSecretsListError(500, 'Internal Server Error'))

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle API errors (403)', async () => {
    server.use(createSecretsListError(403, 'Forbidden'))

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle network errors', async () => {
    server.use(createSecretsListNetworkError())

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle _all namespace API errors', async () => {
    server.use(createAllSecretsListError(500, 'Server Error'))

    const { result } = renderHook(() => useSecrets('_all'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should correctly transform secret data', async () => {
    const customSecrets = [
      {
        metadata: { 
          name: 'test-secret', 
          namespace: 'default', 
          uid: 'secret-1',
          labels: { app: 'test' }
        },
        type: 'Opaque',
        data: {
          'username': Buffer.from('testuser').toString('base64'),
          'password': Buffer.from('testpass').toString('base64')
        }
      }
    ]

    server.use(createSecretsList(customSecrets))

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0].metadata.name).toBe('test-secret')
    expect(result.current.data?.items[0].type).toBe('Opaque')
    expect(result.current.data?.items[0].data.username).toBeDefined()
    expect(result.current.data?.items[0].data.password).toBeDefined()
  })

  it('should handle different secret types correctly', async () => {
    const multiTypeSecrets = [
      {
        metadata: { 
          name: 'opaque-secret', 
          namespace: 'default', 
          uid: 'secret-1' 
        },
        type: 'Opaque',
        data: { 'key': 'value' }
      },
      {
        metadata: { 
          name: 'tls-secret', 
          namespace: 'default', 
          uid: 'secret-2' 
        },
        type: 'kubernetes.io/tls',
        data: { 
          'tls.crt': 'cert-data',
          'tls.key': 'key-data'
        }
      },
      {
        metadata: { 
          name: 'docker-secret', 
          namespace: 'default', 
          uid: 'secret-3' 
        },
        type: 'kubernetes.io/dockerconfigjson',
        data: { 
          '.dockerconfigjson': 'docker-config-data'
        }
      }
    ]

    server.use(createSecretsList(multiTypeSecrets))

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(3)
    expect(result.current.data?.items[0].type).toBe('Opaque')
    expect(result.current.data?.items[1].type).toBe('kubernetes.io/tls')
    expect(result.current.data?.items[2].type).toBe('kubernetes.io/dockerconfigjson')
  })

  it('should handle base64 encoded data correctly', async () => {
    const base64Secrets = [
      {
        metadata: { 
          name: 'encoded-secret', 
          namespace: 'default', 
          uid: 'secret-1' 
        },
        type: 'Opaque',
        data: {
          'username': Buffer.from('admin').toString('base64'),
          'password': Buffer.from('secret123').toString('base64'),
          'json': Buffer.from(JSON.stringify({ key: 'value' })).toString('base64')
        }
      }
    ]

    server.use(createSecretsList(base64Secrets))

    const { result } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(1)
    const secret = result.current.data?.items[0]
    expect(secret.data.username).toBe(Buffer.from('admin').toString('base64'))
    expect(secret.data.password).toBe(Buffer.from('secret123').toString('base64'))
    expect(secret.data.json).toBe(Buffer.from(JSON.stringify({ key: 'value' })).toString('base64'))
  })

  it('should cache data between renders', async () => {
    server.use(createSecretsList())

    const { result, rerender } = renderHook(() => useSecrets('default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const firstData = result.current.data

    rerender()

    expect(result.current.data).toBe(firstData)
  })

  it('should refetch when namespace changes', async () => {
    server.use(createSecretsList())

    const { result, rerender } = renderHook(
      ({ namespace }) => useSecrets(namespace),
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

describe('useSecret', () => {
  it('should fetch single secret successfully', async () => {
    const mockSecret = {
      metadata: { name: 'test-secret', namespace: 'default', uid: 'secret-1' },
      type: 'Opaque',
      data: { username: 'dGVzdA==', password: 'cGFzcw==' }
    }

    server.use(getSecret(mockSecret))

    const { result } = renderHook(() => useSecret('test-secret', 'default'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockSecret)
  })

  it('should handle secret not found', async () => {
    const handler = http.get('http://localhost:8001/api/v1/namespaces/:namespace/secrets/:name', () => {
      return HttpResponse.json({ error: 'Secret not found' }, { status: 404 })
    })

    server.use(handler)

    const { result } = renderHook(() => useSecret('non-existent', 'default'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})

describe('useCreateSecret', () => {
  const mockSecret = {
    metadata: { name: 'new-secret', namespace: 'default', uid: 'secret-new' },
    type: 'Opaque',
    data: { username: 'dGVzdA==', password: 'cGFzcw==' }
  }

  it('should create secret successfully', async () => {
    server.use(createSecretHandler(mockSecret))

    const { result } = renderHook(() => useCreateSecret())

    await act(async () => {
      await result.current.mutateAsync({
        secret: mockSecret,
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle creation errors', async () => {
    const handler = http.post('http://localhost:8001/api/v1/namespaces/:namespace/secrets', () => {
      return HttpResponse.json({ error: 'Creation failed' }, { status: 400 })
    })

    server.use(handler)

    const { result } = renderHook(() => useCreateSecret())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          secret: {} as any,
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

describe('useUpdateSecret', () => {
  const mockSecret = {
    metadata: { name: 'updated-secret', namespace: 'default', uid: 'secret-updated' },
    type: 'Opaque',
    data: { username: 'dXBkYXRlZA==', password: 'bmV3cGFzcw==' }
  }

  it('should update secret successfully', async () => {
    server.use(updateSecret())

    const { result } = renderHook(() => useUpdateSecret())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'updated-secret',
        secret: mockSecret,
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle update errors', async () => {
    const handler = http.put('http://localhost:8001/api/v1/namespaces/:namespace/secrets/:name', () => {
      return HttpResponse.json({ error: 'Update failed' }, { status: 400 })
    })

    server.use(handler)

    const { result } = renderHook(() => useUpdateSecret())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'updated-secret',
          secret: {} as any,
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

describe('useDeleteSecret', () => {
  it('should delete secret successfully', async () => {
    server.use(deleteSecretHandler('test-secret', 'default'))

    const { result } = renderHook(() => useDeleteSecret())

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-secret',
        namespace: 'default'
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle deletion errors', async () => {
    const handler = http.delete('http://localhost:8001/api/v1/namespaces/:namespace/secrets/:name', () => {
      return HttpResponse.json({ error: 'Deletion failed' }, { status: 404 })
    })

    server.use(handler)

    const { result } = renderHook(() => useDeleteSecret())

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'non-existent-secret',
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

