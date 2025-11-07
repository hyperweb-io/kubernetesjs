import { NextRequest } from 'next/server';
import { POST } from '@/app/api/databases/[namespace]/[name]/deploy/route';

// Mock the dependencies
jest.mock('@interweb/client', () => ({
  Client: jest.fn().mockImplementation(() => ({
    deployPostgres: jest.fn(),
  })),
}));

// Mock environment variable
const originalEnv = process.env;

describe('/api/databases/[namespace]/[name]/deploy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('POST', () => {
    it('should deploy postgres successfully with all required fields', async () => {
      const mockClient = {
        deployPostgres: jest.fn().mockResolvedValue({ success: true, name: 'test-db' })
      };

      const { Client } = require('@interweb/client');
      Client.mockImplementation(() => mockClient);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 3,
          storage: '10Gi',
          storageClass: 'fast-ssd',
          enablePooler: true,
          poolerName: 'test-pooler',
          poolerInstances: 2,
          appUsername: 'appuser',
          appPassword: 'apppass',
          superuserPassword: 'superpass',
          operatorNamespace: 'cnpg-system'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.result).toEqual({ success: true, name: 'test-db' });
      expect(mockClient.deployPostgres).toHaveBeenCalledWith({
        name: 'test-db',
        namespace: 'test-ns',
        instances: 3,
        storage: '10Gi',
        storageClass: 'fast-ssd',
        enablePooler: true,
        poolerName: 'test-pooler',
        poolerInstances: 2,
        appUsername: 'appuser',
        appPassword: 'apppass',
        superuserPassword: 'superpass',
        operatorNamespace: 'cnpg-system'
      });
    });

    it('should deploy postgres with minimal required fields', async () => {
      const mockClient = {
        deployPostgres: jest.fn().mockResolvedValue({ success: true })
      };

      const { Client } = require('@interweb/client');
      Client.mockImplementation(() => mockClient);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appUsername: 'appuser',
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(mockClient.deployPostgres).toHaveBeenCalledWith({
        name: 'test-db',
        namespace: 'test-ns',
        instances: 1,
        storage: '5Gi',
        storageClass: undefined,
        enablePooler: true,
        poolerName: undefined,
        poolerInstances: undefined,
        appUsername: 'appuser',
        appPassword: 'apppass',
        superuserPassword: 'superpass',
        operatorNamespace: 'cnpg-system'
      });
    });

    it('should return 400 when instances is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          storage: '5Gi',
          appUsername: 'appuser',
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: instances');
    });

    it('should return 400 when storage is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          appUsername: 'appuser',
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: storage');
    });

    it('should return 400 when appUsername is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: appUsername');
    });

    it('should return 400 when appPassword is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appUsername: 'appuser',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: appPassword');
    });

    it('should return 400 when superuserPassword is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appUsername: 'appuser',
          appPassword: 'apppass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: superuserPassword');
    });

    it('should return 400 when field is empty string', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '',
          appUsername: 'appuser',
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: storage');
    });

    it('should return 400 when field is null', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appUsername: null,
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: appUsername');
    });

    it('should return 400 when field is undefined', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appUsername: 'appuser',
          appPassword: undefined,
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: appPassword');
    });

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required field: instances');
    });

    it('should handle deployment errors', async () => {
      const mockClient = {
        deployPostgres: jest.fn().mockRejectedValue(new Error('Deployment failed'))
      };

      const { Client } = require('@interweb/client');
      Client.mockImplementation(() => mockClient);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appUsername: 'appuser',
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Deployment failed');
    });

    it('should handle unexpected errors', async () => {
      const mockClient = {
        deployPostgres: jest.fn().mockRejectedValue('String error')
      };

      const { Client } = require('@interweb/client');
      Client.mockImplementation(() => mockClient);

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appUsername: 'appuser',
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('String error');
    });

    it('should use custom KUBERNETES_PROXY_URL when set', async () => {
      process.env.KUBERNETES_PROXY_URL = 'http://custom-proxy:8001';

      const mockClient = {
        deployPostgres: jest.fn().mockResolvedValue({ success: true })
      };

      const { Client } = require('@interweb/client');
      Client.mockImplementation((config) => {
        expect(config.restEndpoint).toBe('http://custom-proxy:8001');
        return mockClient;
      });

      const request = new NextRequest('http://localhost:3000/api/databases/test-ns/test-db/deploy', {
        method: 'POST',
        body: JSON.stringify({
          instances: 1,
          storage: '5Gi',
          appUsername: 'appuser',
          appPassword: 'apppass',
          superuserPassword: 'superpass'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ namespace: 'test-ns', name: 'test-db' });

      const response = await POST(request, { params });

      expect(response.status).toBe(200);
    });
  });
});
