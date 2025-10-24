import { GET } from '@/app/api/cluster/status/route';
import { createSetupClient } from '@/k8s/client';

// Mock the k8s client
jest.mock('@/k8s/client', () => ({
  createSetupClient: jest.fn(),
}));

const mockCreateSetupClient = createSetupClient as jest.MockedFunction<typeof createSetupClient>;

describe('/api/cluster/status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return cluster status successfully', async () => {
      const mockClusterOverview = {
        healthy: true,
        nodeCount: 3,
        podCount: 15,
        serviceCount: 8,
        operatorCount: 2,
        version: 'v1.28.0',
        nodes: [
          { name: 'node-1', status: 'Ready' },
          { name: 'node-2', status: 'Ready' },
        ],
      };

      const mockSetupClient = {
        getClusterOverview: jest.fn().mockResolvedValue(mockClusterOverview),
      };

      mockCreateSetupClient.mockReturnValue(mockSetupClient as any);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockClusterOverview);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(mockSetupClient.getClusterOverview).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully and return error response', async () => {
      const mockError = new Error('Connection failed');
      const mockSetupClient = {
        getClusterOverview: jest.fn().mockRejectedValue(mockError),
      };

      mockCreateSetupClient.mockReturnValue(mockSetupClient as any);

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to fetch cluster status',
        message: 'Connection failed',
        healthy: false,
        nodeCount: 0,
        podCount: 0,
        serviceCount: 0,
        operatorCount: 0,
        version: 'unknown',
        nodes: [],
      });
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch cluster status:', mockError);
      
      consoleSpy.mockRestore();
    });

    it('should handle non-Error exceptions', async () => {
      const mockSetupClient = {
        getClusterOverview: jest.fn().mockRejectedValue('String error'),
      };

      mockCreateSetupClient.mockReturnValue(mockSetupClient as any);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to fetch cluster status',
        message: 'Unknown error',
        healthy: false,
        nodeCount: 0,
        podCount: 0,
        serviceCount: 0,
        operatorCount: 0,
        version: 'unknown',
        nodes: [],
      });
      
      consoleSpy.mockRestore();
    });

    it('should handle null/undefined error', async () => {
      const mockSetupClient = {
        getClusterOverview: jest.fn().mockRejectedValue(null),
      };

      mockCreateSetupClient.mockReturnValue(mockSetupClient as any);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('Unknown error');
      
      consoleSpy.mockRestore();
    });
  });
});
