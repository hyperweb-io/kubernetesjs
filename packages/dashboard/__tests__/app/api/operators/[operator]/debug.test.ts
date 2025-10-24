import { NextRequest } from 'next/server';
import { GET } from '@/app/api/operators/[operator]/debug/route';

// Mock the dependencies
jest.mock('@/k8s/client', () => ({
  createSetupClient: jest.fn(),
}));

describe('/api/operators/[operator]/debug', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return operator debug info successfully', async () => {
      const mockDebugInfo = {
        operator: 'postgres-operator',
        status: 'installed',
        version: '1.0.0',
        namespace: 'postgres-operator-system',
        pods: [
          { name: 'postgres-operator-123', status: 'Running' }
        ],
        logs: ['Debug log line 1', 'Debug log line 2']
      };

      const mockSetupClient = {
        getOperatorDebug: jest.fn().mockResolvedValue(mockDebugInfo)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/debug');
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockDebugInfo);
      expect(createSetupClient).toHaveBeenCalled();
      expect(mockSetupClient.getOperatorDebug).toHaveBeenCalledWith('postgres-operator');
    });

    it('should handle setup client errors', async () => {
      const mockSetupClient = {
        getOperatorDebug: jest.fn().mockRejectedValue(new Error('Debug info error'))
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/debug');
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch operator debug');
      expect(data.message).toBe('Debug info error');
    });

    it('should handle non-Error exceptions', async () => {
      const mockSetupClient = {
        getOperatorDebug: jest.fn().mockRejectedValue('String error')
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/debug');
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch operator debug');
      expect(data.message).toBe('Unknown error');
    });

    it('should handle different operator names', async () => {
      const mockDebugInfo = {
        operator: 'redis-operator',
        status: 'not-installed',
        error: 'Operator not found'
      };

      const mockSetupClient = {
        getOperatorDebug: jest.fn().mockResolvedValue(mockDebugInfo)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/redis-operator/debug');
      const params = Promise.resolve({ operator: 'redis-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockDebugInfo);
      expect(mockSetupClient.getOperatorDebug).toHaveBeenCalledWith('redis-operator');
    });

    it('should handle empty debug info', async () => {
      const mockDebugInfo = {};

      const mockSetupClient = {
        getOperatorDebug: jest.fn().mockResolvedValue(mockDebugInfo)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/unknown-operator/debug');
      const params = Promise.resolve({ operator: 'unknown-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({});
    });

    it('should handle null debug info', async () => {
      const mockSetupClient = {
        getOperatorDebug: jest.fn().mockResolvedValue(null)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/test-operator/debug');
      const params = Promise.resolve({ operator: 'test-operator' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBeNull();
    });
  });
});
