import { http, HttpResponse } from 'msw';

import { 
  createNamespace,
  createNamespacesList, 
  createNamespacesListData,
  createNamespacesListError,
  createNamespacesListNetworkError,
  createNamespacesListSlow,
  deleteNamespace,
  getNamespace} from '../../__mocks__/handlers/namespaces';
import { server } from '../../__mocks__/server';
import { 
  useCreateNamespace, 
  useDeleteNamespace, 
  useNamespace, 
  useNamespaces} from '../../hooks/useNamespaces';
import { act,renderHook, waitFor } from '../utils/test-utils';

describe('useNamespaces', () => {
  it('should successfully fetch namespaces list', async () => {
    server.use(createNamespacesList());

    const { result } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.items).toHaveLength(4);
    expect(result.current.data?.items[0].metadata.name).toBe('default');
    expect(result.current.data?.items[1].metadata.name).toBe('kube-system');
    expect(result.current.data?.items[2].metadata.name).toBe('kube-public');
    expect(result.current.data?.items[3].metadata.name).toBe('test-namespace');
  });

  it('should handle empty namespaces list', async () => {
    server.use(createNamespacesList([]));

    const { result } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toHaveLength(0);
  });

  it('should complete loading successfully', async () => {
    server.use(createNamespacesList());

    const { result } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });

  it('should show loading state initially', async () => {
    server.use(createNamespacesListSlow([], 100));

    const { result } = renderHook(() => useNamespaces());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });

  it('should handle slow responses', async () => {
    server.use(createNamespacesListSlow(createNamespacesListData(), 200));

    const { result } = renderHook(() => useNamespaces());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, { timeout: 1000 });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data?.items).toHaveLength(4);
  });

  it('should handle API errors (500)', async () => {
    server.use(createNamespacesListError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should handle API errors (403)', async () => {
    server.use(createNamespacesListError(403, 'Forbidden'));

    const { result } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should handle network errors', async () => {
    server.use(createNamespacesListNetworkError());

    const { result } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should correctly transform namespace data', async () => {
    const customNamespaces = [
      {
        metadata: { 
          name: 'custom-namespace', 
          uid: 'ns-1',
          labels: { 
            'kubernetes.io/metadata.name': 'custom-namespace',
            environment: 'production'
          },
          creationTimestamp: new Date('2023-06-01T12:00:00Z')
        },
        spec: {},
        status: { phase: 'Active' }
      }
    ];

    server.use(createNamespacesList(customNamespaces));

    const { result } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].metadata.name).toBe('custom-namespace');
    expect(result.current.data?.items[0].status.phase).toBe('Active');
    expect(result.current.data?.items[0].metadata.labels?.environment).toBe('production');
  });

  it('should handle different namespace statuses', async () => {
    const multiStatusNamespaces = [
      {
        metadata: { 
          name: 'active-namespace', 
          uid: 'ns-1',
          labels: { 'kubernetes.io/metadata.name': 'active-namespace' }
        },
        spec: {},
        status: { phase: 'Active' }
      },
      {
        metadata: { 
          name: 'terminating-namespace', 
          uid: 'ns-2',
          labels: { 'kubernetes.io/metadata.name': 'terminating-namespace' }
        },
        spec: {},
        status: { phase: 'Terminating' }
      }
    ];

    server.use(createNamespacesList(multiStatusNamespaces));

    const { result } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toHaveLength(2);
    expect(result.current.data?.items[0].status.phase).toBe('Active');
    expect(result.current.data?.items[1].status.phase).toBe('Terminating');
  });

  it('should cache data between renders', async () => {
    server.use(createNamespacesList());

    const { result, rerender } = renderHook(() => useNamespaces());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    rerender();

    expect(result.current.data).toBe(firstData);
  });
});

// ============================================================================
// MUTATION HOOKS TESTS
// ============================================================================

describe('useNamespace', () => {
  it('should fetch single namespace successfully', async () => {
    const mockNamespace = {
      metadata: { name: 'test-namespace', uid: 'ns-1' },
      spec: {},
      status: { phase: 'Active' }
    };

    server.use(getNamespace(mockNamespace));

    const { result } = renderHook(() => useNamespace('test-namespace'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockNamespace);
  });

  it('should handle namespace not found', async () => {
    const handler = http.get('http://localhost:8001/api/v1/namespaces/:name', () => {
      return HttpResponse.json({ error: 'Namespace not found' }, { status: 404 });
    });

    server.use(handler);

    const { result } = renderHook(() => useNamespace('non-existent'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useCreateNamespace', () => {
  it('should create namespace successfully', async () => {
    server.use(createNamespace());

    const { result } = renderHook(() => useCreateNamespace());

    await act(async () => {
      await result.current.mutateAsync({
        name: 'new-namespace',
        labels: { environment: 'test' }
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should create namespace without labels', async () => {
    server.use(createNamespace());

    const { result } = renderHook(() => useCreateNamespace());

    await act(async () => {
      await result.current.mutateAsync({
        name: 'new-namespace'
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle creation errors', async () => {
    const handler = http.post('http://localhost:8001/api/v1/namespaces', () => {
      return HttpResponse.json({ error: 'Creation failed' }, { status: 400 });
    });

    server.use(handler);

    const { result } = renderHook(() => useCreateNamespace());

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'invalid-namespace-name!'
        });
      } catch (error) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

describe('useDeleteNamespace', () => {
  it('should delete namespace successfully', async () => {
    server.use(deleteNamespace());

    const { result } = renderHook(() => useDeleteNamespace());

    await act(async () => {
      await result.current.mutateAsync('test-namespace');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle deletion errors', async () => {
    const handler = http.delete('http://localhost:8001/api/v1/namespaces/:name', () => {
      return HttpResponse.json({ error: 'Deletion failed' }, { status: 404 });
    });

    server.use(handler);

    const { result } = renderHook(() => useDeleteNamespace());

    await act(async () => {
      try {
        await result.current.mutateAsync('non-existent-namespace');
      } catch (error) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('should handle forbidden deletion', async () => {
    const handler = http.delete('http://localhost:8001/api/v1/namespaces/:name', () => {
      return HttpResponse.json({ error: 'Forbidden' }, { status: 403 });
    });

    server.use(handler);

    const { result } = renderHook(() => useDeleteNamespace());

    await act(async () => {
      try {
        await result.current.mutateAsync('kube-system');
      } catch (error) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});