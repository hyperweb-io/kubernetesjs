import { NextRequest } from 'next/server';
import { GET } from '@/app/api/databases/[namespace]/[name]/status/route';

// Mock the dependencies
jest.mock('@kubernetesjs/ops', () => ({
  InterwebClient: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    readCoreV1NamespacedPod: jest.fn(),
    listCoreV1NamespacedPod: jest.fn(),
  })),
}));

// Mock environment variable
const originalEnv = process.env;

describe('/api/databases/[namespace]/[name]/status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GET', () => {
    it('should return database status successfully', async () => {
      const mockKube = {
        get: jest.fn()
          .mockResolvedValueOnce({
            status: {
              phase: 'Cluster in healthy state',
              readyInstances: 2,
              currentPrimary: 'test-cluster-1',
              systemID: '12345'
            },
            spec: {
              imageName: 'postgres:15',
              instances: 3
            }
          }) // cluster info
          .mockResolvedValueOnce({
            items: [
              {
                spec: { cluster: { name: 'test-cluster' } },
                status: { lastScheduleTime: '2024-01-01T02:00:00Z' }
              }
            ]
          }) // scheduled backups
          .mockResolvedValueOnce({
            items: [
              {
                spec: { cluster: { name: 'test-cluster' } },
                status: { lastCompletionTime: '2024-01-01T03:00:00Z' }
              }
            ]
          }), // backups
        readCoreV1NamespacedPod: jest.fn().mockResolvedValue({
          status: { startTime: '2024-01-01T00:00:00Z' }
        }),
        listCoreV1NamespacedPod: jest.fn()
          .mockResolvedValueOnce({
            items: [
              {
                metadata: {
                  name: 'test-cluster-1',
                  labels: { 'cnpg.io/instanceRole': 'primary' }
                },
                status: {
                  containerStatuses: [{ ready: true }],
                  startTime: '2024-01-01T00:00:00Z',
                  qosClass: 'Burstable',
                  nodeName: 'node-1'
                }
              },
              {
                metadata: {
                  name: 'test-cluster-2',
                  labels: { 'cnpg.io/instanceRole': 'replica' }
                },
                status: {
                  containerStatuses: [{ ready: true }],
                  startTime: '2024-01-01T00:01:00Z',
                  qosClass: 'Burstable',
                  nodeName: 'node-2'
                }
              }
            ]
          }) // instance pods
          .mockResolvedValueOnce({
            items: [
              {
                metadata: { labels: { 'cnpg.io/poolerName': 'test-pooler' } }
              }
            ]
          }) // pooler pods
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        name: 'test-ns/test-cluster',
        namespace: 'test-ns',
        cluster: 'test-cluster',
        image: 'postgres:15',
        phase: 'Cluster in healthy state',
        primary: 'test-cluster-1',
        primaryStartTime: '2024-01-01T00:00:00Z',
        instances: 3,
        readyInstances: 2,
        systemID: '12345',
        services: {
          rw: 'test-cluster-rw.test-ns.svc.cluster.local',
          ro: 'test-cluster-ro.test-ns.svc.cluster.local',
          poolerRw: 'test-pooler-rw.test-ns.svc.cluster.local'
        },
        backups: {
          configured: true,
          scheduledCount: 1,
          lastBackupTime: '2024-01-01T03:00:00Z'
        },
        streaming: {
          configured: true,
          replicas: 2
        },
        instancesTable: expect.any(Array)
      });
    });

    it('should handle cluster not found gracefully', async () => {
      const mockKube = {
        get: jest.fn().mockRejectedValue(new Error('status: 404'))
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        notFound: true,
        name: 'test-ns/test-cluster',
        namespace: 'test-ns',
        cluster: 'test-cluster'
      });
    });

    it('should handle cluster not found with different error message', async () => {
      const mockKube = {
        get: jest.fn().mockRejectedValue(new Error('not found'))
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        notFound: true,
        name: 'test-ns/test-cluster',
        namespace: 'test-ns',
        cluster: 'test-cluster'
      });
    });

    it('should handle primary pod errors gracefully', async () => {
      const mockKube = {
        get: jest.fn()
          .mockResolvedValueOnce({
            status: {
              phase: 'Cluster in healthy state',
              readyInstances: 2,
              currentPrimary: 'test-cluster-1',
              systemID: '12345'
            },
            spec: {
              imageName: 'postgres:15',
              instances: 3
            }
          })
          .mockResolvedValueOnce({ items: [] }) // pods
          .mockResolvedValueOnce({ items: [] }) // pooler pods
          .mockResolvedValueOnce({ items: [] }) // scheduled backups
          .mockResolvedValueOnce({ items: [] }), // backups
        readCoreV1NamespacedPod: jest.fn().mockRejectedValue(new Error('Pod not found')),
        listCoreV1NamespacedPod: jest.fn().mockResolvedValue({ items: [] })
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.primaryStartTime).toBeUndefined();
    });

    it('should handle pooler detection errors gracefully', async () => {
      const mockKube = {
        get: jest.fn()
          .mockResolvedValueOnce({
            status: {
              phase: 'Cluster in healthy state',
              readyInstances: 2,
              currentPrimary: 'test-cluster-1',
              systemID: '12345'
            },
            spec: {
              imageName: 'postgres:15',
              instances: 3
            }
          })
          .mockResolvedValueOnce({ items: [] }) // pods
          .mockRejectedValueOnce(new Error('Pooler error')) // pooler pods
          .mockResolvedValueOnce({ items: [] }) // scheduled backups
          .mockResolvedValueOnce({ items: [] }), // backups
        readCoreV1NamespacedPod: jest.fn().mockResolvedValue({
          status: { startTime: '2024-01-01T00:00:00Z' }
        }),
        listCoreV1NamespacedPod: jest.fn().mockResolvedValue({ items: [] })
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.services.poolerRw).toBeUndefined();
    });

    it('should handle backup errors gracefully', async () => {
      const mockKube = {
        get: jest.fn()
          .mockResolvedValueOnce({
            status: {
              phase: 'Cluster in healthy state',
              readyInstances: 2,
              currentPrimary: 'test-cluster-1',
              systemID: '12345'
            },
            spec: {
              imageName: 'postgres:15',
              instances: 3
            }
          })
          .mockResolvedValueOnce({ items: [] }) // pods
          .mockResolvedValueOnce({ items: [] }) // pooler pods
          .mockRejectedValueOnce(new Error('Scheduled backup error')) // scheduled backups
          .mockRejectedValueOnce(new Error('Backup error')), // backups
        readCoreV1NamespacedPod: jest.fn().mockResolvedValue({
          status: { startTime: '2024-01-01T00:00:00Z' }
        }),
        listCoreV1NamespacedPod: jest.fn().mockResolvedValue({ items: [] })
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.backups).toEqual({
        configured: false,
        scheduledCount: 0,
        lastBackupTime: undefined
      });
    });

    it('should handle unexpected errors', async () => {
      const mockKube = {
        get: jest.fn().mockRejectedValue(new Error('Unexpected error'))
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to get database status');
      expect(data.message).toBe('Unexpected error');
    });

    it('should use custom KUBERNETES_PROXY_URL when set', async () => {
      process.env.KUBERNETES_PROXY_URL = 'http://custom-proxy:8001';

      const mockKube = {
        get: jest.fn().mockRejectedValue(new Error('Unexpected error'))
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation((config) => {
        expect(config.restEndpoint).toBe('http://custom-proxy:8001');
        return mockKube;
      });

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });

      expect(response.status).toBe(500);
    });

    it('should handle single instance cluster correctly', async () => {
      const mockKube = {
        get: jest.fn()
          .mockResolvedValueOnce({
            status: {
              phase: 'Cluster in healthy state',
              readyInstances: 1,
              currentPrimary: 'test-cluster-1',
              systemID: '12345'
            },
            spec: {
              imageName: 'postgres:15',
              instances: 1
            }
          })
          .mockResolvedValueOnce({
            status: { startTime: '2024-01-01T00:00:00Z' }
          }) // primary pod
          .mockResolvedValueOnce({
            items: [
              {
                metadata: {
                  name: 'test-cluster-1',
                  labels: { 'cnpg.io/instanceRole': 'primary' }
                },
                status: {
                  containerStatuses: [{ ready: true }],
                  startTime: '2024-01-01T00:00:00Z',
                  qosClass: 'Burstable',
                  nodeName: 'node-1'
                }
              }
            ]
          }) // pods
          .mockResolvedValueOnce({ items: [] }) // pooler pods
          .mockResolvedValueOnce({ items: [] }) // scheduled backups
          .mockResolvedValueOnce({ items: [] }), // backups
        readCoreV1NamespacedPod: jest.fn().mockResolvedValue({
          status: { startTime: '2024-01-01T00:00:00Z' }
        }),
        listCoreV1NamespacedPod: jest.fn().mockResolvedValue({ items: [] })
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/status');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.streaming).toEqual({
        configured: false,
        replicas: 0
      });
    });
  });
});
