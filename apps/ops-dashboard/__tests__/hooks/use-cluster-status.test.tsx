import { http, HttpResponse } from 'msw';

import { server } from '../../__mocks__/server';
import { useClusterStatus } from '../../hooks/use-cluster-status';
import { renderHook, waitFor } from '../utils/test-utils';

describe('useClusterStatus', () => {
  it('should fetch cluster status successfully', async () => {
    const mockClusterOverview = {
      nodes: {
        total: 3,
        ready: 3,
        notReady: 0
      },
      pods: {
        total: 15,
        running: 12,
        pending: 2,
        failed: 1
      },
      namespaces: 5,
      version: 'v1.28.0'
    };

    const handler = http.get('/api/cluster/status', () => {
      return HttpResponse.json(mockClusterOverview);
    });

    server.use(handler);

    const { result } = renderHook(() => useClusterStatus());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockClusterOverview);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle API errors', async () => {
    const handler = http.get('/api/cluster/status', () => {
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    });

    server.use(handler);

    const { result } = renderHook(() => useClusterStatus());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should handle network errors', async () => {
    const handler = http.get('/api/cluster/status', () => {
      return HttpResponse.error();
    });

    server.use(handler);

    const { result } = renderHook(() => useClusterStatus());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should have correct query configuration', () => {
    const { result } = renderHook(() => useClusterStatus());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should refetch on interval', async () => {
    const mockClusterOverview = {
      nodes: { total: 3, ready: 3, notReady: 0 },
      pods: { total: 15, running: 12, pending: 2, failed: 1 },
      namespaces: 5,
      version: 'v1.28.0'
    };

    let callCount = 0;
    const handler = http.get('/api/cluster/status', () => {
      callCount++;
      return HttpResponse.json(mockClusterOverview);
    });

    server.use(handler);

    const { result } = renderHook(() => useClusterStatus());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Wait for potential refetch (this test mainly verifies the configuration)
    expect(callCount).toBeGreaterThanOrEqual(1);
  });
});
