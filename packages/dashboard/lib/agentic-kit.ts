import {
  AgentKit,
  OllamaAdapter,
  BradieAdapter,
  createMultiProviderKit
} from 'agentic-kit';

export type AgentProvider = 'ollama' | 'bradie';

export interface AgentConfig {
  provider: AgentProvider;
  ollamaEndpoint?: string;
  bradieEndpoint?: string;
  model?: string;
  sessionId?: string;
  projectId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: AgentProvider;
}

export interface StreamingCallbacks {
  onChunk?: (chunk: string) => void;
  onStateChange?: (state: string) => void;
  onSystemMessage?: (message: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export class AgenticKitService {
  private kit: AgentKit;
  private config: AgentConfig;
  private bradieAdapter?: BradieAdapter;
  private ollamaAdapter?: OllamaAdapter;

  constructor(config: AgentConfig) {
    this.config = config;
    this.kit = createMultiProviderKit();
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Ollama adapter
    this.ollamaAdapter = new OllamaAdapter(this.config.ollamaEndpoint || 'http://localhost:11434');
    
    // Patch the listModels method to handle the correct API response
    this.patchOllamaClient();
    
    this.kit.addProvider(this.ollamaAdapter);

    // Initialize Bradie adapter (will be configured when needed)
    if (this.config.bradieEndpoint) {
      this.setupBradieAdapter();
    }

    // Set current provider
    this.kit.setProvider(this.config.provider);
  }

  private patchOllamaClient() {
    if (!this.ollamaAdapter) return;
    
    const client = (this.ollamaAdapter as any).client;
    if (!client) return;
    
    // Patch the listModels method to handle the correct response format
    const originalListModels = client.listModels.bind(client);
    client.listModels = async () => {
      try {
        const response = await fetch(`${client.baseUrl}/api/tags`);
        if (!response.ok) {
          throw new Error(`Failed to list models: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Handle both possible response formats
        if (data.models && Array.isArray(data.models)) {
          // New format: {models: [{name: "model:tag", ...}, ...]}
          return data.models.map((model: any) => model.name || model.model);
        } else if (data.tags && Array.isArray(data.tags)) {
          // Old format: {tags: ["model:tag", ...]}
          return data.tags;
        } else {
          console.warn('Unexpected response format from Ollama API:', data);
          return [];
        }
      } catch (error) {
        // Fallback to original method if our patch fails
        console.warn('Patched listModels failed, falling back to original:', error);
        return originalListModels();
      }
    };
  }

  private setupBradieAdapter(callbacks?: StreamingCallbacks) {
    if (!this.config.bradieEndpoint) return;

    this.bradieAdapter = new BradieAdapter({
      domain: this.config.bradieEndpoint,
      onSystemMessage: callbacks?.onSystemMessage || (() => {}),
      onAssistantReply: callbacks?.onChunk || (() => {}),
      onError: callbacks?.onError || (() => {}),
      onComplete: callbacks?.onComplete || (() => {})
    });
    
    this.kit.addProvider(this.bradieAdapter);
  }

  public updateConfig(newConfig: Partial<AgentConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Re-initialize if endpoints changed
    if (newConfig.ollamaEndpoint || newConfig.bradieEndpoint || newConfig.provider) {
      this.initializeProviders();
    }
  }

  public setProvider(provider: AgentProvider) {
    this.config.provider = provider;
    this.kit.setProvider(provider);
  }

  public getCurrentProvider(): AgentProvider {
    return this.config.provider;
  }

  public getConfig(): AgentConfig {
    return { ...this.config };
  }

  public async generateResponse(
    prompt: string, 
    streaming: boolean = false, 
    callbacks?: StreamingCallbacks
  ): Promise<string | void> {
    try {
      const input = {
        model: this.config.model,
        prompt,
        stream: streaming
      };

      if (streaming && callbacks?.onChunk) {
        // For Bradie, we need to setup callbacks before generation
        if (this.config.provider === 'bradie' && this.config.bradieEndpoint) {
          this.setupBradieAdapter(callbacks);
          this.kit.setProvider('bradie');
        }

        const result = await this.kit.generate(input, {
          onChunk: callbacks.onChunk,
          onStateChange: callbacks.onStateChange,
          onError: callbacks.onError
        });
        
        // Manually call onComplete since the kit might not do it automatically
        if (callbacks.onComplete) {
          callbacks.onComplete();
        }
        
        return result;
      } else {
        const result = await this.kit.generate(input) as string;
        // For non-streaming, call onComplete if provided
        if (callbacks?.onComplete) {
          callbacks.onComplete();
        }
        return result;
      }
    } catch (error) {
      callbacks?.onError?.(error as Error);
      throw error;
    }
  }

  public async listOllamaModels(): Promise<string[]> {
    if (!this.ollamaAdapter) {
      throw new Error('Ollama adapter not initialized');
    }
    
    // Use the patched OllamaAdapter client
    try {
      const client = (this.ollamaAdapter as any).client;
      const models = await client.listModels();
      return models || [];
    } catch (error) {
      throw new Error(`Failed to list Ollama models: ${error}`);
    }
  }

  public async pullOllamaModel(model: string): Promise<void> {
    if (!this.ollamaAdapter) {
      throw new Error('Ollama adapter not initialized');
    }

    try {
      const client = (this.ollamaAdapter as any).client;
      await client.pullModel(model);
    } catch (error) {
      throw new Error(`Failed to pull model ${model}: ${error}`);
    }
  }

  public async deleteOllamaModel(model: string): Promise<void> {
    if (!this.ollamaAdapter) {
      throw new Error('Ollama adapter not initialized');
    }

    try {
      const client = (this.ollamaAdapter as any).client;
      await client.deleteModel(model);
    } catch (error) {
      throw new Error(`Failed to delete model ${model}: ${error}`);
    }
  }

  public async initBradieProject(projectName: string, projectPath: string): Promise<{ sessionId: string; projectId: string }> {
    if (!this.bradieAdapter) {
      throw new Error('Bradie adapter not initialized');
    }

    try {
      const client = (this.bradieAdapter as any).client;
      const result = await client.initProject(projectName, projectPath);
      this.config.sessionId = result.sessionId;
      this.config.projectId = result.projectId;
      return result;
    } catch (error) {
      throw new Error(`Failed to initialize Bradie project: ${error}`);
    }
  }

  public getBradieState(): string {
    if (!this.bradieAdapter) {
      return 'not_initialized';
    }
    
    try {
      return this.bradieAdapter.getState();
    } catch {
      return 'unknown';
    }
  }

  public async testConnection(provider: AgentProvider, endpoint: string): Promise<boolean> {
    try {
      if (provider === 'ollama') {
        const testAdapter = new OllamaAdapter(endpoint);
        const client = (testAdapter as any).client;
        await client.listModels();
        return true;
      } else if (provider === 'bradie') {
        // For Bradie, we can test by checking the health endpoint
        const response = await fetch(`${endpoint}/api/health`);
        return response.ok;
      }
      return false;
    } catch {
      return false;
    }
  }
}

// Global instance
let agenticKitService: AgenticKitService | null = null;

export function getAgenticKitService(): AgenticKitService {
  if (!agenticKitService) {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('agentic-kit-config');
    let config: AgentConfig = {
      provider: 'ollama',
      ollamaEndpoint: 'http://localhost:11434',
      bradieEndpoint: 'http://localhost:3001',
      model: 'mistral'
    };

    if (savedConfig) {
      try {
        config = { ...config, ...JSON.parse(savedConfig) };
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }

    agenticKitService = new AgenticKitService(config);
  }
  return agenticKitService;
}

export function updateAgenticKitConfig(config: Partial<AgentConfig>) {
  const service = getAgenticKitService();
  service.updateConfig(config);
  
  // Save to localStorage
  localStorage.setItem('agentic-kit-config', JSON.stringify(service.getConfig()));
}