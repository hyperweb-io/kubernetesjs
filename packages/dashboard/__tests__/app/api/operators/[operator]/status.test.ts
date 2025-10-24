import { NextRequest } from 'next/server';
import { GET } from '@/app/api/operators/[operator]/status/route';

// Mock the dependencies
jest.mock('@/k8s/client', () => ({
  createSetupClient: jest.fn(),
}));

describe('/api/operators/[operator]/status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return operator status successfully', async () => {
      const mockStatus = {
        operator: 'postgres-operator',
        installed: true,
        version: '1.0.0',
        namespace: 'postgres-operator-system',
        status: 'Running',
        pods: [
          { name: 'postgres-operator-123', status: 'Running', ready: true }
        ],
        lastUpdated: '2024-01-01T00:00:00Z'
      };

      const mockSetupClient = {
        getOperatorInstallations: jest.fn().mockResolvedValue(mockStatus)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/status');
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockStatus);
      expect(createSetupClient).toHaveBeenCalled();
      expect(mockSetupClient.getOperatorInstallations).toHaveBeenCalledWith('postgres-operator');
    });

    it('should return not installed status', async () => {
      const mockStatus = {
        operator: 'redis-operator',
        installed: false,
        status: 'Not Found'
      };

      const mockSetupClient = {
        getOperatorInstallations: jest.fn().mockResolvedValue(mockStatus)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/redis-operator/status');
      const params = Promise.resolve({ operator: 'redis-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockStatus);
      expect(mockSetupClient.getOperatorInstallations).toHaveBeenCalledWith('redis-operator');
    });

    it('should return empty status for unknown operator', async () => {
      const mockStatus = {};

      const mockSetupClient = {
        getOperatorInstallations: jest.fn().mockResolvedValue(mockStatus)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/unknown-operator/status');
      const params = Promise.resolve({ operator: 'unknown-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({});
    });

    it('should return null status', async () => {
      const mockSetupClient = {
        getOperatorInstallations: jest.fn().mockResolvedValue(null)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/test-operator/status');
      const params = Promise.resolve({ operator: 'test-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBeNull();
    });

    it('should handle setup client errors', async () => {
      const mockSetupClient = {
        getOperatorInstallations: jest.fn().mockRejectedValue(new Error('Status check failed'))
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/status');
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch operator status');
      expect(data.message).toBe('Status check failed');
    });

    it('should handle non-Error exceptions', async () => {
      const mockSetupClient = {
        getOperatorInstallations: jest.fn().mockRejectedValue('String error')
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/status');
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch operator status');
      expect(data.message).toBe('Unknown error');
    });

    it('should handle different operator names', async () => {
      const mockStatus = {
        operator: 'nginx-operator',
        installed: true,
        version: '2.0.0',
        namespace: 'nginx-operator-system'
      };

      const mockSetupClient = {
        getOperatorInstallations: jest.fn().mockResolvedValue(mockStatus)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/nginx-operator/status');
      const params = Promise.resolve({ operator: 'nginx-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockStatus);
      expect(mockSetupClient.getOperatorInstallations).toHaveBeenCalledWith('nginx-operator');
    });

    it('should handle complex status with multiple installations', async () => {
      const mockStatus = {
        operator: 'postgres-operator',
        installations: [
          {
            name: 'postgres-operator-1',
            version: '1.0.0',
            namespace: 'postgres-operator-system',
            status: 'Running'
          },
          {
            name: 'postgres-operator-2',
            version: '1.1.0',
            namespace: 'postgres-operator-system-2',
            status: 'Running'
          }
        ],
        totalInstalled: 2
      };

      const mockSetupClient = {
        getOperatorInstallations: jest.fn().mockResolvedValue(mockStatus)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/status');
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockStatus);
      expect(data.totalInstalled).toBe(2);
      expect(data.installations).toHaveLength(2);
    });
  });
});
