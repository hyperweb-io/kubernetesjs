import { GET } from '@/app/api/instance-id/route';

// Mock crypto module
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid-123'),
}));

describe('/api/instance-id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return instance ID successfully', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        instanceId: 'mock-uuid-123',
      });
    });

    it('should return the same instance ID on subsequent calls', async () => {
      const response1 = await GET();
      const data1 = await response1.json();

      const response2 = await GET();
      const data2 = await response2.json();

      expect(data1.instanceId).toBe(data2.instanceId);
      expect(data1.instanceId).toBe('mock-uuid-123');
    });

    it('should handle crypto errors gracefully', async () => {
      // Reset the module to clear the cached instanceId
      jest.resetModules();
      
      // Mock crypto.randomUUID to throw an error
      jest.doMock('crypto', () => ({
        randomUUID: jest.fn(() => {
          throw new Error('Crypto error');
        })
      }));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { GET: GETWithError } = require('@/app/api/instance-id/route');
      const response = await GETWithError();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to get instance ID',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get instance ID:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle unexpected errors', async () => {
      // Reset the module to clear the cached instanceId
      jest.resetModules();
      
      // Mock crypto.randomUUID to throw an error
      jest.doMock('crypto', () => ({
        randomUUID: jest.fn(() => {
          throw new Error('Module error');
        })
      }));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { GET: GETWithError } = require('@/app/api/instance-id/route');
      const response = await GETWithError();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to get instance ID',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get instance ID:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});