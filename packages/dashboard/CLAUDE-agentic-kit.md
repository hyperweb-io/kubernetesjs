# Agentic Kit

Agentic Kit is the core library providing a unified, streaming-capable interface for multiple LLM providers. It lets you plug in any supported adapter and switch between them at runtime.

## Installation

```bash
npm install agentic-kit
# or
yarn add agentic-kit
```

Agentic Kit includes adapters for Ollama and Bradie out of the box.

## Quick Start

```typescript
import {
  // Adapters
  OllamaAdapter,
  BradieAdapter,

  // Factory functions
  createOllamaKit,
  createBradieKit,
  createMultiProviderKit,

  // Core type
  AgentKit
} from 'agentic-kit';

// Ollama-only client
const ollamaKit: AgentKit = createOllamaKit('http://localhost:11434');
const text = await ollamaKit.generate({ model: 'mistral', prompt: 'Hello' });
console.log(text);

// Bradie-only client
const bradieKit: AgentKit = createBradieKit({
  domain: 'http://localhost:3000',
  onSystemMessage: (msg) => console.log('[system]', msg),
  onAssistantReply: (msg) => console.log('[assistant]', msg),
});
await bradieKit.generate({ prompt: 'Hello' });

// Multi-provider client
const multiKit = createMultiProviderKit();
multiKit.addProvider(new OllamaAdapter('http://localhost:11434'));
multiKit.addProvider(new BradieAdapter({
  domain: 'http://localhost:3000',
  onSystemMessage: console.log,
  onAssistantReply: console.log
}));
const reply = await multiKit.generate({ model: 'mistral', prompt: 'Hello' });
console.log(reply);
```

## Streaming

Both adapters support a streaming mode that invokes a callback for each data chunk.

```typescript
await ollamaKit.generate(
  { model: 'mistral', prompt: 'Hello', stream: true },
  (chunk) => console.log('Ollama chunk:', chunk)
);

await bradieKit.generate(
  { model: 'mistral', prompt: 'Hello', stream: true },
  (chunk) => console.log('Bradie chunk:', chunk)
);
```

## API Reference

### AgentKit

- `.generate(input: GenerateInput, options?: StreamingOptions): Promise<string | void>`
- `.listProviders(): string[]`
- `.setProvider(name: string): void`
- `.getCurrentProvider(): AgentProvider | undefined`

### GenerateInput

```ts
interface GenerateInput {
  model?: string;      // For services that support named models
  prompt: string;      // The text prompt
  stream?: boolean;    // If true, use streaming mode
}
```

### StreamingOptions

```ts
interface StreamingOptions {
  onChunk?: (chunk: string) => void;
  onStateChange?: (state: string) => void;
  onError?: (error: Error) => void;
}
```

Source of the main class

```ts
import { Bradie, BradieState } from '@agentic-kit/bradie';
import OllamaClient, { GenerateInput } from '@agentic-kit/ollama';

export interface AgentProvider {
  name: string;
  generate(input: GenerateInput): Promise<string>;
  generateStreaming(input: GenerateInput, onChunk: (chunk: string) => void): Promise<void>;
}

export interface StreamingOptions {
  onChunk?: (chunk: string) => void;
  onStateChange?: (state: string) => void;
  onError?: (error: Error) => void;
}

export class OllamaAdapter implements AgentProvider {
  public readonly name = 'ollama';
  private client: OllamaClient;

  constructor(baseUrl?: string) {
    this.client = new OllamaClient(baseUrl);
  }

  async generate(input: GenerateInput): Promise<string> {
    return this.client.generate(input);
  }

  async generateStreaming(input: GenerateInput, onChunk: (chunk: string) => void): Promise<void> {
    await this.client.generate({ ...input, stream: true }, onChunk);
  }
}

export class BradieAdapter implements AgentProvider {
  public readonly name = 'bradie';
  private client: Bradie;

  constructor(config: {
    domain: string;
    onSystemMessage: (msg: string) => void;
    onAssistantReply: (msg: string) => void;
    onError?: (err: Error) => void;
    onComplete?: () => void;
  }) {
    this.client = new Bradie(config);
  }

  async generate(input: GenerateInput): Promise<string> {
    const requestId = await this.client.sendMessage(input.prompt);
    return new Promise((resolve, reject) => {
      this.client.subscribeToResponse(requestId)
        .then(() => resolve('Response completed'))
        .catch(reject);
    });
  }

  async generateStreaming(input: GenerateInput, onChunk: (chunk: string) => void): Promise<void> {
    const requestId = await this.client.sendMessage(input.prompt);
    await this.client.subscribeToResponse(requestId);
  }

  getState(): BradieState {
    return this.client.getState();
  }
}

export class AgentKit {
  private providers: Map<string, AgentProvider> = new Map();
  private currentProvider?: AgentProvider;

  addProvider(provider: AgentProvider): void {
    this.providers.set(provider.name, provider);
    if (!this.currentProvider) {
      this.currentProvider = provider;
    }
  }

  setProvider(name: string): void {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider '${name}' not found`);
    }
    this.currentProvider = provider;
  }

  getCurrentProvider(): AgentProvider | undefined {
    return this.currentProvider;
  }

  async generate(input: GenerateInput, options?: StreamingOptions): Promise<string | void> {
    if (!this.currentProvider) {
      throw new Error('No provider set');
    }

    if (input.stream && options?.onChunk) {
      return this.currentProvider.generateStreaming(input, options.onChunk);
    }

    return this.currentProvider.generate(input);
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export function createOllamaKit(baseUrl?: string): AgentKit {
  const kit = new AgentKit();
  kit.addProvider(new OllamaAdapter(baseUrl));
  return kit;
}

export function createBradieKit(config: {
  domain: string;
  onSystemMessage: (msg: string) => void;
  onAssistantReply: (msg: string) => void;
  onError?: (err: Error) => void;
  onComplete?: () => void;
}): AgentKit {
  const kit = new AgentKit();
  kit.addProvider(new BradieAdapter(config));
  return kit;
}

export function createMultiProviderKit(): AgentKit {
  return new AgentKit();
}
```
