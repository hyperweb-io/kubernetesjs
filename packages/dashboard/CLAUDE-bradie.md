# Bradie Client

A Node.js client for the Bradie LLM service, providing project initialization, messaging, streaming responses, and log retrieval.

## Installation

```bash
npm install @agentic-kit/bradie
# or
yarn add @agentic-kit/bradie
```

## Usage

```typescript
import { Bradie } from '@agentic-kit/bradie';

// 1. Configure callbacks and create client
const client = new Bradie({
  domain: 'http://localhost:3001',
  onSystemMessage: (msg) => console.log('[system]', msg),
  onAssistantReply: (msg) => console.log('[assistant]', msg),
  onError: (err) => console.error('[error]', err),
  onComplete: () => console.log('[complete]'),
});

// 2. Initialize a project (creates session & project IDs)
const { sessionId, projectId } = await client.initProject(
  'my-project',
  '/path/to/project'
);
console.log('Session ID:', sessionId, 'Project ID:', projectId);

// 3. Send a message and get a request ID
const requestId = await client.sendMessage('Hello, Bradie!');
console.log('Request ID:', requestId);

// 4. Subscribe to streaming logs (chat messages & system events)
await client.subscribeToResponse(requestId);
```

### fetchOnce

Retrieve the complete array of command logs for a given request:

```typescript
const logs = await client.fetchOnce(requestId);
console.log(logs);
```


Source of the main class

