# Ollama Client

A JavaScript/TypeScript client for the Ollama LLM server, supporting model listing, text generation, streaming responses, embeddings, and model management.

## Installation

```bash
npm install @agentic-kit/ollama
# or
yarn add @agentic-kit/ollama
```

## Usage

```typescript
import OllamaClient, { GenerateInput } from '@agentic-kit/ollama';

// Create a client (default port 11434)
const client = new OllamaClient('http://localhost:11434');

// List available models
const models = await client.listModels();
console.log('Available models:', models);

// Non-streaming text generation
const output = await client.generate({ model: 'mistral', prompt: 'Hello, Ollama!' });
console.log(output);

// Streaming generation
await client.generate(
  { model: 'mistral', prompt: 'Hello, streaming!', stream: true },
  (chunk) => {
    console.log('Received chunk:', chunk);
  }
);

// Pull a model to local cache
await client.pullModel('mistral');

// Generate embeddings
const embedding = await client.generateEmbedding('Compute embeddings');
console.log('Embedding vector length:', embedding.length);

// Generate a conversational response with context
const response = await client.generateResponse(
  'What is the capital of France?',
  'Geography trivia'
);
console.log(response);

// Delete a pulled model when done
await client.deleteModel('mistral');
```

## API Reference

- `new OllamaClient(baseUrl?: string)` – defaults to `http://localhost:11434`
- `.listModels(): Promise<string[]>`
- `.generate(input: GenerateInput, onChunk?: (chunk: string) => void): Promise<string | void>`
- `.generateStreamingResponse(prompt: string, onChunk: (chunk: string) => void, context?: string): Promise<void>`
- `.generateEmbedding(text: string): Promise<number[]>`
- `.generateResponse(prompt: string, context?: string): Promise<string>`
- `.pullModel(model: string): Promise<void>`
- `.deleteModel(model: string): Promise<void>`

## GenerateInput type

```ts
interface GenerateInput {
  model: string;
  prompt: string;
  stream?: boolean;
}
```

Source of the main class

```ts
import fetch from 'cross-fetch';

export interface GenerateInput {
  model: string;
  prompt: string;
  stream?: boolean;
}

interface TagsResponse {
  tags: string[];
}

interface GenerateResponse {
  text: string;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface OllamaEmbeddingResponse {
  embedding: number[];
}

export default class OllamaClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  public async listModels(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status} ${response.statusText}`);
    }
    const data: TagsResponse = await response.json();
    return data.tags;
  }

  public async generate(input: GenerateInput): Promise<string>;
  public async generate(input: GenerateInput, onChunk: (chunk: string) => void): Promise<string | void>;
  public async generate(
    input: GenerateInput, 
    onChunk?: (chunk: string) => void
  ): Promise<string | void> {
    if (input.stream && onChunk) {
      return this.generateStreamingResponse(input.prompt, onChunk);
    }
    
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        stream: input.stream || false
      }),
    });
    if (!response.ok) {
      let errorText: string;
      try {
        const errorData = await response.json();
        errorText = errorData.message ?? JSON.stringify(errorData);
      } catch {
        errorText = await response.text();
      }
      throw new Error(`Generate request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data: GenerateResponse = await response.json();
    return data.text;
  }

  public async pullModel(model: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: model }),
    });
    if (!response.ok) {
      let errorText: string;
      try {
        const errorData = await response.json();
        errorText = errorData.message ?? JSON.stringify(errorData);
      } catch {
        errorText = await response.text();
      }
      throw new Error(`Pull model failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
  }

  public async deleteModel(model: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: model }),
    });
    if (!response.ok) {
      let errorText: string;
      try {
        const errorData = await response.json();
        errorText = errorData.message ?? JSON.stringify(errorData);
      } catch {
        errorText = await response.text();
      }
      throw new Error(`Delete model failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate embedding: ${response.statusText}`);
    }

    const data: OllamaEmbeddingResponse = await response.json();
    return data.embedding;
  }

  public async generateResponse(prompt: string, context?: string): Promise<string> {
    const fullPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${prompt}\n\nAnswer:`
      : prompt;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: fullPrompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate response: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  }

  public async generateStreamingResponse(
    prompt: string,
    onChunk: (chunk: string) => void,
    context?: string
  ): Promise<void> {
    const fullPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${prompt}\n\nAnswer:`
      : prompt;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: fullPrompt,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate streaming response: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (done) break;
      const value = result.value;

      if (value) {
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data: OllamaResponse = JSON.parse(line);
            if (data.response) {
              onChunk(data.response);
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        }
      }
    }
  }
}

```