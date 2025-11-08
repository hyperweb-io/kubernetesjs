import { NextRequest } from 'next/server';

import { GET, POST } from '@/app/api/databases/[namespace]/[name]/backups/route';

// Mock the dependencies
jest.mock('@kubernetesjs/ops', () => ({
  InterwebClient: jest.fn().mockImplementation(() => ({
    readPostgresqlCnpgIoV1NamespacedCluster: jest.fn(),
    listPostgresqlCnpgIoV1NamespacedBackup: jest.fn(),
    get: jest.fn(),
  })),
}));

jest.mock('@kubernetesjs/client', () => ({
  SetupClient: jest.fn().mockImplementation(() => ({})),
  PostgresDeployer: jest.fn().mockImplementation(() => ({
    createBackup: jest.fn(),
  })),
}));

// Mock environment variable
const originalEnv = process.env;

describe('/api/databases/[namespace]/[name]/backups', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GET', () => {
    it('should return backup information successfully', async () => {
      const mockKube = {
        readPostgresqlCnpgIoV1NamespacedCluster: jest.fn().mockResolvedValue({
          spec: {
            backup: {
              barmanObjectStore: { enabled: true }
            }
          }
        }),
        listPostgresqlCnpgIoV1NamespacedBackup: jest.fn().mockResolvedValue({
          items: [
            {
              spec: { cluster: { name: 'test-cluster' } },
              metadata: { name: 'backup-1', creationTimestamp: '2024-01-01T00:00:00Z' },
              status: { phase: 'Completed', startedAt: '2024-01-01T00:00:00Z' }
            }
          ]
        }),
        get: jest.fn()
          .mockResolvedValueOnce({ items: [] }) // scheduled backups
          .mockResolvedValueOnce({}) // snapshot API
      };

      // Mock the InterwebClient constructor
      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        configured: true,
        methodConfigured: 'barmanObjectStore',
        snapshotSupported: true,
        backups: expect.any(Array),
        scheduled: expect.any(Array)
      });
    });

    it('should handle cluster not found gracefully', async () => {
      const mockKube = {
        readPostgresqlCnpgIoV1NamespacedCluster: jest.fn().mockRejectedValue(new Error('not found')),
        listPostgresqlCnpgIoV1NamespacedBackup: jest.fn().mockResolvedValue({ items: [] }),
        get: jest.fn()
          .mockResolvedValueOnce({ items: [] })
          .mockResolvedValueOnce({})
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to list backups');
    });

    it('should handle backup list errors gracefully', async () => {
      const mockKube = {
        readPostgresqlCnpgIoV1NamespacedCluster: jest.fn().mockResolvedValue({
          spec: { backup: { barmanObjectStore: { enabled: true } } }
        }),
        listPostgresqlCnpgIoV1NamespacedBackup: jest.fn().mockRejectedValue(new Error('API error')),
        get: jest.fn()
          .mockResolvedValueOnce({ items: [] })
          .mockResolvedValueOnce({})
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups');
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.backups).toEqual([]);
    });
  });

  describe('POST', () => {
    it('should create on-demand backup successfully', async () => {
      const mockKube = {
        readPostgresqlCnpgIoV1NamespacedCluster: jest.fn().mockResolvedValue({
          spec: { backup: { barmanObjectStore: { enabled: true } } }
        }),
        get: jest.fn().mockResolvedValue({})
      };

      const mockPg = {
        createBackup: jest.fn().mockResolvedValue({ name: 'backup-123' })
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      const { PostgresDeployer } = require('@kubernetesjs/client');
      
      InterwebClient.mockImplementation(() => mockKube);
      PostgresDeployer.mockImplementation(() => mockPg);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups', {
        method: 'POST',
        body: JSON.stringify({
          type: 'onDemand',
          method: 'barmanObjectStore',
          name: 'test-backup'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.created).toEqual({ name: 'backup-123' });
      expect(mockPg.createBackup).toHaveBeenCalledWith({
        namespace: 'test-ns',
        clusterName: 'test-cluster',
        method: 'barmanObjectStore',
        name: 'test-backup'
      });
    });

    it('should create scheduled backup successfully', async () => {
      const mockKube = {
        post: jest.fn().mockResolvedValue({ name: 'scheduled-backup-123' })
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups', {
        method: 'POST',
        body: JSON.stringify({
          type: 'scheduled',
          schedule: '0 2 * * *',
          method: 'barmanObjectStore',
          name: 'daily-backup'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.created).toEqual({ name: 'scheduled-backup-123' });
      expect(mockKube.post).toHaveBeenCalledWith(
        '/apis/postgresql.cnpg.io/v1/namespaces/test-ns/scheduledbackups',
        undefined,
        expect.objectContaining({
          apiVersion: 'postgresql.cnpg.io/v1',
          kind: 'ScheduledBackup',
          metadata: expect.objectContaining({ name: 'daily-backup' }),
          spec: expect.objectContaining({ schedule: '0 2 * * *' })
        })
      );
    });

    it('should return 400 when type is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing type');
    });

    it('should return 400 when schedule is missing for scheduled backup', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups', {
        method: 'POST',
        body: JSON.stringify({ type: 'scheduled' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing schedule');
    });

    it('should return 400 when backup is not configured', async () => {
      const mockKube = {
        readPostgresqlCnpgIoV1NamespacedCluster: jest.fn().mockResolvedValue({
          spec: {} // no backup configuration
        }),
        get: jest.fn().mockResolvedValue(null) // no snapshot API
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups', {
        method: 'POST',
        body: JSON.stringify({ type: 'onDemand' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Backups not configured');
    });

    it('should return 400 for unsupported type', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups', {
        method: 'POST',
        body: JSON.stringify({ type: 'unsupported' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Unsupported type');
    });

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing type');
    });

    it('should handle unexpected errors', async () => {
      const mockKube = {
        readPostgresqlCnpgIoV1NamespacedCluster: jest.fn().mockRejectedValue(new Error('Unexpected error'))
      };

      const { InterwebClient } = require('@kubernetesjs/ops');
      InterwebClient.mockImplementation(() => mockKube);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-cluster/backups', {
        method: 'POST',
        body: JSON.stringify({ type: 'onDemand' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-cluster' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create backup resource');
    });
  });
});
