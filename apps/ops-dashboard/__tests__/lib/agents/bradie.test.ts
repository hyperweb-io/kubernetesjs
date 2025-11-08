import BradieClient, { BradieSession, BradieActRequest, BradieActResponse } from '@/lib/agents/bradie';

// Use the global mockFetch from setup
const mockFetch = (global as any).mockFetch;

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123')
}));

describe('lib/agents/bradie', () => {
  let client: BradieClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new BradieClient('http://localhost:3001');
  });

  describe('constructor', () => {
    it('should use default baseUrl when not provided', () => {
      const defaultClient = new BradieClient();
      expect(defaultClient).toBeInstanceOf(BradieClient);
    });

    it('should use provided baseUrl and remove trailing slash', () => {
      const clientWithSlash = new BradieClient('http://localhost:3001/');
      expect(clientWithSlash).toBeInstanceOf(BradieClient);
    });
  });

  describe('checkHealth', () => {
    it('should return true when health check succeeds', async () => {
      const mockResponse = {
        ok: true
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.checkHealth();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toBe(true);
    });

    it('should return false when health check fails', async () => {
      const mockResponse = {
        ok: false
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.checkHealth();

      expect(result).toBe(false);
    });

    it('should return false when health check throws error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await client.checkHealth();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Bradie health check failed:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('createSession', () => {
    it('should create session with provided name and path', async () => {
      const session = await client.createSession('Test Session', '/test/path');

      expect(session).toEqual({
        id: 'mock-uuid-123',
        name: 'Test Session',
        path: '/test/path',
        createdAt: expect.any(Date)
      });
    });

    it('should create session with different name and path', async () => {
      const session = await client.createSession('Another Session', '/another/path');

      expect(session).toEqual({
        id: 'mock-uuid-123',
        name: 'Another Session',
        path: '/another/path',
        createdAt: expect.any(Date)
      });
    });

    it('should create session with empty strings', async () => {
      const session = await client.createSession('', '');

      expect(session).toEqual({
        id: 'mock-uuid-123',
        name: '',
        path: '',
        createdAt: expect.any(Date)
      });
    });
  });

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'pending',
          response: 'Initial response'
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.sendMessage('session-123', 'Hello Bradie');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/act', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'session-123',
          user_input: 'Hello Bradie'
        } as BradieActRequest)
      });
      expect(result).toEqual({
        id: 'response-123',
        status: 'pending',
        response: 'Initial response'
      });
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };
      mockFetch.mockResolvedValue(mockResponse);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(client.sendMessage('session-123', 'Hello')).rejects.toThrow('Bradie request failed: 500 Internal Server Error');
      expect(consoleSpy).toHaveBeenCalledWith('Error sending message to Bradie:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(client.sendMessage('session-123', 'Hello')).rejects.toThrow('Network error');
      expect(consoleSpy).toHaveBeenCalledWith('Error sending message to Bradie:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('pollResponse', () => {
    it('should poll response successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'completed',
          response: 'Final response'
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.pollResponse('response-123');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/act/response-123', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual({
        id: 'response-123',
        status: 'completed',
        response: 'Final response'
      });
    });

    it('should throw error when polling fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };
      mockFetch.mockResolvedValue(mockResponse);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(client.pollResponse('response-123')).rejects.toThrow('Failed to poll response: 404 Not Found');
      expect(consoleSpy).toHaveBeenCalledWith('Error polling Bradie response:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('sendMessageAndWait', () => {
    it('should send message and wait for completion', async () => {
      const mockInitialResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'pending',
          response: 'Initial response'
        })
      };

      const mockPollResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'completed',
          response: 'Final response'
        })
      };

      mockFetch
        .mockResolvedValueOnce(mockInitialResponse)
        .mockResolvedValueOnce(mockPollResponse);

      const onUpdate = jest.fn();
      const result = await client.sendMessageAndWait('session-123', 'Hello', onUpdate);

      expect(result).toBe('Final response');
      expect(onUpdate).toHaveBeenCalledTimes(2);
      expect(onUpdate).toHaveBeenNthCalledWith(1, {
        id: 'response-123',
        status: 'pending',
        response: 'Initial response'
      });
      expect(onUpdate).toHaveBeenNthCalledWith(2, {
        id: 'response-123',
        status: 'completed',
        response: 'Final response'
      });
    });

    it('should handle failed status', async () => {
      const mockInitialResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'pending',
          response: 'Initial response'
        })
      };

      const mockPollResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'failed',
          error: 'Something went wrong'
        })
      };

      mockFetch
        .mockResolvedValueOnce(mockInitialResponse)
        .mockResolvedValueOnce(mockPollResponse);

      const onUpdate = jest.fn();
      
      await expect(client.sendMessageAndWait('session-123', 'Hello', onUpdate)).rejects.toThrow('Something went wrong');
    });

    it('should handle running status and continue polling', async () => {
      const mockInitialResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'pending',
          response: 'Initial response'
        })
      };

      const mockRunningResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'running',
          response: 'Still processing'
        })
      };

      const mockCompletedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'completed',
          response: 'Final response'
        })
      };

      mockFetch
        .mockResolvedValueOnce(mockInitialResponse)
        .mockResolvedValueOnce(mockRunningResponse)
        .mockResolvedValueOnce(mockCompletedResponse);

      const onUpdate = jest.fn();
      const result = await client.sendMessageAndWait('session-123', 'Hello', onUpdate);

      expect(result).toBe('Final response');
      expect(onUpdate).toHaveBeenCalledTimes(3);
    });
  });

  describe('generateStreamingResponse', () => {
    it('should generate streaming response with chunks', async () => {
      const mockInitialResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'pending',
          response: 'Hello'
        })
      };

      const mockUpdatedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'completed',
          response: 'Hello World'
        })
      };

      mockFetch
        .mockResolvedValueOnce(mockInitialResponse)
        .mockResolvedValueOnce(mockUpdatedResponse);

      const onChunk = jest.fn();
      const onStatusUpdate = jest.fn();
      await client.generateStreamingResponse('session-123', 'Hello', onChunk, onStatusUpdate);

      expect(onChunk).toHaveBeenCalledWith('Hello');
      expect(onChunk).toHaveBeenCalledWith(' World');
      expect(onStatusUpdate).toHaveBeenCalledWith('pending');
      expect(onStatusUpdate).toHaveBeenCalledWith('completed');
    });

    it('should handle no new content in response', async () => {
      const mockInitialResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'pending',
          response: 'Hello'
        })
      };

      const mockUpdatedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'completed',
          response: 'Hello' // Same content
        })
      };

      mockFetch
        .mockResolvedValueOnce(mockInitialResponse)
        .mockResolvedValueOnce(mockUpdatedResponse);

      const onChunk = jest.fn();
      await client.generateStreamingResponse('session-123', 'Hello', onChunk);

      expect(onChunk).toHaveBeenCalledWith('Hello');
      expect(onChunk).toHaveBeenCalledTimes(1); // Only called once for initial content
    });

    it('should handle empty response', async () => {
      const mockInitialResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'pending',
          response: ''
        })
      };

      const mockUpdatedResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 'response-123',
          status: 'completed',
          response: 'Hello'
        })
      };

      mockFetch
        .mockResolvedValueOnce(mockInitialResponse)
        .mockResolvedValueOnce(mockUpdatedResponse);

      const onChunk = jest.fn();
      await client.generateStreamingResponse('session-123', 'Hello', onChunk);

      expect(onChunk).toHaveBeenCalledWith('Hello');
    });
  });
});
