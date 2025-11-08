import { http, HttpResponse } from 'msw';

import { 
  createAllServicesList, 
  createAllServicesListError,
  createServiceHandler,
  createServicesList, 
  createServicesListData,
  createServicesListError,
  createServicesListNetworkError,
  createServicesListSlow,
  deleteServiceHandler,
  getService,
  updateService} from '../../__mocks__/handlers/services';
import { server } from '../../__mocks__/server';
import { 
  useCreateService, 
  useDeleteService, 
  useService, 
  useServices, 
  useUpdateService} from '../../hooks/useServices';
import { act,renderHook, waitFor } from '../utils/test-utils';

describe('useServices', () => {
  it('should successfully fetch services list', async () => {
    server.use(createServicesList());

    const { result } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.items).toHaveLength(2);
    expect(result.current.data?.items[0].metadata.name).toBe('test-service-1');
    expect(result.current.data?.items[1].metadata.name).toBe('test-service-2');
  });

  it('should handle empty services list', async () => {
    server.use(createServicesList([]));

    const { result } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toHaveLength(0);
  });

  it('should support _all namespace', async () => {
    const mock = createServicesListData();
    server.use(createAllServicesList(mock));

    const { result } = renderHook(() => useServices('_all'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toHaveLength(3);
    expect(result.current.data?.items[0].metadata.name).toBe(mock[0]?.metadata?.name);
    expect(result.current.data?.items[1].metadata.name).toBe(mock[1]?.metadata?.name);
    expect(result.current.data?.items[2].metadata.name).toBe(mock[2]?.metadata?.name);
  });

  it('should complete loading successfully', async () => {
    server.use(createServicesList());

    const { result } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });

  it('should show loading state initially', async () => {
    server.use(createServicesListSlow([], 100));

    const { result } = renderHook(() => useServices('default'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });

  it('should handle slow responses', async () => {
    server.use(createServicesListSlow(createServicesListData(), 200));

    const { result } = renderHook(() => useServices('default'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, { timeout: 1000 });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data?.items).toHaveLength(2);
  });

  it('should handle API errors (500)', async () => {
    server.use(createServicesListError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should handle API errors (404)', async () => {
    server.use(createServicesListError(404, 'Not Found'));

    const { result } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should handle network errors', async () => {
    server.use(createServicesListNetworkError());

    const { result } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should handle _all namespace API errors', async () => {
    server.use(createAllServicesListError(500, 'Server Error'));

    const { result } = renderHook(() => useServices('_all'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should correctly transform service data', async () => {
    const customServices = [
      {
        metadata: { 
          name: 'test-service', 
          namespace: 'default', 
          uid: 'svc-1',
          labels: { app: 'test' }
        },
        spec: { 
          type: 'NodePort',
          ports: [
            { port: 8080, targetPort: 80, nodePort: 30080, protocol: 'TCP' }
          ],
          selector: { app: 'test' }
        },
        status: {
          loadBalancer: {}
        }
      }
    ];

    server.use(createServicesList(customServices));

    const { result } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.items[0].metadata.name).toBe('test-service');
    expect(result.current.data?.items[0].spec.type).toBe('NodePort');
    expect(result.current.data?.items[0].spec.ports[0].nodePort).toBe(30080);
  });

  it('should handle different service types correctly', async () => {
    const multiTypeServices = [
      {
        metadata: { 
          name: 'clusterip-service', 
          namespace: 'default', 
          uid: 'svc-1' 
        },
        spec: { type: 'ClusterIP' },
        status: { loadBalancer: {} }
      },
      {
        metadata: { 
          name: 'loadbalancer-service', 
          namespace: 'default', 
          uid: 'svc-2' 
        },
        spec: { type: 'LoadBalancer' },
        status: { 
          loadBalancer: { 
            ingress: [{ ip: '192.168.1.100' }] 
          } 
        }
      }
    ];

    server.use(createServicesList(multiTypeServices));

    const { result } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toHaveLength(2);
    expect(result.current.data?.items[0].spec.type).toBe('ClusterIP');
    expect(result.current.data?.items[1].spec.type).toBe('LoadBalancer');
  });

  it('should cache data between renders', async () => {
    server.use(createServicesList());

    const { result, rerender } = renderHook(() => useServices('default'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    rerender();

    expect(result.current.data).toBe(firstData);
  });

  it('should refetch when namespace changes', async () => {
    server.use(createServicesList());

    const { result, rerender } = renderHook(
      ({ namespace }) => useServices(namespace),
      { initialProps: { namespace: 'default' } }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    rerender({ namespace: 'kube-system' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).not.toBe(firstData);
  });
});

// ============================================================================
// MUTATION HOOKS TESTS
// ============================================================================

describe('useService', () => {
  it('should fetch single service successfully', async () => {
    const mockService = {
      metadata: { name: 'test-service', namespace: 'default', uid: 'svc-1' },
      spec: { type: 'ClusterIP', ports: [{ port: 80, targetPort: 80 }] },
      status: { loadBalancer: {} }
    };

    server.use(getService(mockService));

    const { result } = renderHook(() => useService('test-service', 'default'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockService);
  });

  it('should handle service not found', async () => {
    const handler = http.get('http://localhost:8001/api/v1/namespaces/:namespace/services/:name', () => {
      return HttpResponse.json({ error: 'Service not found' }, { status: 404 });
    });

    server.use(handler);

    const { result } = renderHook(() => useService('non-existent', 'default'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useCreateService', () => {
  const mockService = {
    metadata: { name: 'new-service', namespace: 'default', uid: 'svc-new' },
    spec: { type: 'ClusterIP', ports: [{ port: 80, targetPort: 80 }] },
    status: { loadBalancer: {} }
  };

  it('should create service successfully', async () => {
    server.use(createServiceHandler(mockService));

    const { result } = renderHook(() => useCreateService());

    await act(async () => {
      await result.current.mutateAsync({
        service: mockService,
        namespace: 'default'
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle creation errors', async () => {
    const handler = http.post('http://localhost:8001/api/v1/namespaces/:namespace/services', () => {
      return HttpResponse.json({ error: 'Creation failed' }, { status: 400 });
    });

    server.use(handler);

    const { result } = renderHook(() => useCreateService());

    await act(async () => {
      try {
        await result.current.mutateAsync({
          service: {} as any,
          namespace: 'default'
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

describe('useUpdateService', () => {
  const mockService = {
    metadata: { name: 'updated-service', namespace: 'default', uid: 'svc-updated' },
    spec: { type: 'NodePort', ports: [{ port: 80, targetPort: 80, nodePort: 30080 }] },
    status: { loadBalancer: {} }
  };

  it('should update service successfully', async () => {
    server.use(updateService());

    const { result } = renderHook(() => useUpdateService());

    await act(async () => {
      await result.current.mutateAsync({
        name: 'updated-service',
        service: mockService,
        namespace: 'default'
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle update errors', async () => {
    const handler = http.put('http://localhost:8001/api/v1/namespaces/:namespace/services/:name', () => {
      return HttpResponse.json({ error: 'Update failed' }, { status: 400 });
    });

    server.use(handler);

    const { result } = renderHook(() => useUpdateService());

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'updated-service',
          service: {} as any,
          namespace: 'default'
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

describe('useDeleteService', () => {
  it('should delete service successfully', async () => {
    server.use(deleteServiceHandler('test-service', 'default'));

    const { result } = renderHook(() => useDeleteService());

    await act(async () => {
      await result.current.mutateAsync({
        name: 'test-service',
        namespace: 'default'
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle deletion errors', async () => {
    const handler = http.delete('http://localhost:8001/api/v1/namespaces/:namespace/services/:name', () => {
      return HttpResponse.json({ error: 'Deletion failed' }, { status: 404 });
    });

    server.use(handler);

    const { result } = renderHook(() => useDeleteService());

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: 'non-existent-service',
          namespace: 'default'
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

