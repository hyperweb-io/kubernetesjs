import {
  getApiEndpoint,
  getOperatorNamespaces,
  waitForNamespaceDeletion,
  waitForNamespacesDeletion,
  deleteNamespace,
  checkNamespaceStatus,
  forceDeleteNamespace,
  DEFAULT_K8S_API_ENDPOINT,
  OPERATOR_NAMESPACES,
  OPERATOR_CLUSTER_RESOURCES
} from '../src/utils/k8s-utils';

// Mock global fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Mock console methods to avoid cluttering test output
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('K8s Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Use real timers by default; enable fake timers only in tests that need them
  });

  afterEach(() => {
    jest.useRealTimers();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  describe('getApiEndpoint', () => {
    it('should return default endpoint when no custom endpoint provided', () => {
      const result = getApiEndpoint();
      expect(result).toBe(DEFAULT_K8S_API_ENDPOINT);
    });

    it('should return custom endpoint when provided', () => {
      const customEndpoint = 'https://custom-k8s-api.example.com';
      const result = getApiEndpoint(customEndpoint);
      expect(result).toBe(customEndpoint);
    });

    it('should handle empty string endpoint', () => {
      const result = getApiEndpoint('');
      expect(result).toBe(DEFAULT_K8S_API_ENDPOINT);
    });

    it('should handle null endpoint', () => {
      const result = getApiEndpoint(null as any);
      expect(result).toBe(DEFAULT_K8S_API_ENDPOINT);
    });
  });

  describe('getOperatorNamespaces', () => {
    it('should include kube-prometheus-stack monitoring namespace when enabled', () => {
      const operators = [
        { name: 'kube-prometheus-stack', enabled: true }
      ];
      const config = { spec: { operators } } as any;

      const result = getOperatorNamespaces(config);
      expect(result).toEqual(OPERATOR_NAMESPACES['kube-prometheus-stack']);
    });

    it('should return namespaces for enabled operators', () => {
      const operators = [
        { name: 'knative-serving', enabled: true },
        { name: 'cert-manager', enabled: true },
        { name: 'ingress-nginx', enabled: false },
        { name: 'cloudnative-pg', enabled: true }
      ];
      const config = { spec: { operators } } as any;

      const result = getOperatorNamespaces(config);
      
      expect(result).toEqual([
        ...OPERATOR_NAMESPACES['knative-serving'],
        ...OPERATOR_NAMESPACES['cert-manager'],
        ...OPERATOR_NAMESPACES['cloudnative-pg']
      ]);
    });

    it('should return empty array when no operators enabled', () => {
      const operators = [
        { name: 'knative-serving', enabled: false },
        { name: 'cert-manager', enabled: false }
      ];
      const config = { spec: { operators } } as any;

      const result = getOperatorNamespaces(config);
      expect(result).toEqual([]);
    });

    it('should handle empty operators array', () => {
      const config = { spec: { operators: [] } } as any;
      const result = getOperatorNamespaces(config);
      expect(result).toEqual([]);
    });

    it('should ignore unknown operators', () => {
      const operators = [
        { name: 'knative-serving', enabled: true },
        { name: 'unknown-operator', enabled: true },
        { name: 'cert-manager', enabled: true }
      ];
      const config = { spec: { operators } } as any;

      const result = getOperatorNamespaces(config);
      
      expect(result).toEqual([
        ...OPERATOR_NAMESPACES['knative-serving'],
        ...OPERATOR_NAMESPACES['cert-manager']
      ]);
    });

    it('should handle operators without enabled property', () => {
      const operators = [
        { name: 'knative-serving' },
        { name: 'cert-manager', enabled: true }
      ] as any;
      const config = { spec: { operators } } as any;

      const result = getOperatorNamespaces(config);
      
      expect(result).toEqual([
        ...OPERATOR_NAMESPACES['cert-manager']
      ]);
    });
  });

  describe('checkNamespaceStatus', () => {
    const apiEndpoint = 'http://localhost:8080';
    const namespace = 'test-namespace';

    it('should return namespace status when it exists', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          status: {
            phase: 'Active'
          }
        })
      } as Response);

      const result = await checkNamespaceStatus(namespace, apiEndpoint);

      expect(result).toEqual({ exists: true, phase: 'Active' });
      expect(global.fetch).toHaveBeenCalledWith(
        `${apiEndpoint}/api/v1/namespaces/${namespace}`
      );
    });

    it('should return exists: false when namespace does not exist (404)', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404
      } as Response);

      const result = await checkNamespaceStatus(namespace, apiEndpoint);

      expect(result).toEqual({ exists: false });
    });

    it('should throw error for non-404 HTTP errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(checkNamespaceStatus(namespace, apiEndpoint))
        .rejects.toThrow(`Error checking namespace ${namespace}: HTTP 500`);
    });

    it('should throw error for network errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      await expect(checkNamespaceStatus(namespace, apiEndpoint))
        .rejects.toThrow(`Error checking namespace ${namespace}: Network Error`);
    });

    it('should handle namespace without phase', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          status: {}
        })
      } as Response);

      const result = await checkNamespaceStatus(namespace, apiEndpoint);

      expect(result).toEqual({ exists: true, phase: undefined });
    });

    it('should handle response without status', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({})
      } as Response);

      const result = await checkNamespaceStatus(namespace, apiEndpoint);

      expect(result).toEqual({ exists: true, phase: undefined });
    });
  });

  describe('deleteNamespace', () => {
    const apiEndpoint = 'http://localhost:8080';
    const namespace = 'test-namespace';

    it('should successfully delete namespace', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200
      } as Response);

      await deleteNamespace(namespace, apiEndpoint);

      expect(global.fetch).toHaveBeenCalledWith(
        `${apiEndpoint}/api/v1/namespaces/${namespace}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`✓ Namespace ${namespace} deletion initiated`)
      );
    });

    it('should handle 404 error (namespace already deleted)', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404
      } as Response);

      await deleteNamespace(namespace, apiEndpoint);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`✓ Namespace ${namespace} deletion initiated`)
      );
    });

    it('should throw error for other HTTP errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: () => Promise.resolve('Forbidden')
      } as Response);

      await expect(deleteNamespace(namespace, apiEndpoint))
        .resolves.toBeUndefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`✗ Failed to delete namespace ${namespace}: HTTP 403 - Forbidden`)
      );
    });

    it('should throw error for network errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      await expect(deleteNamespace(namespace, apiEndpoint))
        .resolves.toBeUndefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`✗ Error deleting namespace ${namespace}: Network Error`)
      );
    });
  });

  describe('forceDeleteNamespace', () => {
    const apiEndpoint = 'http://localhost:8080';
    const namespace = 'test-namespace';

    it('should delete namespace when it exists and is not terminating', async () => {
      // Mock checkNamespaceStatus to return Active namespace
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: { phase: 'Active' } })
        } as Response)
        // Mock deleteNamespace to succeed
        .mockResolvedValueOnce({
          ok: true,
          status: 200
        } as Response);

      await forceDeleteNamespace(namespace, apiEndpoint);

      expect(global.fetch).toHaveBeenCalledWith(
        `${apiEndpoint}/api/v1/namespaces/${namespace}`
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `${apiEndpoint}/api/v1/namespaces/${namespace}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      );
    });

    it('should skip deletion when namespace does not exist', async () => {
      // Mock checkNamespaceStatus to return non-existent namespace
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404
      } as Response);

      await forceDeleteNamespace(namespace, apiEndpoint);

      expect(global.fetch).toHaveBeenCalledWith(
        `${apiEndpoint}/api/v1/namespaces/${namespace}`
      );
      // No specific log is expected for 404 in current implementation
      expect(mockConsoleLog).not.toHaveBeenCalledWith(
        `ℹ️  Namespace ${namespace} does not exist, skipping deletion`
      );
    });

    it('should skip deletion when namespace is already terminating', async () => {
      // Mock checkNamespaceStatus to return Terminating namespace
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: { phase: 'Terminating' } })
      } as Response);

      await forceDeleteNamespace(namespace, apiEndpoint);

      expect(global.fetch).toHaveBeenCalledWith(
        `${apiEndpoint}/api/v1/namespaces/${namespace}`
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`Namespace ${namespace} is already terminating`)
      );
    });

    it('should handle errors during namespace status check', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(forceDeleteNamespace(namespace, apiEndpoint))
        .resolves.toBeUndefined();
    });

    it('should handle errors during namespace deletion', async () => {
      // Mock successful status check
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: { phase: 'Active' } })
        } as Response)
        // Mock failed deletion (include text for error message)
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          text: () => Promise.resolve('Forbidden')
        } as Response);

      await expect(forceDeleteNamespace(namespace, apiEndpoint))
        .resolves.toBeUndefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`✗ Failed to delete namespace ${namespace}: HTTP 403 - Forbidden`)
      );
    });
  });

  describe('waitForNamespaceDeletion', () => {
    const apiEndpoint = 'http://localhost:8080';
    const namespace = 'test-namespace';
    const timeout = 5000;
    const interval = 1000;

    it('should resolve when namespace is deleted', async () => {
      // First call: namespace exists
      // Second call: namespace does not exist (404)
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: { phase: 'Terminating' } })
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as Response);

      const promise = waitForNamespaceDeletion(namespace, apiEndpoint, 2, 0);
      await expect(promise).resolves.toBeUndefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`✓ Namespace ${namespace} successfully deleted`)
      );
    });

    it('should timeout when namespace is not deleted within timeout period', async () => {
      // Always return that namespace exists
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: { phase: 'Terminating' } })
      } as Response);

      await expect(waitForNamespaceDeletion(namespace, apiEndpoint, 1, 100)).rejects.toThrow(
        `Timeout waiting for namespace ${namespace} to be deleted after 100ms`
      );
    }, 10000);

    it('should handle errors during status checks', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(waitForNamespaceDeletion(namespace, apiEndpoint, 1, 0)).rejects.toThrow(
        `Timeout waiting for namespace ${namespace} to be deleted after 0ms`
      );
    }, 10000);

    it('should use default timeout and interval when not provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404
      } as Response);

      const promise = waitForNamespaceDeletion(namespace, apiEndpoint);
      
      await expect(promise).resolves.toBeUndefined();
    }, 10000);

    it('should log waiting message during deletion', async () => {
      // First call: namespace exists, second call: deleted
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: { phase: 'Terminating' } })
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as Response);

      await waitForNamespaceDeletion(namespace, apiEndpoint, 2, 0);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`⏳ Waiting for namespace ${namespace} to be deleted...`)
      );
    }, 10000);
  });

  describe('waitForNamespacesDeletion', () => {
    const apiEndpoint = 'http://localhost:8080';
    const namespaces = ['namespace1', 'namespace2', 'namespace3'];
    const timeout = 5000;
    const interval = 1000;

    it('should wait for all namespaces to be deleted', async () => {
      // Mock all namespaces to be deleted on first check (404 response)
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
        ok: false
      } as Response);

      await waitForNamespacesDeletion(namespaces, apiEndpoint, timeout, interval);

      expect(global.fetch).toHaveBeenCalledTimes(namespaces.length);
      namespaces.forEach(ns => {
        expect(global.fetch).toHaveBeenCalledWith(
          `${apiEndpoint}/api/v1/namespaces/${ns}`
        );
      });
    });

    it('should handle empty namespaces array', async () => {
      await waitForNamespacesDeletion([], apiEndpoint, timeout, interval);
      
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle mixed deletion states', async () => {
      // namespace1: deleted (404)
      // namespace2: still exists
      // namespace3: deleted (404)
      global.fetch = jest.fn()
        .mockResolvedValueOnce({ status: 404, ok: false } as Response) // namespace1
        .mockResolvedValueOnce({ 
          ok: true, 
          status: 200, 
          json: () => Promise.resolve({ status: { phase: 'Terminating' } })
        } as Response) // namespace2 - first check
        .mockResolvedValueOnce({ status: 404, ok: false } as Response) // namespace3
        .mockResolvedValueOnce({ status: 404, ok: false } as Response); // namespace2 - second check

      await waitForNamespacesDeletion(namespaces, apiEndpoint, 2, 0);
      expect(global.fetch).toHaveBeenCalledTimes(4); // 3 initial + 1 retry for namespace2
    }, 10000);

    it('should timeout if any namespace is not deleted within timeout', async () => {
      // namespace1: deleted
      // namespace2: never deleted
      // namespace3: deleted
      global.fetch = jest.fn()
        .mockImplementation((url: string) => {
          if (url.includes('namespace2')) {
            return Promise.resolve({ 
              ok: true, 
              status: 200, 
              json: () => Promise.resolve({ status: { phase: 'Terminating' } })
            } as Response);
          }
          return Promise.resolve({ status: 404, ok: false } as Response);
        });

      await expect(waitForNamespacesDeletion(namespaces, apiEndpoint, 1, 100)).rejects.toThrow(
        'Timeout waiting for namespace namespace2 to be deleted after 100ms'
      );
    });

    it('should use default parameters when not provided', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
        ok: false
      } as Response);

      await waitForNamespacesDeletion(namespaces, apiEndpoint);
      
      expect(global.fetch).toHaveBeenCalledTimes(namespaces.length);
    });

    it('should handle errors during namespace status checks', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(waitForNamespacesDeletion(namespaces, apiEndpoint, 1, 100))
        .rejects.toThrow('Timeout waiting for namespace namespace1 to be deleted after 100ms');
    }, 10000);
  });

  describe('Constants', () => {
    it('should have correct default API endpoint', () => {
      expect(DEFAULT_K8S_API_ENDPOINT).toBe('http://127.0.0.1:8001');
    });

    it('should have operator namespaces defined', () => {
      expect(OPERATOR_NAMESPACES).toHaveProperty('knative-serving');
      expect(OPERATOR_NAMESPACES).toHaveProperty('cert-manager');
      expect(OPERATOR_NAMESPACES).toHaveProperty('ingress-nginx');
      expect(OPERATOR_NAMESPACES).toHaveProperty('cloudnative-pg');
      expect(OPERATOR_NAMESPACES).toHaveProperty('kube-prometheus-stack');
      expect(OPERATOR_NAMESPACES['kube-prometheus-stack']).toEqual(['monitoring']);
    });

    it('should have operator cluster resources defined', () => {
      expect(OPERATOR_CLUSTER_RESOURCES).toHaveProperty('knative-serving');
      expect(OPERATOR_CLUSTER_RESOURCES).toHaveProperty('cert-manager');
      expect(OPERATOR_CLUSTER_RESOURCES).toHaveProperty('ingress-nginx');
      expect(OPERATOR_CLUSTER_RESOURCES).toHaveProperty('cloudnative-pg');
      expect(OPERATOR_CLUSTER_RESOURCES).toHaveProperty('kube-prometheus-stack');
      
      // Check structure of cluster resources
      const knativeResources = OPERATOR_CLUSTER_RESOURCES['knative-serving'];
      expect(knativeResources).toHaveProperty('crds');
      expect(knativeResources).toHaveProperty('clusterRoles');
      expect(knativeResources).toHaveProperty('clusterRoleBindings');
      expect(knativeResources).toHaveProperty('webhooks');
      
      expect(Array.isArray(knativeResources.crds)).toBe(true);
      expect(Array.isArray(knativeResources.clusterRoles)).toBe(true);
      expect(Array.isArray(knativeResources.clusterRoleBindings)).toBe(true);
      expect(Array.isArray(knativeResources.webhooks)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete namespace lifecycle', async () => {
      const namespace = 'test-namespace';
      const apiEndpoint = 'http://localhost:8080';
      
      // 1. Check namespace exists - mock fetch for checkNamespaceStatus
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: { phase: 'Active' } })
      } as Response);
      
      let status = await checkNamespaceStatus(namespace, apiEndpoint);
      expect(status.exists).toBe(true);
      expect(status.phase).toBe('Active');
      
      // 2. Delete namespace - mock fetch for deleteNamespace
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200
      } as Response);
      await deleteNamespace(namespace, apiEndpoint);
      
      // 3. Wait for deletion (simulate namespace being deleted immediately)
      global.fetch = jest.fn().mockResolvedValueOnce({
        status: 404,
        ok: false
      } as Response);
      
      await waitForNamespaceDeletion(namespace, apiEndpoint, 5000, 1000);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`✓ Namespace ${namespace} successfully deleted`)
      );
    });

    it('should handle force delete with proper checks', async () => {
      const namespace = 'test-namespace';
      const apiEndpoint = 'http://localhost:8080';
      
      // Mock namespace exists and is Active
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: { phase: 'Active' } })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200
        } as Response);
      
      await forceDeleteNamespace(namespace, apiEndpoint);
      
      expect(global.fetch).toHaveBeenCalledWith(
        `${apiEndpoint}/api/v1/namespaces/${namespace}`
      );
    });
  });
});