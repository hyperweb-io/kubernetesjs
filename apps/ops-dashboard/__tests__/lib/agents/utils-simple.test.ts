import {
  AgentType,
  clearAgentConfig,
  getAgentConfig,
  getBradieDomain,
  getCurrentAgent,
  setAgent,
  setAgentConfig,
  setBradieDomain,
} from '@/lib/agents/utils';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock global localStorage
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

describe('Agent Utils - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  describe('getCurrentAgent', () => {
    it('should return ollama when localStorage returns null', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = getCurrentAgent();
      
      expect(result).toBe('ollama');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('ai-chat-selected-agent');
    });

    it('should return stored agent from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('bradie');
      
      const result = getCurrentAgent();
      expect(result).toBe('bradie');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('ai-chat-selected-agent');
    });

    it('should return whatever is in localStorage (no validation)', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-agent');
      
      const result = getCurrentAgent();
      expect(result).toBe('invalid-agent');
    });
  });

  describe('setAgent', () => {
    it('should set agent in localStorage', () => {
      setAgent('bradie');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('ai-chat-selected-agent', 'bradie');
    });

    it('should set ollama agent in localStorage', () => {
      setAgent('ollama');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('ai-chat-selected-agent', 'ollama');
    });
  });

  describe('getBradieDomain', () => {
    it('should return default domain when localStorage returns null', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = getBradieDomain();
      expect(result).toBe('http://localhost:3001');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('ai-chat-bradie-domain');
    });

    it('should return stored domain from localStorage', () => {
      const customDomain = 'https://api.bradie.com';
      mockLocalStorage.getItem.mockReturnValue(customDomain);
      
      const result = getBradieDomain();
      expect(result).toBe(customDomain);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('ai-chat-bradie-domain');
    });
  });

  describe('setBradieDomain', () => {
    it('should set domain in localStorage', () => {
      const customDomain = 'https://api.bradie.com';
      setBradieDomain(customDomain);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('ai-chat-bradie-domain', customDomain);
    });
  });

  describe('getAgentConfig', () => {
    it('should return null when localStorage returns null', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = getAgentConfig();
      expect(result).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('ai-chat-agent-config');
    });

    it('should return null when localStorage returns empty string', () => {
      mockLocalStorage.getItem.mockReturnValue('');
      
      const result = getAgentConfig();
      expect(result).toBeNull();
    });

    it('should return parsed config from localStorage', () => {
      const config = { name: 'test', value: 123 };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(config));
      
      const result = getAgentConfig();
      expect(result).toEqual(config);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('ai-chat-agent-config');
    });

    it('should return null when JSON parsing fails', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      
      const result = getAgentConfig();
      expect(result).toBeNull();
    });

    it('should reconstruct dates in session config', () => {
      const config = {
        name: 'test',
        session: {
          createdAt: '2024-01-01T00:00:00.000Z',
          id: 'session-123',
        },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(config));
      
      const result = getAgentConfig();
      expect(result).toEqual({
        name: 'test',
        session: {
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          id: 'session-123',
        },
      });
    });

    it('should handle config without session', () => {
      const config = { name: 'test', value: 123 };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(config));
      
      const result = getAgentConfig();
      expect(result).toEqual(config);
    });

    it('should handle session without createdAt', () => {
      const config = {
        name: 'test',
        session: {
          id: 'session-123',
        },
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(config));
      
      const result = getAgentConfig();
      expect(result).toEqual(config);
    });
  });

  describe('setAgentConfig', () => {
    it('should set config in localStorage as JSON string', () => {
      const config = { name: 'test', value: 123 };
      setAgentConfig(config);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ai-chat-agent-config',
        JSON.stringify(config)
      );
    });

    it('should handle complex config objects', () => {
      const config = {
        name: 'test',
        session: {
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          id: 'session-123',
        },
        settings: {
          theme: 'dark',
          language: 'en',
        },
      };
      setAgentConfig(config);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ai-chat-agent-config',
        JSON.stringify(config)
      );
    });

    it('should handle null config', () => {
      setAgentConfig(null);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ai-chat-agent-config',
        'null'
      );
    });

    it('should handle undefined config', () => {
      setAgentConfig(undefined);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ai-chat-agent-config',
        undefined
      );
    });
  });

  describe('clearAgentConfig', () => {
    it('should remove all agent-related items from localStorage', () => {
      clearAgentConfig();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ai-chat-agent-config');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ai-chat-selected-agent');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ai-chat-bradie-domain');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('Type safety', () => {
    it('should accept valid AgentType values', () => {
      const validAgents: AgentType[] = ['bradie', 'ollama'];
      
      validAgents.forEach(agent => {
        expect(() => setAgent(agent)).not.toThrow();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle localStorage.getItem throwing an error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      // Functions will throw because they don't have error handling
      expect(() => getCurrentAgent()).toThrow('localStorage error');
      expect(() => getBradieDomain()).toThrow('localStorage error');
      expect(() => getAgentConfig()).toThrow('localStorage error');
    });

    it('should handle localStorage.setItem throwing an error', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      // Functions will throw because they don't have error handling
      expect(() => setAgent('bradie')).toThrow('localStorage error');
      expect(() => setBradieDomain('https://api.com')).toThrow('localStorage error');
      expect(() => setAgentConfig({})).toThrow('localStorage error');
    });

    it('should handle localStorage.removeItem throwing an error', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      // Function will throw because it doesn't have error handling
      expect(() => clearAgentConfig()).toThrow('localStorage error');
    });
  });
});