import { NextRequest } from 'next/server';

import { POST } from '@/app/api/init/route';

// Mock crypto module
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid-123'),
}));

describe('/api/init', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should initialize project successfully with valid data', async () => {
      const requestBody = {
        projectName: 'test-project',
        projectPath: '/path/to/project',
        instanceId: 'instance-123',
      };

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        sessionId: 'mock-uuid-123',
        projectId: 'mock-uuid-123',
        projectName: 'test-project',
        projectPath: '/path/to/project',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Initializing project:', {
        projectName: 'test-project',
        projectPath: '/path/to/project',
        instanceId: 'instance-123',
        sessionId: 'mock-uuid-123',
        projectId: 'mock-uuid-123',
      });

      consoleSpy.mockRestore();
    });

    it('should return 400 when projectName is missing', async () => {
      const requestBody = {
        projectPath: '/path/to/project',
        instanceId: 'instance-123',
      };

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Missing required fields: projectName, projectPath, or instanceId',
      });
    });

    it('should return 400 when projectPath is missing', async () => {
      const requestBody = {
        projectName: 'test-project',
        instanceId: 'instance-123',
      };

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Missing required fields: projectName, projectPath, or instanceId',
      });
    });

    it('should return 400 when instanceId is missing', async () => {
      const requestBody = {
        projectName: 'test-project',
        projectPath: '/path/to/project',
      };

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Missing required fields: projectName, projectPath, or instanceId',
      });
    });

    it('should return 400 when all fields are missing', async () => {
      const requestBody = {};

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Missing required fields: projectName, projectPath, or instanceId',
      });
    });

    it('should return 400 when fields are empty strings', async () => {
      const requestBody = {
        projectName: '',
        projectPath: '',
        instanceId: '',
      };

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Missing required fields: projectName, projectPath, or instanceId',
      });
    });

    it('should return 400 when fields are null', async () => {
      const requestBody = {
        projectName: null,
        projectPath: null,
        instanceId: null,
      };

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Missing required fields: projectName, projectPath, or instanceId',
      });
    });

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/init', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: 'Missing required fields: projectName, projectPath, or instanceId',
      });
    });

    it('should handle unexpected errors', async () => {
      const requestBody = {
        projectName: 'test-project',
        projectPath: '/path/to/project',
        instanceId: 'instance-123',
      };

      // Mock randomUUID to throw an error
      const { randomUUID } = require('crypto');
      randomUUID.mockImplementation(() => {
        throw new Error('Crypto error');
      });

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to initialize project',
      });
      expect(consoleSpy).toHaveBeenCalledWith('Failed to initialize project:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle different data types for required fields', async () => {
      // Reset crypto mock to default behavior
      const { randomUUID } = require('crypto');
      randomUUID.mockReturnValue('mock-uuid-123');

      const requestBody = {
        projectName: 123, // number instead of string
        projectPath: '/path/to/project',
        instanceId: 'instance-123',
      };

      const request = new Request('http://localhost:3000/api/init', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;

      const response = await POST(request);
      const data = await response.json();

      // Should still work as truthy values pass the validation
      expect(response.status).toBe(200);
      expect(data.projectName).toBe(123);
    });
  });
});
