import OllamaClient, { GenerateInput } from '@/lib/agents/ollama';

// Use the global mockFetch from setup
const mockFetch = (global as any).mockFetch;

describe('lib/agents/ollama', () => {
  let client: OllamaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new OllamaClient('http://localhost:11434');
  });

  describe('constructor', () => {
    it('should use default baseUrl when not provided', () => {
      const defaultClient = new OllamaClient();
      expect(defaultClient).toBeInstanceOf(OllamaClient);
    });

    it('should use provided baseUrl', () => {
      const customClient = new OllamaClient('http://custom:8080');
      expect(customClient).toBeInstanceOf(OllamaClient);
    });
  });

  describe('listModels', () => {
    it('should return list of models', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          tags: ['llama2', 'mistral', 'codellama']
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.listModels();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/tags');
      expect(result).toEqual(['llama2', 'mistral', 'codellama']);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.listModels()).rejects.toThrow('Failed to list models: 500 Internal Server Error');
    });
  });

  describe('generate', () => {
    const mockInput: GenerateInput = {
      model: 'llama2',
      prompt: 'Hello, world!'
    };

    it('should generate text successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          model: 'llama2',
          created_at: '2024-01-01T00:00:00Z',
          response: 'Hello! How can I help you today?',
          done: true
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.generate(mockInput);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mockInput,
          stream: false
        })
      });
      expect(result).toBe('Hello! How can I help you today?');
    });

    it('should throw error with JSON error message', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({
          message: 'Invalid model name'
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.generate(mockInput)).rejects.toThrow('Generate request failed: 400 Bad Request - Invalid model name');
    });

    it('should throw error with text fallback when JSON parsing fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        text: jest.fn().mockResolvedValue('Server error occurred')
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.generate(mockInput)).rejects.toThrow('Generate request failed: 500 Internal Server Error - Server error occurred');
    });
  });

  describe('pullModel', () => {
    it('should pull model successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      };
      mockFetch.mockResolvedValue(mockResponse);

      await client.pullModel('llama2');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'llama2' })
      });
    });

    it('should throw error when pull fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({
          message: 'Model not found'
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.pullModel('nonexistent')).rejects.toThrow('Pull model failed: 404 Not Found - Model not found');
    });

    it('should throw error with text fallback when JSON parsing fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        text: jest.fn().mockResolvedValue('Server error occurred')
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.pullModel('llama2')).rejects.toThrow('Pull model failed: 500 Internal Server Error - Server error occurred');
    });
  });

  describe('deleteModel', () => {
    it('should delete model successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      };
      mockFetch.mockResolvedValue(mockResponse);

      await client.deleteModel('llama2');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'llama2' })
      });
    });

    it('should throw error when delete fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: jest.fn().mockResolvedValue('Delete failed')
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.deleteModel('llama2')).rejects.toThrow('Delete model failed: 500 Internal Server Error - Delete failed');
    });

    it('should throw error with text fallback when JSON parsing fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        text: jest.fn().mockResolvedValue('Server error occurred')
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.deleteModel('llama2')).rejects.toThrow('Delete model failed: 500 Internal Server Error - Server error occurred');
    });
  });

  describe('generateEmbedding', () => {
    it('should generate embedding successfully', async () => {
      const mockEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          embedding: mockEmbedding
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.generateEmbedding('test text');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: 'test text',
        })
      });
      expect(result).toEqual(mockEmbedding);
    });

    it('should throw error when embedding generation fails', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Bad Request'
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.generateEmbedding('test')).rejects.toThrow('Failed to generate embedding: Bad Request');
    });
  });

  describe('generateResponse', () => {
    it('should generate response without context', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          model: 'mistral',
          created_at: '2024-01-01T00:00:00Z',
          response: 'This is a response',
          done: true
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.generateResponse('test prompt');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: 'test prompt',
          stream: false,
        })
      });
      expect(result).toBe('This is a response');
    });

    it('should generate response with context', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          model: 'mistral',
          created_at: '2024-01-01T00:00:00Z',
          response: 'This is a contextual response',
          done: true
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.generateResponse('test prompt', 'some context');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: 'Context: some context\n\nQuestion: test prompt\n\nAnswer:',
          stream: false,
        })
      });
      expect(result).toBe('This is a contextual response');
    });

    it('should throw error when generation fails', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error'
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.generateResponse('test')).rejects.toThrow('Failed to generate response: Internal Server Error');
    });
  });

  describe('generateStreamingResponse', () => {
    let mockReader: any;
    let mockOnChunk: jest.Mock;

    beforeEach(() => {
      mockOnChunk = jest.fn();
      mockReader = {
        read: jest.fn()
      };
    });

    it('should handle streaming response successfully', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue(mockReader)
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Mock streaming chunks
      mockReader.read
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('{"response":"Hello"}\n')
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('{"response":" World"}\n')
        })
        .mockResolvedValueOnce({
          done: true,
          value: undefined
        });

      await client.generateStreamingResponse('test prompt', mockOnChunk);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: 'test prompt',
          stream: true,
        })
      });
      expect(mockOnChunk).toHaveBeenCalledWith('Hello');
      expect(mockOnChunk).toHaveBeenCalledWith(' World');
    });

    it('should handle streaming response with context', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue(mockReader)
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      mockReader.read.mockResolvedValueOnce({
        done: true,
        value: undefined
      });

      await client.generateStreamingResponse('test prompt', mockOnChunk, 'some context');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: 'Context: some context\n\nQuestion: test prompt\n\nAnswer:',
          stream: true,
        })
      });
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Bad Request'
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.generateStreamingResponse('test', mockOnChunk)).rejects.toThrow('Failed to generate streaming response: Bad Request');
    });

    it('should throw error when reader is not available', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue(null)
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.generateStreamingResponse('test', mockOnChunk)).rejects.toThrow('Failed to get response reader');
    });

    it('should handle JSON parsing errors gracefully', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue(mockReader)
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockReader.read
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('invalid json\n')
        })
        .mockResolvedValueOnce({
          done: true,
          value: undefined
        });

      await client.generateStreamingResponse('test', mockOnChunk);

      expect(consoleSpy).toHaveBeenCalledWith('Error parsing chunk:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should handle empty response chunks', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue(mockReader)
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      mockReader.read
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('{"response":""}\n')
        })
        .mockResolvedValueOnce({
          done: true,
          value: undefined
        });

      await client.generateStreamingResponse('test', mockOnChunk);

      // Empty response chunks are not passed to onChunk since they're falsy
      expect(mockOnChunk).not.toHaveBeenCalled();
    });

    it('should handle multiple lines in a single chunk', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue(mockReader)
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      mockReader.read
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('{"response":"Hello"}\n{"response":" World"}\n')
        })
        .mockResolvedValueOnce({
          done: true,
          value: undefined
        });

      await client.generateStreamingResponse('test', mockOnChunk);

      expect(mockOnChunk).toHaveBeenCalledWith('Hello');
      expect(mockOnChunk).toHaveBeenCalledWith(' World');
    });

    it('should handle chunks without newlines', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn().mockReturnValue(mockReader)
        }
      };
      mockFetch.mockResolvedValue(mockResponse);

      mockReader.read
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('{"response":"Hello"}')
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('{"response":" World"}\n')
        })
        .mockResolvedValueOnce({
          done: true,
          value: undefined
        });

      await client.generateStreamingResponse('test', mockOnChunk);

      expect(mockOnChunk).toHaveBeenCalledWith('Hello');
      expect(mockOnChunk).toHaveBeenCalledWith(' World');
    });
  });
});
