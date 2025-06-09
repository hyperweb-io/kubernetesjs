// Shared types for agent system

export interface Session {
  id: string
  name: string
  path: string
  createdAt: Date
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  agent?: 'bradie' | 'ollama'
}

export interface AgentConfig {
  agent: 'bradie' | 'ollama'
  endpoint: string
  model?: string
  bradieDomain?: string
  session?: Session | null
}