```ts
import fetch from 'cross-fetch';
import { Buffer } from 'buffer';

export type BradieState = 'idle' | 'thinking' | 'streaming' | 'complete' | 'error';

export type Command =
  | 'read_file'
  | 'modify_file'
  | 'create_file'
  | 'search_file'
  | 'chat'
  | 'analyze'
  | 'delete_file'
  | 'run_code';

export interface AgentCommandLog {
  command: Command;
  error: string | null;
  parameters?: Record<string, any>;
  message?: string;
  result?: any;
}

export type ActionLog =
  | { type: 'assistant'; content: string }
  | { type: 'system'; content: string }
  | { type: 'error'; content: string }
  | { type: 'complete'; content?: string };

interface InstanceIdResponse { instanceId: string; }
interface InitResponse { sessionId: string; projectId: string; }
interface ActResponse {
  act_json: AgentCommandLog[];
  status: BradieState;
  error?: string;
}

export class Bradie {
  private domain: string;
  private onSystemMessage: (msg: string) => void;
  private onAssistantReply: (msg: string) => void;
  private onError?: (err: Error) => void;
  private onComplete?: () => void;
  private state: BradieState = 'idle';
  private sessionId?: string;
  private projectId?: string;
  private seenLogs: Set<string> = new Set();

  constructor(config: {
    domain: string;
    onSystemMessage: (msg: string) => void;
    onAssistantReply: (msg: string) => void;
    onError?: (err: Error) => void;
    onComplete?: () => void;
  }) {
    this.domain = config.domain;
    this.onSystemMessage = config.onSystemMessage;
    this.onAssistantReply = config.onAssistantReply;
    this.onError = config.onError;
    this.onComplete = config.onComplete;
  }

  public getState(): BradieState {
    return this.state;
  }

  public async initProject(
    projectName: string,
    projectPath: string
  ): Promise<{ sessionId: string; projectId: string }> {
    const res1 = await fetch(`${this.domain}/api/instance-id`);
    if (!res1.ok) {
      const bodyText = await res1.text();
      let parsed: any;
      try { parsed = JSON.parse(bodyText); } catch {}
      const details = parsed?.error ?? parsed?.message ?? bodyText;
      throw new Error(`Failed to get instance ID: ${res1.status} ${res1.statusText} - ${details}`);
    }
    const { instanceId }: InstanceIdResponse = await res1.json();

    const res2 = await fetch(`${this.domain}/api/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instanceId, projectName, projectPath }),
    });
    if (!res2.ok) {
      const bodyText = await res2.text();
      let parsed: any;
      try { parsed = JSON.parse(bodyText); } catch {}
      const details = parsed?.error ?? parsed?.message ?? bodyText;
      throw new Error(`Failed to init project: ${res2.status} ${res2.statusText} - ${details}`);
    }
    const { sessionId, projectId }: InitResponse = await res2.json();
    this.sessionId = sessionId;
    this.projectId = projectId;
    return { sessionId, projectId };
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.sessionId) throw new Error('Project not initialized');
    this.state = 'thinking';
    const res = await fetch(`${this.domain}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: this.sessionId, message }),
    });
    if (!res.ok) {
      const bodyText = await res.text();
      let parsed: any;
      try { parsed = JSON.parse(bodyText); } catch {}
      const details = parsed?.error ?? parsed?.message ?? bodyText;
      throw new Error(`Failed to send message: ${res.status} ${res.statusText} - ${details}`);
    }
    const data: { requestId: string; message: string; image?: string } = await res.json();
    return data.requestId;
  }

  public async subscribeToResponse(
    requestId: string,
    opts?: { pollInterval?: number; maxPolls?: number }
  ): Promise<void> {
    if (!this.sessionId) throw new Error('Project not initialized');
    const interval = opts?.pollInterval ?? 1000;
    const maxPolls = opts?.maxPolls ?? Infinity;
    let polls = 0;

    return new Promise<void>((resolve, reject) => {
      const poll = async () => {
        try {
          const res = await fetch(
            `${this.domain}/api/act?sessionId=${this.sessionId}&requestId=${requestId}`
          );
          if (!res.ok) {
            let details: string;
            try {
              details = await res.text();
            } catch {
              details = 'No response body';
            }
            throw new Error(`Poll failed: ${res.status} ${res.statusText} - ${details}`);
          }
          const data: ActResponse = await res.json();
          this.state = data.status;

          for (const log of data.act_json) {
            const key = JSON.stringify(log);
            if (!this.seenLogs.has(key)) {
              this.seenLogs.add(key);
              if (log.error) {
                this.state = 'error';
                this.onError?.(new Error(log.error));
                return reject(new Error(log.error));
              } else if (log.command === 'chat') {
                const content = log.parameters?.message || log.message || '';
                this.onAssistantReply(content);
              } else {
                this.onSystemMessage(
                  `✅ ${log.command}: ${log.message ?? JSON.stringify(log.result)}`
                );
              }
            }
          }

          if (data.status === 'complete') {
            this.state = 'complete';
            this.onComplete?.();
            return resolve();
          } else if (data.status === 'error') {
            this.state = 'error';
            this.onError?.(new Error(data.error || 'Unknown error'));
            return reject(new Error(data.error));
          }

          polls++;
          if (polls >= maxPolls) {
            return reject(new Error('Max polls exceeded'));
          }
          setTimeout(poll, interval);
        } catch (err: any) {
          this.state = 'error';
          this.onError?.(err);
          return reject(err);
        }
      };
      poll();
    });
  }

  public async fetchOnce(requestId: string): Promise<AgentCommandLog[]> {
    if (!this.sessionId) throw new Error('Project not initialized');
    const res = await fetch(
      `${this.domain}/api/act?sessionId=${this.sessionId}&requestId=${requestId}`
    );
    if (!res.ok) throw new Error(`Failed to fetch logs: ${res.statusText}`);
    const data: ActResponse = await res.json();
    return data.act_json;
  }

  // --- API Wrapper Methods ---

  public async getInstanceId(): Promise<{ instanceId: string; port: number }> {
    const res = await fetch(`${this.domain}/api/instance-id`);
    if (!res.ok) throw new Error(`getInstanceId failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async getInstanceInfo(): Promise<{ instance_id: string; backend_port: number; frontend_port?: number }> {
    const res = await fetch(`${this.domain}/api/instance-info`);
    if (!res.ok) throw new Error(`getInstanceInfo failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async health(): Promise<any> {
    const res = await fetch(`${this.domain}/api/health`);
    if (!res.ok) throw new Error(`health check failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async getFileTree(sessionId: string, instanceId: string): Promise<any> {
    const url = new URL(`${this.domain}/api/files/tree`);
    url.searchParams.append('sessionId', sessionId);
    url.searchParams.append('instanceId', instanceId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`getFileTree failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async readFile(sessionId: string, filePath: string): Promise<{ content: string }> {
    const url = new URL(`${this.domain}/api/files/read`);
    url.searchParams.append('sessionId', sessionId);
    url.searchParams.append('path', filePath);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`readFile failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async writeFile(sessionId: string, filePath: string, content: string): Promise<{ success: boolean }> {
    const res = await fetch(`${this.domain}/api/files/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, path: filePath, content }),
    });
    if (!res.ok) throw new Error(`writeFile failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async terminalStatus(sessionId: string): Promise<{ status: string; project_path: string }> {
    const url = new URL(`${this.domain}/api/terminal-status`);
    url.searchParams.append('sessionId', sessionId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`terminalStatus failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async getMode(): Promise<{ mode: string; projectName: string | null; projectPath: string | null }> {
    const res = await fetch(`${this.domain}/api/mode`);
    if (!res.ok) throw new Error(`getMode failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async listProjects(): Promise<Record<string, any>> {
    const res = await fetch(`${this.domain}/api/projects`);
    if (!res.ok) throw new Error(`listProjects failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async getProject(projectId: string): Promise<any> {
    const res = await fetch(`${this.domain}/api/project/${projectId}`);
    if (!res.ok) throw new Error(`getProject failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async getProjectSummary(sessionId: string): Promise<any> {
    const url = new URL(`${this.domain}/api/project_summary`);
    url.searchParams.append('sessionId', sessionId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`getProjectSummary failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async getStatus(sessionId: string): Promise<any> {
    const url = new URL(`${this.domain}/api/status`);
    url.searchParams.append('sessionId', sessionId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`getStatus failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async postStatus(sessionId: string): Promise<any> {
    const res = await fetch(`${this.domain}/api/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) throw new Error(`postStatus failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async recoverMessages(sessionId: string): Promise<any[]> {
    const url = new URL(`${this.domain}/api/recover_message`);
    url.searchParams.append('sessionId', sessionId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`recoverMessages failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async transcribe(sessionId: string, file: Blob | Buffer | File): Promise<{ text: string }> {
    const form = new FormData();
    form.append('sessionId', sessionId);
    form.append('file', file as any);
    const res = await fetch(`${this.domain}/api/transcribe`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error(`transcribe failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async tts(text: string): Promise<Buffer> {
    const res = await fetch(`${this.domain}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`tts failed: ${res.status} ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  public async offlineStatus(): Promise<'available' | 'unavailable'> {
    const res = await fetch(`${this.domain}/api/offline-status`);
    if (!res.ok) throw new Error(`offlineStatus failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.status;
  }

  public async getProjectRepo(sessionId: string): Promise<{ path: string; url: string }> {
    const url = new URL(`${this.domain}/api/project_repo`);
    url.searchParams.append('sessionId', sessionId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`getProjectRepo failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  public async stopAgent(sessionId: string): Promise<boolean> {
    const res = await fetch(`${this.domain}/api/stop_agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) throw new Error(`stopAgent failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.success;
  }

  public async resetAgent(sessionId: string): Promise<boolean> {
    const res = await fetch(`${this.domain}/api/reset_agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) throw new Error(`resetAgent failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.success;
  }

  public async feedback(sessionId: string, feedback: Record<string, any>): Promise<boolean> {
    const res = await fetch(`${this.domain}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, ...feedback }),
    });
    if (!res.ok) throw new Error(`feedback failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.success;
  }

  public async feedbackMessage(sessionId: string, messageId: string, feedback: Record<string, any>): Promise<boolean> {
    const res = await fetch(`${this.domain}/api/feedback/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, messageId, ...feedback }),
    });
    if (!res.ok) throw new Error(`feedbackMessage failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.success;
  }
}
```