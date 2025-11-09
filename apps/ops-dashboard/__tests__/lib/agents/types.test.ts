import { AgentConfig,Message, Session } from '@/lib/agents/types';

describe('lib/agents/types', () => {
  describe('Session interface', () => {
    it('should have correct properties', () => {
      const session: Session = {
        id: 'session-123',
        name: 'Test Session',
        path: '/test/path',
        createdAt: new Date('2024-01-01T00:00:00Z')
      };

      expect(session.id).toBe('session-123');
      expect(session.name).toBe('Test Session');
      expect(session.path).toBe('/test/path');
      expect(session.createdAt).toBeInstanceOf(Date);
    });

    it('should work with different session data', () => {
      const session: Session = {
        id: 'another-session',
        name: 'Another Session',
        path: '/another/path',
        createdAt: new Date('2024-01-02T12:00:00Z')
      };

      expect(session.id).toBe('another-session');
      expect(session.name).toBe('Another Session');
      expect(session.path).toBe('/another/path');
      expect(session.createdAt.toISOString()).toBe('2024-01-02T12:00:00.000Z');
    });
  });

  describe('Message interface', () => {
    it('should have correct properties for user message', () => {
      const message: Message = {
        id: 'msg-123',
        role: 'user',
        content: 'Hello, how are you?',
        timestamp: new Date('2024-01-01T00:00:00Z')
      };

      expect(message.id).toBe('msg-123');
      expect(message.role).toBe('user');
      expect(message.content).toBe('Hello, how are you?');
      expect(message.timestamp).toBeInstanceOf(Date);
      expect(message.agent).toBeUndefined();
    });

    it('should have correct properties for assistant message with agent', () => {
      const message: Message = {
        id: 'msg-456',
        role: 'assistant',
        content: 'I am doing well, thank you!',
        timestamp: new Date('2024-01-01T00:01:00Z'),
        agent: 'bradie'
      };

      expect(message.id).toBe('msg-456');
      expect(message.role).toBe('assistant');
      expect(message.content).toBe('I am doing well, thank you!');
      expect(message.timestamp).toBeInstanceOf(Date);
      expect(message.agent).toBe('bradie');
    });

    it('should have correct properties for system message', () => {
      const message: Message = {
        id: 'msg-789',
        role: 'system',
        content: 'System initialization complete',
        timestamp: new Date('2024-01-01T00:00:30Z'),
        agent: 'ollama'
      };

      expect(message.id).toBe('msg-789');
      expect(message.role).toBe('system');
      expect(message.content).toBe('System initialization complete');
      expect(message.timestamp).toBeInstanceOf(Date);
      expect(message.agent).toBe('ollama');
    });

    it('should work with all role types', () => {
      const userMessage: Message = {
        id: '1',
        role: 'user',
        content: 'User message',
        timestamp: new Date()
      };

      const assistantMessage: Message = {
        id: '2',
        role: 'assistant',
        content: 'Assistant message',
        timestamp: new Date()
      };

      const systemMessage: Message = {
        id: '3',
        role: 'system',
        content: 'System message',
        timestamp: new Date()
      };

      expect(userMessage.role).toBe('user');
      expect(assistantMessage.role).toBe('assistant');
      expect(systemMessage.role).toBe('system');
    });

    it('should work with all agent types', () => {
      const bradieMessage: Message = {
        id: '1',
        role: 'assistant',
        content: 'Bradie response',
        timestamp: new Date(),
        agent: 'bradie'
      };

      const ollamaMessage: Message = {
        id: '2',
        role: 'assistant',
        content: 'Ollama response',
        timestamp: new Date(),
        agent: 'ollama'
      };

      expect(bradieMessage.agent).toBe('bradie');
      expect(ollamaMessage.agent).toBe('ollama');
    });
  });

  describe('AgentConfig interface', () => {
    it('should have correct properties for bradie config', () => {
      const config: AgentConfig = {
        agent: 'bradie',
        endpoint: 'http://localhost:3001',
        bradieDomain: 'https://api.bradie.com',
        model: 'gpt-4',
        session: {
          id: 'session-123',
          name: 'Test Session',
          path: '/test',
          createdAt: new Date('2024-01-01T00:00:00Z')
        }
      };

      expect(config.agent).toBe('bradie');
      expect(config.endpoint).toBe('http://localhost:3001');
      expect(config.bradieDomain).toBe('https://api.bradie.com');
      expect(config.model).toBe('gpt-4');
      expect(config.session).toBeDefined();
      expect(config.session?.id).toBe('session-123');
    });

    it('should have correct properties for ollama config', () => {
      const config: AgentConfig = {
        agent: 'ollama',
        endpoint: 'http://localhost:11434',
        model: 'llama2'
      };

      expect(config.agent).toBe('ollama');
      expect(config.endpoint).toBe('http://localhost:11434');
      expect(config.model).toBe('llama2');
      expect(config.bradieDomain).toBeUndefined();
      expect(config.session).toBeUndefined();
    });

    it('should work with minimal config', () => {
      const config: AgentConfig = {
        agent: 'ollama',
        endpoint: 'http://localhost:11434'
      };

      expect(config.agent).toBe('ollama');
      expect(config.endpoint).toBe('http://localhost:11434');
      expect(config.model).toBeUndefined();
      expect(config.bradieDomain).toBeUndefined();
      expect(config.session).toBeUndefined();
    });

    it('should work with null session', () => {
      const config: AgentConfig = {
        agent: 'bradie',
        endpoint: 'http://localhost:3001',
        session: null
      };

      expect(config.agent).toBe('bradie');
      expect(config.endpoint).toBe('http://localhost:3001');
      expect(config.session).toBeNull();
    });

    it('should work with all agent types', () => {
      const bradieConfig: AgentConfig = {
        agent: 'bradie',
        endpoint: 'http://localhost:3001'
      };

      const ollamaConfig: AgentConfig = {
        agent: 'ollama',
        endpoint: 'http://localhost:11434'
      };

      expect(bradieConfig.agent).toBe('bradie');
      expect(ollamaConfig.agent).toBe('ollama');
    });
  });

  describe('type compatibility', () => {
    it('should be compatible with actual usage patterns', () => {
      // Test Session usage
      const createSession = (id: string, name: string, path: string): Session => ({
        id,
        name,
        path,
        createdAt: new Date()
      });

      const session = createSession('test-123', 'Test', '/test');
      expect(session).toMatchObject({
        id: 'test-123',
        name: 'Test',
        path: '/test',
        createdAt: expect.any(Date)
      });

      // Test Message usage
      const createMessage = (id: string, role: 'user' | 'assistant' | 'system', content: string): Message => ({
        id,
        role,
        content,
        timestamp: new Date()
      });

      const message = createMessage('msg-123', 'user', 'Hello');
      expect(message).toMatchObject({
        id: 'msg-123',
        role: 'user',
        content: 'Hello',
        timestamp: expect.any(Date)
      });

      // Test AgentConfig usage
      const createConfig = (agent: 'bradie' | 'ollama', endpoint: string): AgentConfig => ({
        agent,
        endpoint
      });

      const config = createConfig('bradie', 'http://localhost:3001');
      expect(config).toMatchObject({
        agent: 'bradie',
        endpoint: 'http://localhost:3001'
      });
    });
  });
});
